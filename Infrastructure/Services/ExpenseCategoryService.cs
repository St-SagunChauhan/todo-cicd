using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Services
{
    public class ExpenseCategoryService : IExpenseCategoryService
    {
        #region Field
        public readonly STERPContext _context;
        private readonly IMapper _mapper;
        #endregion

        #region Constructor
        public ExpenseCategoryService(STERPContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create Expense Category
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ExpenseCategoryResponse> CreateExpenseCategory(ExpenseCategoryRequest request)
        {
            try
            {
                var dbExpenseCategoryById = await _context.ExpenseCategory.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.ExpenseCategoryId == request.ExpenseCategoryId);

                var dbExpenseCategoryByName = await _context.ExpenseCategory.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.CategoryName == request.CategoryName);

                if (dbExpenseCategoryById == null)
                {
                    if(dbExpenseCategoryByName is not null)
                    {
                        if(dbExpenseCategoryByName.IsActive == false)
                        {
                            dbExpenseCategoryByName.IsActive = true;
                            _context.ExpenseCategory.Update(dbExpenseCategoryByName);
                        }
                        if (dbExpenseCategoryByName.IsActive == true)
                        {
                            throw new AppException($"Expense Category name already exist in the database");
                        }
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        var expenseCategory = _mapper.Map<ExpenseCategory>(request);
                        await _context.ExpenseCategory.AddAsync(expenseCategory);
                        await _context.SaveChangesAsync();
                    }
                    return new ExpenseCategoryResponse { Success = true, Message = "Expense category added successfully" };
                }
                else
                {
                    var expenseCategory = _mapper.Map(request, new ExpenseCategory()
                    {
                        CreatedBy = dbExpenseCategoryById.CreatedBy,
                        CreatedDate = dbExpenseCategoryById.CreatedDate,
                    });
                    _context.ExpenseCategory.Update(expenseCategory);
                    await _context.SaveChangesAsync();
                    return new ExpenseCategoryResponse {Success = true , Message = "Expense Category updated successfully" };
                }
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
        public async Task<ExpenseCategoryResponse> DeleteExpenseCategory(Guid ExpenseCategoryId)
        {
            try
            {
                var dbExpenseCategory = await _context.ExpenseCategory.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.ExpenseCategoryId == ExpenseCategoryId);
                if (dbExpenseCategory is not null)
                {
                    dbExpenseCategory.IsActive = false;
                    _context.ExpenseCategory.Update(dbExpenseCategory);
                    await _context.SaveChangesAsync();
                    return new ExpenseCategoryResponse { Success = true, Message = "Expense Category deleted successfully" };
                }
                else
                {
                    throw new AppException($"Expense Category doesn't exist in the database!");
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Expense Categories
        /// </summary>
        /// <exception cref="AppException"></exception>
        public async Task<List<ExpenseCategory>> GetExpenseCategories()
        {
            try
            {
                return await _context.ExpenseCategory.AsNoTracking().Where(x => x.IsActive).ToListAsync();    
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Expense Category By Id
        /// </summary>
        /// <param name="ExpenseCategoryId"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ExpenseCategoryResponse> GetExpenseCategoryById(Guid ExpenseCategoryId)
        {
            try
            {
                var dbExpenseCategory = await _context.ExpenseCategory.AsNoTracking().FirstOrDefaultAsync(x => x.ExpenseCategoryId == ExpenseCategoryId);
                if(dbExpenseCategory is not null)
                {
                    var expenseCategory = _mapper.Map<ExpenseCategory>(dbExpenseCategory);
                    return new ExpenseCategoryResponse { Success = true, Message = "Expense Category found successfully", ExpenseCategoryResult = expenseCategory };
                }
                else
                {
                    throw new AppException($"Expense Category doesn't exist in the database!");
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion
    }
}
