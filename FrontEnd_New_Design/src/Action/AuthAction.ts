import { Dispatch } from "redux";

// types
import { IAuthActionTypes } from "../models/IAuthState";
import { IUserActionType, IUserState } from "../models/IUser";

// services
import authService from "../services/authServices";

// configs
import { PATH_NAME } from "../Config/pathName";

// export const login = (values: any) => async (dispatch: Dispatch<any>) => {
//   const navigate = useNavigate();
//   dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });

//   const response: any = await authService.loginWithAuth0(
//     values.username,
//     values.password
//   );
//   if (response.data.success) {
//     dispatch({ type: IAuthActionTypes.LOGIN_SUCCESS });
//     if (authService.getRole() === "TeamLead") {
//       navigate(PATH_NAME.ROOT);
//     } else if (authService.getRole() === "Admin") {
//       navigate(PATH_NAME.DASHBOARD);
//       // history.push(PATH_NAME.MASTER_REPORT);
//     } else if (authService.getRole() === "HR") {
//       // history.push(PATH_NAME.EMPLOYEE);
//     } else {
//       // history.push(PATH_NAME.PROFILE);
//     }
//     window.location.reload();
//   } else {
//     navigate(PATH_NAME.LOGIN);
//     return response.data.message;
//     //   Swal.fire("Error", response.data.message, "error");
//   }
//   // window.location.reload();
// };

export const LoginPro = (values: any) => async (dispatch: Dispatch) => {
  dispatch({ type: IAuthActionTypes.LOGIN_REQUEST });
  const response: any = await authService.loginWithAuth0(
    values.username,
    values.password
  );
  if (response.data.success) {
    dispatch({
      type: IAuthActionTypes.LOGIN_SUCCESS,
      payload: response.data.user,
    });
    if (authService.getRole() === "Admin") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    } else if (authService.getRole() === "TeamLead") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    } else if (authService.getRole() === "Employee") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    } else if (authService.getRole() === "HR") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    } else if (authService.getRole() === "BD") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    } else if (authService.getRole() === "BDM") {
      return {
        status: true,
        msg: "Success",
        pathName: `${PATH_NAME.ROOT}`,
      };
    }
  } else {
    dispatch({ type: IAuthActionTypes.LOGIN_FAILURE });
    return {
      status: false,
      msg: response.data.message,
    };
  }
};

export const logout = () => (dispatch: Dispatch) => {
  authService.logOut();
  dispatch({ type: IAuthActionTypes.LOGOUT, loading: false });
};

export const setUserData =
  (user: string, role: string) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: IAuthActionTypes.SILENT_LOGIN,
      payload: { user, role },
    });
  };

export const setUserProfile =
  (profilePicture: string) => (dispatch: Dispatch) => {
    dispatch({
      type: IUserActionType.UPDATE_USER,
      payload: { profilePicture: profilePicture },
    });
  };
