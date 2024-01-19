using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ST.ERP.Helper
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        private readonly IList<string> _roles;
        private IList<string> _myRoles;

        public AuthorizeAttribute(params string[] roles)
        {
            _roles = roles.ToList() ?? new List<string>();
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            _myRoles = _roles.SelectMany(r => r.Split(',')).Select(r => r.Trim()).ToList();

            var userId = context.HttpContext.User.Claims.Any(c => c.Type == "EmployeeId");
            var userRole = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "Role")?.Value;

            if (!userId || (_myRoles.Any() && !_myRoles.Contains(userRole)))
            {
                // not logged in
                context.Result = new JsonResult(new { success = false, message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
        }
    }
}
