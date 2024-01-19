using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class ExpenseCategory : EntityBase
    {
        [Key]
        public Guid ExpenseCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsActive { get; set; }
    }
}
