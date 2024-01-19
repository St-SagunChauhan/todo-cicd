namespace ST.ERP.Models.DTO
{
    public class ExpenseCategoryRequest
    {
        public Guid ExpenseCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsActive { get; set; }
    }
}
