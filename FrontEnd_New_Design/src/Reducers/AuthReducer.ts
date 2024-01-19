import {
  IAuthActionTypes,
  IAuthActionCreator,
  IAuthState,
} from "../models/IAuthState";

const initialState: IAuthState = {
  user: null,
  loading: false,
  role: null,
  msg: null,
};

const reducer = (
  state = initialState,
  { type, payload }: IAuthActionCreator
) => {
  switch (type) {
    case IAuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        user: null,
        role: null,
      };
    case IAuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.user,
        role: payload.role,
      };
    case IAuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
      };
    case IAuthActionTypes.LOGIN_ERROR:
      return {
        ...state,
        msg: payload.msg,
      };
    case IAuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        role: null,
        loading: false,
      };
    case IAuthActionTypes.SILENT_LOGIN:
      return {
        ...state,
        user: payload.user,
        role: payload.role,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
