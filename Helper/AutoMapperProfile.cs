using AutoMapper;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<EmployeeResponseData, Employee>().ReverseMap();
            CreateMap<ClientRequest, Client>().ReverseMap();
            CreateMap<CreateEODReportRequest, EODReport>().ReverseMap();
            CreateMap<DepartmentRequest, Department>();
            CreateMap<ExpenseCategoryRequest, ExpenseCategory>().ReverseMap();
            CreateMap<CreateEmployeeRequest, Employee>().ReverseMap();
            CreateMap<ImporterConnectRequest, Client>().ReverseMap();
            CreateMap<ProjectRequest, Project>()
                .ForMember(dest => dest.ContractType, opt => opt.MapFrom(src => src.ContractType));
            CreateMap<EditProjectRequest, Project>()
                .ForMember(dest => dest.ContractType, opt => opt.MapFrom(src => src.ContractType))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProjectId))
                .ForMember(dest => dest.ContractName, opt => opt.MapFrom(src => src.ContractName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.BillingStatus, opt => opt.MapFrom(src => src.BillingStatus))
                .ForMember(dest => dest.ContractType, opt => opt.MapFrom(src => Convert.ToInt32(src.ContractType)))
                .ForMember(dest => dest.HoursPerWeek, opt => opt.MapFrom(src => Convert.ToString(src.HoursPerWeek)))
                .ForMember(dest => dest.ProjectUrl, opt => opt.MapFrom(src => src.ProjectUrl))
                .ForMember(dest => dest.CommunicationMode, opt => opt.MapFrom(src => src.CommunicationMode));
            CreateMap<ProjectRequest, ProjectHealth>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.StartDate));
            CreateMap<MarketPlaceAccountsRequest, MarketPlaceAccount>().ReverseMap();
            CreateMap<ConnectRequest, Connect>();
            CreateMap<ProjectBillingDataRequest, ProjectBilling>().ReverseMap();
            CreateMap<EmployeeSalariesRequest, EmployeeSalary>();
            CreateMap<LeaveRequest, Leave>();
            CreateMap<LeaveResponseData, Leave>().ReverseMap();
            CreateMap<Connect, ConnectResponseData>().ReverseMap();
            CreateMap<LeaveRequest, LeaveHistory>().ReverseMap();
            CreateMap<ProjectRequest, EmployeeProject>().ReverseMap();
            CreateMap<ProjectRequest, ProjectDepartment>().ReverseMap();
            CreateMap<ClientResponseData, ClientRequest>().ReverseMap();
            CreateMap<ImporterTeamLogsRequest, TeamLoggerReport>().ForMember(dest => dest.RecordDate, opt => opt.MapFrom(src => DateTime.Parse(src.RecordDate)));
            CreateMap<ClientResponseData, Client>().ReverseMap();
            CreateMap<ImporterHR_ExpenseRequest, HRExpense>();
            CreateMap<ImporterConnectsHistroyRequest, ConnectsHistroy>();
            CreateMap<ConnectResponseData, Connect>();
            CreateMap<ImporterConnectRequest, Client>().ReverseMap();
            CreateMap<AssetCategoriesRequest, AssetCategories>().ReverseMap();
            CreateMap<AssetCategoryResponseData, AssetCategories>().ReverseMap();
            CreateMap<HandoverAssetsRequest, HandoverAsset>().ReverseMap();
            CreateMap<HandoverAssetResponseData, HandoverAsset>().ReverseMap();
            CreateMap<AssetsRequest, Assets>().ReverseMap();
            CreateMap<AssetCategoryResponseData, Assets>().ReverseMap();
            CreateMap<HandoverAssetsRequest, HandoverAsset>().ReverseMap();
            CreateMap<HandoverAsset, HandoverAssetResponseData>().ReverseMap();
            CreateMap<AssetsInventory, HandoverAssetResponseData>().ReverseMap();
            CreateMap<AssetsInventory, AssetsResponseData>().ReverseMap();
            CreateMap<Assets, AssetsResponseData>().ReverseMap();
            CreateMap<UpdateHandoverAssetRequest, HandoverAsset>().ReverseMap();
            CreateMap<EmployeeProject, CurrentProjectMembersResponse>().ReverseMap();
            CreateMap<HiringList, ImporterHiringList>().ReverseMap();
            CreateMap<BidRequest, JobRecords>().ReverseMap()
                 .ForMember(dest => dest.AccountTypes, opt => opt.MapFrom(src => src.AccountTypes))
                 .ForMember(dest => dest.DepartmentId, opt => opt.MapFrom(src => src.DepartmentId))
                 .ForMember(dest => dest.ContracType, opt => opt.MapFrom(src => src.ContracType))
                 .ForMember(dest => dest.Connects, opt => opt.MapFrom(src => src.Connects))
                 .ForMember(dest => dest.WeeklyHours, opt => opt.MapFrom(src => src.WeeklyHours))
                 .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
                 .ForMember(dest => dest.BillingType, opt => opt.MapFrom(src => src.BillingType))
                 .ForMember(dest => dest.BillingStatus, opt => opt.MapFrom(src => src.BillingStatus))
                 .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                 .ForMember(dest => dest.UpworkId, opt => opt.MapFrom(src => src.UpworkId));
            CreateMap<BidResponse, BidRequest>().ReverseMap();
            CreateMap<BidResponse, JobRecords>().ReverseMap();
            CreateMap<BidRequest, Client>()
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.ClientName))
                .ForMember(dest => dest.ContactNo, opt => opt.MapFrom(src => src.Mobile))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.CountryName))
                .ForMember(dest => dest.BidId, opt => opt.MapFrom(src => src.BidId != null ? src.BidId : Guid.Empty))
                .ForMember(dest => dest.Accounts, opt => opt.MapFrom(src => src.AccountTypes.ToString() ?? string.Empty))
                .ForMember(dest => dest.ClientEmail, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? false))
                .ForMember(dest => dest.MarketPlaceAccountId, opt => opt.MapFrom(src => src.UpworkId));
            CreateMap<BidRequest, Project>()
                .ForMember(dest => dest.Accounts, opt => opt.MapFrom(src => src.AccountTypes))
                .ForMember(dest => dest.ContractName, opt => opt.MapFrom(src => src.ProjectName))
                .ForMember(dest => dest.ContractType, opt => opt.MapFrom(src => src.ContracType))
                .ForMember(dest => dest.HoursPerWeek, opt => opt.MapFrom(src => src.WeeklyHours))
                .ForMember(dest => dest.ProjectUrl, opt => opt.MapFrom(src => src.ProjectUrl))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
                .ForMember(dest => dest.BillingType, opt => opt.MapFrom(src => src.BillingType))
                .ForMember(dest => dest.BillingStatus, opt => opt.MapFrom(src => src.BillingStatus))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.UpworkId, opt => opt.MapFrom(src => src.UpworkId))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.CountryName));
            CreateMap<BidRequest, ProjectHealth>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.StartDate ?? DateTime.MinValue))
                .ForMember(dest => dest.ProjectHealthRate, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ?? true));
            CreateMap<Project, ProjectResponseData>()
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client.ClientName))
                .ForMember(dest => dest.ContractName, opt => opt.MapFrom(src => src.ContractName))
                .ForMember(dest => dest.UpworkId, opt => opt.MapFrom(src => src.UpworkId))
                .ForMember(dest => dest.ProjectUrl, opt => opt.MapFrom(src => src.ProjectUrl))
                .ForMember(dest => dest.ClientId, opt => opt.MapFrom(src => src.ClientId))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country))
                .ForMember(dest => dest.ContractType, opt => opt.MapFrom(src => src.ContractType))
                .ForMember(dest => dest.HoursPerWeek, opt => opt.MapFrom(src => src.HoursPerWeek))
                .ForMember(dest => dest.UpworkName, opt => opt.MapFrom(src => src.Upworks.Name))
                .ForMember(dest => dest.CommunicationMode, opt => opt.MapFrom(src => src.CommunicationMode))
                .ForMember(dest => dest.BillingStatus, opt => opt.MapFrom(src => src.BillingStatus))
                .ForMember(dest => dest.EmployeeId,
                    opt => opt.MapFrom(src => src.EmployeeProjects.Select(x => x.EmployeeId).FirstOrDefault()))
                .ForMember(dest => dest.DepartmentId,
                    opt => opt.MapFrom(src => src.ProjectDepartments.Select(x => x.DepartmentId).ToList()))
                .ForMember(dest => dest.ProjectHealthRate, opt => opt.MapFrom(src => src.ProjectHealth.ProjectHealthRate.ToString() ?? string.Empty))
                .ForMember(dest => dest.Issue, opt => opt.MapFrom(src => src.ProjectHealth.Issue ?? string.Empty))
                .ForMember(dest => dest.Solution, opt => opt.MapFrom(src => src.ProjectHealth.Solution ?? string.Empty))
                .ForMember(dest => dest.Remarks, opt => opt.MapFrom(src => src.ProjectHealth.Remarks ?? string.Empty));
            CreateMap<BidRequest, ProjectDepartment>()
                .ForMember(dest => dest.DepartmentId, opt => opt.MapFrom(src => src.DepartmentId));
            CreateMap<Employee, ImporterConnectRequest>()
               .ForMember(
                dest => dest.EmployeeName,
                opt => opt.MapFrom(src => src.FirstName + " " + src.LastName)
                );
            CreateMap<ProjectDepartment, ProjectDepartmentResponseData>()
               .ForMember(
                dest => dest.DepartmentId,
                opt => opt.MapFrom(src => src.Department.DepartmentId)
                );
            CreateMap<Client, ClientResponseData>()
                .ForMember(
                dest => dest.MarketplaceName,
                opt => opt.MapFrom(src => src.MarketPlaceAccounts.Name)
                );
            CreateMap<ProjectBilling, ProjectBillingResponseData>()
                .ForMember(
                dest => dest.ProjectName,
                opt => opt.MapFrom(src => src.Projects.ContractName)
                )
                .ForMember(
                dest => dest.HoursBilled,
                opt => opt.MapFrom(src => src.HoursBilled)
                )
                .ForMember(
                dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Department.DepartmentName)
                )
                .ForMember(
                dest => dest.MarketPlaceName,
                opt => opt.MapFrom(src => src.MarketPlaceAccount.Name)
                );
            CreateMap<EmployeeSalary, EmployeeSalaryResponse>()
                .ForMember(
                dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Employee.Department.DepartmentName)
                )
                .ForMember(
                dest => dest.EmployeeNumber,
                opt => opt.MapFrom(src => src.Employee.EmployeeNumber)
                )
                .ForMember(
                dest => dest.FirstName,
                opt => opt.MapFrom(src => src.Employee.FirstName)
                )
                .ForMember(
                dest => dest.LastName,
                opt => opt.MapFrom(src => src.Employee.LastName)
                );
            CreateMap<Leave, LeaveResponseData>()
                .ForMember(
                dest => dest.FirstName,
                opt => opt.MapFrom(src => src.Employee.FirstName)
                )
                .ForMember(
                dest => dest.LastName,
                opt => opt.MapFrom(src => src.Employee.LastName)
                )
                .ForMember(
                dest => dest.DepartmentId,
                opt => opt.MapFrom(src => src.Employee.Department.DepartmentId)
                )
                .ForMember(
                dest => dest.EmployeeNumber,
                opt => opt.MapFrom(src => src.Employee.EmployeeNumber)
                )
                .ForMember(
                dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Employee.Department.DepartmentName)
                );
            CreateMap<Connect, ConnectResponseData>()
                .ForMember(
                dest => dest.FirstName,
                opt => opt.MapFrom(src => src.Employees.FirstName)
                )
                .ForMember(
                dest => dest.LastName,
                opt => opt.MapFrom(src => src.Employees.LastName)
                )
                .ForMember(
                dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Employees.Department.DepartmentName)
                )
             .ForMember(
                dest => dest.MarketPlaceAccountName,
                opt => opt.MapFrom(src => src.MarketPlaceAccount.Name)
                );
            CreateMap<EmployeeSalary, EmployeeSalaryResponse>()
                .ForMember(
                dest => dest.DepartmentId,
                opt => opt.MapFrom(src => src.Employee.DepartmentId)
                )
                .ForMember(
                dest => dest.EmployeeNumber,
                opt => opt.MapFrom(src => src.Employee.EmployeeNumber)
                )
                .ForMember(
                dest => dest.FirstName,
                opt => opt.MapFrom(src => src.Employee.FirstName)
                )
                .ForMember(
                dest => dest.LastName,
                opt => opt.MapFrom(src => src.Employee.LastName)
                );
            CreateMap<ProjectDepartment, ProjectDepartmentRespose>()
               .ForMember(
               dest => dest.DepartmentName,
               opt => opt.MapFrom(src => src.Department.DepartmentName)
               )
               .ForMember(
               dest => dest.ProjectName,
               opt => opt.MapFrom(src => src.Project.ContractName)
               ).ReverseMap();
            CreateMap<EmployeeProject, EmployeeProjectResponse>()
               .ForMember(
               dest => dest.EmployeeName,
               opt => opt.MapFrom(src => src.Employee.FirstName + " " + src.Employee.LastName)
               )
               .ForMember(
               dest => dest.ProjectName,
               opt => opt.MapFrom(src => src.Projects.ContractName)
               ).ReverseMap();
            CreateMap<ProjectReportResponse, ProjectResponseData>();
            CreateMap<Assets, AssetsResponseData>()
               .ForMember(
                   dest => dest.Quantity,
                   opt => opt.MapFrom(src => src.AssetInventory.FirstOrDefault().Quantity))
                .ForMember(
                   dest => dest.CategoryId,
                   opt => opt.MapFrom(src => src.CategoryId)
                   ).
                  ForMember(
                   dest => dest.CategoryName,
                   opt => opt.MapFrom(src => src.AssetCategories.CategoryName)
                   )
               .ReverseMap();
            CreateMap<HandoverAsset, HandoverAssetResponseData>()
                .ForMember(
                dest => dest.InStockAsset,
                opt => opt.MapFrom(src => src.AssetInventory.FirstOrDefault().InStock))
                .ForMember(
                dest => dest.Quantity,
                opt => opt.MapFrom(src => src.AssetInventory.FirstOrDefault().Quantity))
                 .ForMember(
                dest => dest.EmployeeId,
                opt => opt.MapFrom(src => src.EmployeeId)
                ).ForMember(
                dest => dest.AssignedTo,
                opt => opt.MapFrom(src => src.Employee.FirstName + " " + src.Employee.LastName)
                )
                .ForMember(
                dest => dest.AssetId,
                opt => opt.MapFrom(src => src.AssetId)
                ).ForMember(
                dest => dest.AssetName,
                opt => opt.MapFrom(src => src.Assets.AssetName)
                )
                .ReverseMap();
            CreateMap<AssetsInventory, AssetsRequest>()
               .ForMember(
               dest => dest.Quantity,
               opt => opt.MapFrom(src => src.Quantity))
               .ReverseMap();
            CreateMap<Project, ProjectsHistory>().ReverseMap();
            CreateMap<Connects, ConnectsResponseData>().ReverseMap();
            CreateMap<Connects, ConnectsRequest>().ReverseMap();
            CreateMap<Connects, ConnectsImportHistoryRequest>().ReverseMap();
            CreateMap<EditProjectRequest, ProjectHealth>()
                .ForMember(dest => dest.ProjectHealthRate, opt => opt.MapFrom(src => src.ProjectHealthRate))
                .ForMember(dest => dest.Issue, opt => opt.MapFrom(src => src.Issue))
                .ForMember(dest => dest.Solution, opt => opt.MapFrom(src => src.Solution))
                .ForMember(dest => dest.Remarks, opt => opt.MapFrom(src => src.Remarks));
        }
    }
}
