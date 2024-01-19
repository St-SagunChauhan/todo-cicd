using AutoMapper;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using ST.ERP.Helper.Hubs;
using ST.ERP.Helper.SubscribeTableDependencies;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    var configuration = new ConfigurationBuilder()
                   .AddJsonFile("appsettings.json")
                   .Build();
    var logger = new LoggerConfiguration()
        .ReadFrom.Configuration(configuration)
        .CreateLogger();
    logging.AddSerilog(logger, dispose: true);
});

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

#region Get Connection String
var isProduction = Convert.ToBoolean(builder.Configuration["Keys:IsProduction"]);
var connectionStringKey = isProduction ? "DbConnectionProd" : "DbConnectionStage";
var encryptedCS = builder.Configuration.GetConnectionString(connectionStringKey);
var password = builder.Configuration["Keys:EncryptionPassword"];
var salt = Encoding.ASCII.GetBytes(builder.Configuration["Keys:Salt"]);
var connectionString = DecryptCS.DecryptConnectionString(encryptedCS, password, salt);
#endregion

#if DEBUG
connectionString = builder.Configuration.GetConnectionString("DbConnectionDev");
#endif

builder.Services.Configure<ConfigSettings>(
    builder.Configuration.GetSection("Config"));
builder.Services.Configure<LeavesSettings>(
    builder.Configuration.GetSection("Leaves_URL"));
builder.Services.AddDbContext<STERPContext>(options => options.UseSqlServer
    (connectionString));

#region AutoMapper
var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new AutoMapperProfile());
});

var mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);
#endregion

builder.Services.AddSignalR(); 
builder.Services.AddTransient<IEmployeeService, EmployeeService>();
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<IClientService, ClientService>();
builder.Services.AddTransient<IDepartmentService, DepartmentService>();
builder.Services.AddTransient<IExpenseCategoryService, ExpenseCategoryService>();
builder.Services.AddTransient<IProjectService, ProjectService>();
builder.Services.AddTransient<IReportService, ReportService>();
builder.Services.AddTransient<IMarketPlaceAccountService, MarketPlaceAccountService>();
builder.Services.AddTransient<IProjectBillingService, ProjectBillingService>();
builder.Services.AddTransient<IConnectService, ConnectService>();
builder.Services.AddTransient<IEmployeeSalariesService, EmployeeSalariesService>();
builder.Services.AddTransient<ILeavesService, LeavesService>();
builder.Services.AddTransient<IDashboardService, DashboardService>();
builder.Services.AddTransient<IHRExpenseService, HRExpenseService>();
builder.Services.AddTransient<ITeamloggerService, TeamloggerService>();
builder.Services.AddTransient<IEodService, EodService>();
builder.Services.AddSingleton<LeavesHub>();
builder.Services.AddSingleton<SubscribeLeaveTableDependency>();
builder.Services.AddTransient<IAssetCategoryService, AssetCategoryService>();
builder.Services.AddTransient<IAssetService, AssetService>();
builder.Services.AddTransient<IHandoverAssetService, HandoverAssetService>();
builder.Services.AddTransient<IJobService, JobService>();
builder.Services.AddScoped<ClaimsUtility>();
builder.Services.AddMemoryCache();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// global cors policy
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// global error handler
app.UseMiddleware<ErrorHandlerMiddleware>();

// custom jwt auth middleware
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.UseEndpoints(config =>
{
    config.MapHub<LeavesHub>("/leavesHub");
});

//app.UseSqlTableDependency<SubscribeLeaveTableDependency>(connectionString);

/*SeedUser.Seeds(app);*/

app.Run();
