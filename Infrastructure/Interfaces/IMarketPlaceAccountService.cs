using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface  for MarketPlace Account Service
    /// </summary>
    public interface IMarketPlaceAccountService
    {
        Task<MarketPlaceAccountsResponse> CreateMarketPlaceAccount(MarketPlaceAccountsRequest request);
        Task<MarketPlaceAccountsResponse> DeleteMarketPlaceAccount(Guid Id);
        Task<MarketPlaceAccountsResponse> GetMarketPlaceAccountById(Guid Id);
        Task<List<MarketPlaceAccountsRequest>> GetMarketPlaceAccounts();
    }
}
