using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Services
{
    public class MarketPlaceAccountService : IMarketPlaceAccountService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        #endregion

        #region Constructor
        public MarketPlaceAccountService(STERPContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// Create MarketPlace Account
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<MarketPlaceAccountsResponse> CreateMarketPlaceAccount(MarketPlaceAccountsRequest request)
        {
            try
            {
                var marketPlaceAccount = await _context.MarketPlaceAccounts.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.Id);
                var dbmarketPlaceAccountName = await _context.MarketPlaceAccounts.AsNoTracking().FirstOrDefaultAsync(x => x.Name == request.Name);
                if (marketPlaceAccount == null)
                {
                    if (dbmarketPlaceAccountName is not null)
                    {
                        if (dbmarketPlaceAccountName.IsActive == false)
                        {
                            dbmarketPlaceAccountName.IsActive = true;
                            _context.MarketPlaceAccounts.Update(dbmarketPlaceAccountName);
                        }
                        else
                        {
                            throw new AppException($"Upwork Id of same name is already in the database");
                        }
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        request.IsActive = true;
                        request.Accounts = request.Accounts;
                        request.MarketPlaceAccountsStatus = request.MarketPlaceAccountsStatus;
                        var upworkData = _mapper.Map<MarketPlaceAccount>(request);
                        await _context.MarketPlaceAccounts.AddAsync(upworkData);
                        await _context.SaveChangesAsync();
                    }
                    return new MarketPlaceAccountsResponse { Success = true, Message = "Record Created Successfully", MarketPlaceAccount = request };
                }
                else
                {
                    request.IsActive = true;
                    request.CreatedBy = marketPlaceAccount.CreatedBy;
                    request.CreatedDate = marketPlaceAccount.CreatedDate;
                    request.Accounts = request.Accounts;
                    request.MarketPlaceAccountsStatus = request.MarketPlaceAccountsStatus;
                    var upworkData = _mapper.Map<MarketPlaceAccount>(request);
                    _context.MarketPlaceAccounts.Update(upworkData);
                    await _context.SaveChangesAsync();
                    return new MarketPlaceAccountsResponse { Success = true, Message = "Record Updated Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete MarketPlace Account
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<MarketPlaceAccountsResponse> DeleteMarketPlaceAccount(Guid id)
        {
            try
            {
                var marketPlaceAccount = await _context.MarketPlaceAccounts.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                if (marketPlaceAccount is not null)
                {
                    marketPlaceAccount.IsActive = false;
                    _context.MarketPlaceAccounts.Update(marketPlaceAccount);
                    await _context.SaveChangesAsync();
                    return new MarketPlaceAccountsResponse { Success = true, Message = "Record deleted successfully!" };
                }

                throw new AppException($"Record not Found/Removed");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get MarketPlace Account By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<MarketPlaceAccountsResponse> GetMarketPlaceAccountById(Guid id)
        {
            try
            {
                var upwork = await _context.MarketPlaceAccounts.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                if (upwork is not null)
                {
                    var marketPlaceAccountsData = _mapper.Map<MarketPlaceAccountsRequest>(upwork);
                    marketPlaceAccountsData.Accounts = marketPlaceAccountsData.Accounts;
                    return new MarketPlaceAccountsResponse { Success = true, MarketPlaceAccount = marketPlaceAccountsData, Message = "Record found Successfully" };
                }

                throw new AppException($"Record not Found/Removed");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get MarketPlace Accounts
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<MarketPlaceAccountsRequest>> GetMarketPlaceAccounts()
        {
            try
            {
                var result = await _context.MarketPlaceAccounts.Where(x => x.IsActive).OrderByDescending(m => m.Id).ToListAsync();
                var allMarketPlaceData = _mapper.Map<List<MarketPlaceAccountsRequest>>(result);

                foreach (var item in allMarketPlaceData)
                {
                    item.Accounts = item.Accounts;
                }
                return allMarketPlaceData;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion
    }
}
