import { Dispatch } from 'redux';

// types
import { IAuthActionTypes } from 'models/IAuthState';
import { IHistory } from 'models/ICommon';

// services
import authService from 'services/authService';

// configs
import { PATH_NAME } from 'configs';
import Swal from 'sweetalert2';

export const login = (values: any, history: IHistory) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });

  const response: any = await authService.loginWithAuth0(values.username, values.password);
  if (response.data.success) {
    if (authService.getRole() === 'TeamLead') {
      history.push(PATH_NAME.ROOT);
    } else if (authService.getRole() === 'Admin') {
      history.push(PATH_NAME.MASTER_REPORT);
    } else if (authService.getRole() === 'HR') {
      history.push(PATH_NAME.EMPLOYEE);
    } else {
      history.push(PATH_NAME.PROFILE);
    }
    window.location.reload();
  } else {
    history.push(PATH_NAME.LOGIN);
    Swal.fire('Error', response.data.message, 'error');
  }
  // window.location.reload();
};

export const logout = () => (dispatch: Dispatch<any>) => {
  authService.logOut();
  dispatch({ type: IAuthActionTypes.LOGOUT });
};

export const setUserData = (user: string, role: string) => (dispatch: Dispatch<any>) => {
  dispatch({
    type: IAuthActionTypes.SILENT_LOGIN,
    payload: { user, role },
  });
};
