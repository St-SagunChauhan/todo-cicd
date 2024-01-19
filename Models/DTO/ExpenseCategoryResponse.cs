using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class ExpenseCategoryResponse : BaseResponse
    {
        public ExpenseCategory? ExpenseCategoryResult { get; set; }
    }
}
