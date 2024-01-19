namespace ST.ERP.Helper
{
    public class ClaimsUtility
    {
        #region Fields
        private readonly IHttpContextAccessor _httpContextAccessor;
        #endregion

        #region Constructor
        public ClaimsUtility(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Get current user department_id from claims
        /// </summary>
        /// <returns></returns>
        public Guid GetDepartmentIdFromClaims() => new(_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Department")?.Value);

        /// <summary>
        /// Get current user role from claims
        /// </summary>
        /// <returns></returns>
        public string GetUserRoleFromClaims() =>  _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "Role")?.Value;

        /// <summary>
        /// Get current user id from claims
        /// </summary>
        /// <returns></returns>
        public Guid GetEmployeeIdFromClaims() =>  new (_httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value);
        #endregion
    }
}
