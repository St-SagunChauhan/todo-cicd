import axios from "axios";
import { parseJwt } from "../Helper";

const baseURL = process.env.REACT_APP_ENDPOINT_URL;

class AuthService {
  handelAuthentication = () => {
    const accessToken = this.getAccessToken();
    if (!accessToken || !this.isValidToken(accessToken)) return;
    this.setSession("accessToken", accessToken);
  };
  loginWithAuth0 = async (username: string, password: string) => {
    const body = {
      email: username,
      password: password,
    };

    const response = await axios
      .post(`${baseURL}/employee/authenticate`, body)
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
    if (response.data.success) {
      this.setSession("accessToken", response.data.api_token);
      this.setSession("user", JSON.stringify(response.data.user));
      this.setSession("role", response.data.user.role);
    }
    return response;
  };
  setSession = (key: string, accessToken: string) => {
    localStorage.setItem(key, accessToken);
  };
  logOut = () => {
    localStorage.clear();
  };
  getUser = () => {
    const user = localStorage.getItem("user") || "";
    return user;
  };

  getRole = () => {
    const user = localStorage.getItem("role") || "";
    return user;
  };

  getAccessToken = () => localStorage.getItem("accessToken");

  isAuthenticated = () => !!this.getAccessToken();

  isValidToken = (accessToken: string | null) => {
    const parseToken = parseJwt(accessToken);
    const currentTime = Date.now() / 1000;
    if (parseToken.exp < currentTime || !accessToken) {
      return false;
    } else {
      return true;
    }
  };
  clearSession = () => {
    // Implement the logic to clear any stored session data related to impersonation
    // For example, if you set a custom 'impersonating' flag in localStorage, you can remove it here:
    localStorage.removeItem("impersonating");
    // Similarly, remove other session data that needs to be cleared during impersonation
  };
}

const authService = new AuthService();

export default authService;
