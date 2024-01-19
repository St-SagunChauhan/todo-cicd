using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IExpenseCategoryService
    {
        Task<ExpenseCategoryResponse> CreateExpenseCategory(ExpenseCategoryRequest request);
        Task<ExpenseCategoryResponse> DeleteExpenseCategory(Guid ExpenseCategoryId);
        Task<ExpenseCategoryResponse> GetExpenseCategoryById(Guid ExpenseCategoryId);
        Task<List<ExpenseCategory>> GetExpenseCategories();
    }
}
