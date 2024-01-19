using Microsoft.Identity.Client;
using System.Security;

namespace ST.ERP.Helper;

public class AuthenticationUtility
{
    /// <summary>
    /// Acquire Token From Cache Or Username Password
    /// </summary>
    /// <param name="password"></param>
    /// <param name="email"></param>
    /// <returns></returns>
    public static async Task<AuthenticationResult> AcquireATokenFromCacheOrUsernamePasswordAsync(string password, string email, IConfiguration _configuration)
    {
        AuthenticationResult? result = null;
        SecureString securePassword = new();
        foreach (char c in password)
        {
            securePassword.AppendChar(c);
        }

        var clientApp = ClientApp(_configuration);
        var accounts = await clientApp.GetAccountsAsync();
        var scopes = _configuration["Config:Scopes"]?.Split(";");
        if (accounts.Any())
        {
            try
            {
                // Attempt to get a token from the cache (or refresh it silently if needed)
                result = await (clientApp as PublicClientApplication).AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                    .ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                // No token for the account. Will proceed below
            }
        }

        // Cache empty or no token for account in the cache, attempt by username/password
        result ??= await GetTokenForWebApiUsingUsernamePasswordAsync(scopes, email, securePassword, _configuration);
        return result;
    }

    /// <summary>
    /// Gets an access token so that the application accesses the web api in the name of the user
    /// who is signed-in Windows (for a domain joined or AAD joined machine)
    /// </summary>
    /// <returns>An authentication result, or null if the user canceled sign-in</returns>
    private static async Task<AuthenticationResult> GetTokenForWebApiUsingUsernamePasswordAsync(IEnumerable<string> scopes, string username, SecureString password, IConfiguration _configuration)
    {
        AuthenticationResult result = null;
        try
        {
            var clientApp = ClientApp(_configuration);
            result = await clientApp.AcquireTokenByUsernamePassword(scopes, username, password).ExecuteAsync();
        }
        catch (MsalUiRequiredException ex) { return result; }
        catch (Exception ex) { return result; }
        return result;
    }

    /// <summary>
    /// Client App
    /// </summary>
    /// <returns></returns>
    private static IPublicClientApplication ClientApp(IConfiguration _configuration)
    {
        var app = PublicClientApplicationBuilder.Create(_configuration["Config:ClientId"])
            .WithAuthority(AadAuthorityAudience.AzureAdMyOrg)
            .WithTenantId(_configuration["Config:TenantId"]).Build();
        return app;
    }
}
