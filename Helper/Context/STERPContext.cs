using Microsoft.EntityFrameworkCore;
using ST.ERP.Models.DAO;

namespace ST.ERP.Helper.Context
{
    public class STERPContext : DbContext
    {
        public STERPContext(DbContextOptions<STERPContext> options) : base(options)
        {

        }
        // Entities
        public DbSet<Client> Clients { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<MarketPlaceAccount> MarketPlaceAccounts { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Connect> Connects { get; set; }
        public DbSet<ProjectBilling> ProjectBillings { get; set; }
        public DbSet<ProjectDepartment> ProjectDepartments { get; set; }
        public DbSet<EmployeeProject> EmployeeProjects { get; set; }
        public DbSet<EmployeeSalary> EmployeeSalaries { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<LeaveHistory> LeaveHistory { get; set; }
        public DbSet<ProjectHealth> ProjectHealth { get; set; }
        public DbSet<EODReport> EODReport { get; set; }
        public DbSet<TeamLoggerReport> TeamLoggerReports { get; set; }
        public DbSet<ConnectsHistroy> ConnectsHistroy { get; set; }
        public DbSet<HRExpense> HRExpense { get; set; }
        public DbSet<ExpenseCategory> ExpenseCategory { get; set; }
        public DbSet<AssetCategories> AssetCategories { get; set; }
        public DbSet<Assets> Assets { get; set; }
        public DbSet<HandoverAsset> HandoverAsset { get; set; }
        public DbSet<AssetsInventory> AssetsInventory { get; set; }
        public DbSet<HiringList> HiringList { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<HandoverStatusTypes> HandoverStatusTypes { get; set; }
        public DbSet<AssetStatusTypes> AssetStatusTypes { get; set; }
        public DbSet<ConnectStatus> ConnectStatus { get; set; }
        public DbSet<ShiftTypes> ShiftTypes { get; set; }
        public DbSet<ProjectHealthRate> ProjectHealthRate { get; set; }
        public DbSet<ProjectStatus> ProjectStatus { get; set; }
        public DbSet<StatusType> StatusType { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<Gender> Gender { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<BillingTypes> BillingTypes { get; set; }
        public DbSet<AccountTypes> AccountTypes { get; set; }
        public DbSet<ContractType> ContractType { get; set; }
        public DbSet<ContractStatus> ContractStatus { get; set; }
        public DbSet<JobRecords> JobRecords { get; set; }
        public DbSet<MaketPlaceAccountStatus> MarketPlaceAccountsStatusType { get; set; }
        public DbSet<ProjectsHistory> ProjectsHistory { get; set; }
        public DbSet<Connects> Connect { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>(x =>
            {
                string tableName = "Employees";
                x.ToTable(tableName);
                x.ToTable(a => a.HasTrigger("trgEmployeesLeave"));
                x.HasKey(a => a.EmployeeId);
                // to be able to have multiple addresses
                x.HasOne(a => a.Department)
                    .WithMany(a => a.Employees).HasForeignKey(x => x.DepartmentId);
            });
            modelBuilder.Entity<EmployeeProject>(x =>
            {
                string tableName = "EmployeeProjects";
                x.ToTable(tableName);
                x.HasKey(a => a.EmpProjectId);
                //x.Property(x => x.ProjectId).HasColumnName("ProjectId");
            });

            modelBuilder.Entity<HRExpense>(x =>
            {
                string tableName = "HRExpense";
                x.ToTable(tableName);
                x.HasKey(a => a.ExpenseId);

            });
            modelBuilder.Entity<LeaveHistory>(x =>
            {
                string tableName = "LeaveHistory";
                x.ToTable(tableName);
                x.HasKey(a => a.LeaveHistoryId);

            });
            modelBuilder.Entity<Project>(x =>
            {
                string tableName = "Projects";
                x.ToTable(tableName);
                x.HasKey(a => a.Id);
                x.Property(x => x.Id).HasColumnName("Id");
                // to be able to have multiple addresses
                x.HasOne(a => a.Client)
                    .WithMany(a => a.Project).HasForeignKey(x => x.ClientId);
            });

            modelBuilder.Entity<ProjectDepartment>(x =>
            {
                string tableName = "ProjectDepartments";
                x.ToTable(tableName);
                x.HasKey(a => a.Id).HasName("Id");
                x.Property(x => x.ProjectId).HasColumnName("ProjectId");
                x.HasOne(a => a.Department)
                    .WithMany(a => a.ProjectDepartments)
                    .HasForeignKey(x => x.DepartmentId);
                x.HasOne(x => x.Project)
                    .WithMany(a => a.ProjectDepartments)
                    .HasForeignKey(x => x.ProjectId);
            });
            modelBuilder.Entity<ProjectBilling>(x =>
            {
                string tableName = "ProjectBillings";
                x.ToTable(tableName);
                x.HasKey(a => a.BillingId);
                // to be able to have multiple addresses
                x.HasOne(a => a.MarketPlaceAccount)
                    .WithMany(a => a.ProjectBillings).HasForeignKey(x => x.MarketPlaceAccountId);
            });
            modelBuilder.Entity<EmployeeSalary>(x =>
            {
                string tableName = "EmployeeSalaries";
                x.ToTable(tableName);
                x.HasKey(s => s.SalaryId);
            });
            modelBuilder.Entity<ProjectHealth>(x =>
            {
                string tableName = "ProjectHealth";
                x.ToTable(tableName);
                x.HasKey(h => h.Id);

                x.HasOne(a => a.Projects);
                //.WithOne(x => x.ProjectHealth).HasForeignKey(x => x.ProjectId);
            });
            modelBuilder.Entity<Leave>(x =>
            {
                string tableName = "Leaves";
                x.ToTable(tableName);
                x.HasKey(s => s.Id);
                x.ToTable(x => x.HasTrigger("MyLeaveTableTrigger"));
            });
            modelBuilder.Entity<Assets>(x =>
            {
                string tableName = "Assets";
                x.ToTable(tableName);
                x.HasKey(s => s.AssetId);
                x.HasOne(a => a.AssetCategories)
                .WithMany(x => x.Assets).HasForeignKey(x => x.CategoryId);
            });
            modelBuilder.Entity<HandoverAsset>(x =>
            {
                string tableName = "HandoverAsset";
                x.ToTable(tableName);
                x.HasKey(s => s.HandoverId);
                x.HasOne(a => a.Assets)
                .WithMany(x => x.HandoverAssets).HasForeignKey(x => x.AssetId);
                x.HasOne(e => e.Employee)
               .WithMany(x => x.HandoverAssets).HasForeignKey(x => x.EmployeeId);
            });
            modelBuilder.Entity<AssetsInventory>(x =>
            {
                string tableName = "AssetsInventory";
                x.ToTable(tableName);
                x.HasKey(s => s.InventoryId);
                x.HasOne(a => a.Assets)
                .WithMany(x => x.AssetInventory).HasForeignKey(x => x.AssetId);
                x.HasOne(h => h.HandoverAsset)
                .WithMany(x => x.AssetInventory).HasForeignKey(i => i.HandoverId);
            });

            modelBuilder.Entity<Client>()
            .HasOne(m => m.MarketPlaceAccounts)
            .WithMany(t => t.MarketPlaceClient)
            .HasForeignKey(m => m.MarketPlaceAccountId);

            modelBuilder.Entity<Project>()
          .HasOne(m => m.Upworks)
          .WithMany(t => t.UpworkProfile)
          .HasForeignKey(m => m.UpworkId);

            modelBuilder.Entity<Client>()
            .HasOne(p => p.JobRecords)
            .WithMany()
            .HasForeignKey(p => p.BidId);

        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            var AddedEntities = ChangeTracker.Entries().Where(E => E.State == EntityState.Added).ToList();
            var _httpContextAccessor = new HttpContextAccessor();

            AddedEntities.ForEach(E =>
            {
                E.Property("CreatedDate").CurrentValue = DateTime.Now;
                E.Property("CreatedBy").CurrentValue = new Guid(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value);
            });

            var EditedEntities = ChangeTracker.Entries().Where(M => M.State == EntityState.Modified).ToList();
            EditedEntities.ForEach(M =>
            {
                M.Property("LastModified").CurrentValue = DateTime.Now;
                M.Property("LastModifiedBy").CurrentValue = new Guid(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value);
            });

            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
    }
}
