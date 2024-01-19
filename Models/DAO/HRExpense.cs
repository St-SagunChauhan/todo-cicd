﻿using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class HRExpense:EntityBase
    {
        [Key]
        public Guid ExpenseId { get; set; }
        public string? ExpenseName { get; set; }
        public string? January { get; set; }
        public string? February { get; set; }
        public string? March { get; set; }
        public string? April { get; set; }
        public string? May { get; set; }
        public string? June { get; set; }
        public string? July { get; set; }
        public string? August { get; set; }
        public string? September { get; set; }
        public string? October { get; set; }
        public string? November { get; set; }
        public string? December { get; set; }
        public string? ExpenseYear { get; set; }
    }
}
