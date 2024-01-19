using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    [Authorize($"{nameof(Role.Admin)},{nameof(Role.TeamLead)},{nameof(Role.BD)},{nameof(Role.BDM)},{nameof(Role.Employee)}")]
    public class MarketPlaceAccountController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IMarketPlaceAccountService _marketplaceAccount;

        public MarketPlaceAccountController(IMarketPlaceAccountService marketplaceAccount)
        {
            _marketplaceAccount = marketplaceAccount;
        }

        #endregion

        /// <summary>
        /// Create Marketplace Account
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createMarketPlaceAccount")]
        public async Task<IActionResult> CreateMarketplaceAccount([FromBody] MarketPlaceAccountsRequest request)
        {
            try
            {
                return Ok(await _marketplaceAccount.CreateMarketPlaceAccount(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update MarketPlace Account
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateMarketPlaceAccount")]
        public async Task<IActionResult> UpdateMarketPlaceAccount(MarketPlaceAccountsRequest request)
        {
            try
            {
                return Ok(await _marketplaceAccount.CreateMarketPlaceAccount(request));
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
        [HttpDelete("{Id:guid}")]
        [Route("deleteMarketPlaceAccount")]
        public async Task<IActionResult> DeleteMarketPlaceAccount(Guid id)
        {
            try
            {
                return Ok(await _marketplaceAccount.DeleteMarketPlaceAccount(id));
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
        [HttpGet("{Id:guid}")]
        [Route("getMarketPlaceAccountById/{id}")]
        public async Task<IActionResult> GetMarketPlaceAccountById(Guid id)
        {
            try
            {
                return Ok(await _marketplaceAccount.GetMarketPlaceAccountById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All MarketPlace Accounts
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllMarketPlaceAccounts")]
        public async Task<IActionResult> GetAllMarketPlaceAccounts()
        {
            try
            {
                return Ok(await _marketplaceAccount.GetMarketPlaceAccounts());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
