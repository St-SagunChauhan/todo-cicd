using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ST.ERP.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        #region Fields
        private readonly STERPContext _context;
        private const string SupremeDomain = "supremetechnologiesindia.com";
        public IConfiguration _configuration;
        #endregion

        #region Constructor
        public AuthService(STERPContext context, IConfiguration config)
        {
            _context = context;
            _configuration = config;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Authenticate
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeResponse> Authenticate(string email, string password)
        {
            try
            {
                if (email.Contains('@'))
                {
                    var domain = email.Split("@")[1];
                    if (domain is not SupremeDomain)
                    {
                        throw new AppException("Organization Domain is incorrect!");
                    }
                }
                else
                {
                    throw new AppException("Email is Incorrect");
                }

                var isValidCredentials = await AuthenticationUtility.AcquireATokenFromCacheOrUsernamePasswordAsync(password, email, _configuration);

                var user = await _context.Employees.Include(x => x.Department).AsNoTracking().FirstOrDefaultAsync(x => x.Email == email && x.IsActive);

                await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC UpdateEmployeeImpersonation"); // Call the stored procedure to set Impersonation to false

                if (isValidCredentials is not null && user is not null)
                {
                    var token = GenerateJwtToken(user);
                    return new EmployeeResponse { Success = true, Token = token, Message = "User Logged in Successfully!", User = user };
                }

                throw new AppException("Invalid Password");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<EmployeeResponse> ImpersonateUser(ImpersonateUserRequest request)
        {
            try
            {
                var impersonator = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == request.ImpersonatorId);
                var impersonatedUser = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == request.ImpersonatedUserId);

                var token = GenerateJwtToken(impersonatedUser);
                if (impersonator.IsInImpersonation is null or false)
                {
                    impersonator.IsInImpersonation = true;
                    _context.Employees.Update(impersonator);
                    await _context.SaveChangesAsync();
                    return new EmployeeResponse { Success = true, Message = "Impersonation Started Successfully", User = impersonatedUser, Token = token };
                }
                return new EmployeeResponse { Success = false, Message = "Unable to impersonate user" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<EmployeeResponse> StopImpersonation(ImpersonateUserRequest request)
        {
            try
            {
                var loggedInUser = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == request.ImpersonatedUserId);

                var impersonator = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == request.ImpersonatorId);

                if (loggedInUser is not null && impersonator is not null)
                {
                    var token = GenerateJwtToken(impersonator);
                    if (impersonator.IsInImpersonation == true)
                    {
                        impersonator.IsInImpersonation = false;
                        _context.Employees.Update(impersonator);
                        await _context.SaveChangesAsync();
                        return new EmployeeResponse { Success = true, Message = "Impersonation Stopped Successfully", User = impersonator, Token = token };
                    }
                }
                return new EmployeeResponse { Success = false, Message = "Unable to stop impersonation", User = null };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #endregion

        #region private Methods
        /// <summary>
        /// Generate Jwt Token
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private string GenerateJwtToken(Employee user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("EmployeeId", user.EmployeeId.ToString()),
                        new Claim("EmployeeEmail", user.Email),
                        new Claim("Role",user.Role),
                         new Claim("Department",user.DepartmentId.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: signIn);
            //var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        #endregion
    }
}
