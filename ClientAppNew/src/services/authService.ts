import axios from 'axios';
import Swal from 'sweetalert2';
import { IPassword } from 'features/MarketPlaceAccount/MarketPlaceAccountModal';

const baseURL = process.env.REACT_APP_ENDPOINT_URL;
class AuthService {
  handleAuthentication = () => {
    const accessToken = this.getAccessToken();
    if (!accessToken || !this.isValidToken(accessToken)) return;
    this.setSession('accessToken', accessToken);
  };

  loginWithAuth0 = async (username: string, password: string) => {
    const body = {
      email: username,
      password: password,
    };
    const response = await axios({
      method: 'post',
      url: `${baseURL}/employee/authenticate`,
      data: body,
    })
      .then((response) => response)
      .catch((error) => {
        Swal.fire('Error', error.response.data.message, 'error');
        return error.response;
      });
    if (response.data.success) {
      this.setSession('accessToken', response.data.api_token);
      this.setSession('user', JSON.stringify(response.data.user));
      this.setSession('role', response.data.user.role);
    }
    return response;
  };

  loginWithToken = async () => {
    return {
      user: 'tonynguyen',
    };
  };

  setSession = (key: string, accessToken: string) => {
    localStorage.setItem(key, accessToken);
  };

  logOut = () => {
    localStorage.clear();
  };

  getUser = () => {
    const user = localStorage.getItem('user') || '';
    return user;
  };

  getRole = () => {
    const user = localStorage.getItem('role') || '';
    return user;
  };

  getAccessToken = () => localStorage.getItem('accessToken');

  isAuthenticated = () => !!this.getAccessToken();

  isValidToken = (accessToken: string | null) => {
    const expireTime = 1606275140.897;
    if (!accessToken) return false;

    const currentTime = Date.now() / 1000;

    return expireTime < currentTime;
  };

  changePassword = async (values: IPassword) => {
    const response = await axios
      .post(
        `${baseURL}/Employee/changePassword`,
        { id: values.id, password: values.password, newPassword: values.newPassword },
        {
          headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
        },
      )
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });

    return response;
  };

  clearSession = () => {
    // Implement the logic to clear any stored session data related to impersonation
    // For example, if you set a custom 'impersonating' flag in localStorage, you can remove it here:
    localStorage.removeItem('impersonating');
    // Similarly, remove other session data that needs to be cleared during impersonation
  };
}

const authService = new AuthService();

export default authService;
