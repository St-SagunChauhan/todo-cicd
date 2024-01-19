using ST.ERP.Models.DAO;

namespace ST.ERP.Helper.Context
{
    public class SeedUser
    {
        public SeedUser()
        {
        }

        public static void Seeds(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<STERPContext>();
                if (!context.Departments.Any())
                {
                    context.Departments.AddRange(
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Business Development",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Dot Net Framework Technology Department",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Management",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "PHP Technology Department",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Javascript Framework Technology Department",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Quality Analysis Department",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Creative and Digital Marketing Department",
                            IsActive = true,
                        },
                        new Department
                        {
                            DepartmentId = Guid.NewGuid(),
                            DepartmentName = "Python technology",
                            IsActive = true,
                        });
                }
                if (!context.AccountTypes.Any())
                {
                    context.AccountTypes.AddRange(
                        new AccountTypes
                        {
                            AccountTypesName = "Agency",
                        },
                        new AccountTypes
                        {
                            AccountTypesName = "Freelancer",
                        },
                        new AccountTypes
                        {
                            AccountTypesName = "OutOfUpwork",
                        },
                        new AccountTypes
                        {
                            AccountTypesName = "AgencyAndFreelancer",
                        });
                }
                if (!context.BillingTypes.Any())
                {
                    context.BillingTypes.AddRange(
                        new BillingTypes
                        {
                            BillingTypesName = "UpworkBillingOnSystem",
                        },
                        new BillingTypes
                        {
                            BillingTypesName = "UpworkManualHours",
                        },
                        new BillingTypes
                        {
                            BillingTypesName = "OutOfUpwork",
                        },
                        new BillingTypes
                        {
                            BillingTypesName = "Milestone",
                        },
                        new BillingTypes
                        {
                            BillingTypesName = "Clockify",
                        });
                }
                if (!context.ConnectStatus.Any())
                {
                    context.ConnectStatus.AddRange(
                        new ConnectStatus
                        {
                            ConnectStatusName = "Applied",
                        },
                        new ConnectStatus
                        {
                            ConnectStatusName = "Lead",
                        },
                        new ConnectStatus
                        {
                            ConnectStatusName = "Hired",
                        });
                }
                if (!context.ContractStatus.Any())
                {
                    context.ContractStatus.AddRange(
                        new ContractStatus
                        {
                            ContractStatusName = "FullTime",
                        },
                        new ContractStatus
                        {
                            ContractStatusName = "PartTime",
                        },
                        new ContractStatus
                        {
                            ContractStatusName = "ActiveButNoWork",
                        },
                        new ContractStatus
                        {
                            ContractStatusName = "Completed",
                        },
                        new ContractStatus
                        {
                            ContractStatusName = "Closed",
                        });
                }
                if (!context.ContractType.Any())
                {
                    context.ContractType.AddRange(
                        new ContractType
                        {
                            ContractTypesName = "Hourly",
                        },
                        new ContractType
                        {
                            ContractTypesName = "Fixed",
                        });
                }
                if (!context.Gender.Any())
                {
                    context.Gender.AddRange(
                        new Gender
                        {
                            GenderType = "Male",
                        },
                        new Gender
                        {
                            GenderType = "Female",
                        });
                }
                if (!context.LeaveTypes.Any())
                {
                    context.LeaveTypes.AddRange(
                        new LeaveType
                        {
                            LeaveTypeName = "SickLeave",
                        },
                        new LeaveType
                        {
                            LeaveTypeName = "CasualLeave",
                        },
                        new LeaveType
                        {
                            LeaveTypeName = "HalfDay",
                        },
                        new LeaveType
                        {
                            LeaveTypeName = "ShortLeave",
                        });
                }
                if (!context.ProjectHealthRate.Any())
                {
                    context.ProjectHealthRate.AddRange(
                        new ProjectHealthRate
                        {
                            ProjectHealthRateName = "Green",
                        },
                        new ProjectHealthRate
                        {
                            ProjectHealthRateName = "Yellow",
                        },
                        new ProjectHealthRate
                        {
                            ProjectHealthRateName = "Red",
                        });
                }
                if (!context.ProjectStatus.Any())
                {
                    context.ProjectStatus.AddRange(
                        new ProjectStatus
                        {
                            ProjectStatusName = "Completed",
                        },
                        new ProjectStatus
                        {
                            ProjectStatusName = "Active",
                        },
                        new ProjectStatus
                        {
                            ProjectStatusName = "OnHold",
                        },
                        new ProjectStatus
                        {
                            ProjectStatusName = "ActiveButNoWork",
                        });
                }
                if (!context.Roles.Any())
                {
                    context.Roles.AddRange(
                        new Roles
                        {
                            RoleName = "Admin",
                        },
                        new Roles
                        {
                            RoleName = "TeamLead",
                        },
                        new Roles
                        {
                            RoleName = "HR",
                        },
                        new Roles
                        {
                            RoleName = "Employee",
                        },
                        new Roles
                        {
                            RoleName = "BD",
                        },
                        new Roles
                        {
                            RoleName = "BDM",
                        });
                }

                context.SaveChanges();

                //if (!context.Employees.Any())
                //{
                //    var dep = context.Department.FirstOrDefault();
                //    context.Employees.AddRange(new Employee()
                //    {
                //        EmployeeId = new Guid(),
                //        FirstName = "Vinayak",
                //        LastName = "Thakur",
                //        Address = "Sec. 115, Mohali",
                //        Gender = "Male",
                //        Email = "admin@supremetechnologiesindia.com",
                //        MobileNo = "9988983376",
                //        Role = "Admin",
                //        ProfilePicture = "string",
                //        DOB = DateTime.Now,
                //        EmergencyNumber = "9988983376",
                //        ShiftType = Enums.ShiftType.FullTime,
                //        EmployeeNumber = "ST050",
                //        JoiningDate = DateTime.Now,
                //        ResignationDate = DateTime.Now,
                //        SickLeaves = 0,
                //        CasualLeaves = 0,
                //        IsActive = true,
                //        DepartmentId = dep.DepartmentId,
                //    });
                //    context.SaveChanges();
                //}
            }
        }
    }
}