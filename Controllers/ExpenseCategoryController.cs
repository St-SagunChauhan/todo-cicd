using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class ExpenseCategoryController : ControllerBase
    {
        #region Field
        private readonly IExpenseCategoryService _expenseCategoryService;
        private readonly ILogger<ExpenseCategoryController> _logger;
        #endregion

        #region Constructor
        public ExpenseCategoryController(IExpenseCategoryService expenseCategoryService, ILogger<ExpenseCategoryController> logger)
        {
            _expenseCategoryService = expenseCategoryService;
            _logger = logger;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create Expense Category
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createExpenseCategory")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> CreateExpenseCategory([FromBody] ExpenseCategoryRequest request)
        {
            try
            {
                return Ok(await _expenseCategoryService.CreateExpenseCategory(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Expense Category
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateExpenseCategory")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> UpdateExpenseCategory(ExpenseCategoryRequest request)
        {
            try
            {
                return Ok(await _expenseCategoryService.CreateExpenseCategory(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Expense Category
        /// </summary>
        /// <param name="ExpenseCategoryId"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete()]
        [Route("deleteExpenseCategory/{expenseCategoryID}")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> DeleteExpenseCategory(Guid ExpenseCategoryId)
        {
            try
            {
                _logger.LogInformation($"Deleting department with ID {ExpenseCategoryId}");
                var result = await _expenseCategoryService.DeleteExpenseCategory(ExpenseCategoryId);
                _logger.LogInformation($"Expense Category with ID {ExpenseCategoryId} deleted successfully");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting Expense Category with ID {ex.Message}");
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Expense Category By Id
        /// </summary>
        /// <param name="ExpenseCategoryId"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{ExpenseCategoryId:guid}")]
        [Route("getExpenseCategoryById/{id}")]
        public async Task<IActionResult> GetExpenseCategoryById(Guid ExpenseCategoryId)
        {
            try
            {
                return Ok(await _expenseCategoryService.GetExpenseCategoryById(ExpenseCategoryId));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Expense Categories
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllExpenseCategories")]
        public async Task<IActionResult> GetExpenseCategories()
        {
            try
            {
                return Ok(await _expenseCategoryService.GetExpenseCategories());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion
    }
}
