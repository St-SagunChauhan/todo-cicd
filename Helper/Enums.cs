using System.ComponentModel;

namespace ST.ERP.Helper
{
    public class Enums
    {
        public enum ProjectHealthRate
        {
            Green = 1,
            Yellow,
            Red
        }
        public enum Status
        {
            Applied = 1,
            Lead,
            Hired
        }
        public enum ContractStatus
        {
            FullTime = 1,
            PartTime,
            ActiveButNoWork,
            Completed,
            Closed
        }
        public enum Role
        {
            Admin = 1,
            BDM,
            BD,
            TeamLead,
            Employee,
            HR
        }
        public enum Department
        {
            [Description("Business Development")]
            BusinessDevelopment = 1,
            [Description("Dot Net Framework Technology Department")]
            DotNetFrameworkTechnologyDepartment,
            [Description("Management")]
            Management,
            [Description("PHP Technology Department")]
            PHPTechnologyDepartment,
            [Description("Javascript Framework Technology Department")]
            JavascriptFrameworkTechnologyDepartment,
            [Description("Quality Analysis Department")]
            QualityAnalysisDepartment,
            [Description("Creative and Digital Marketing Department")]
            CreativeAndDigitalMarketingDepartment
        }
    }
}
