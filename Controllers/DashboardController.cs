using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class DashboardController : ControllerBase
    {
        #region Constructor and Service Initialization

        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        #endregion

        /// <summary>
        /// Dashboard Projects Billing
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
		[Route("getDashboardData")]
		[Authorize(nameof(Role.TeamLead))]
		public async Task<IActionResult> DashboardProjectBilling()
        {
            try
            {
                return Ok(await _dashboardService.GetEmployeeHoursDetail());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
