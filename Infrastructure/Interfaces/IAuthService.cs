using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface  for Auth Service
    /// </summary>
    public interface IAuthService
    {
        Task<EmployeeResponse> Authenticate(string username, string password);
        Task<EmployeeResponse> ImpersonateUser(ImpersonateUserRequest request);
        Task<EmployeeResponse> StopImpersonation(ImpersonateUserRequest request);
    }
}
