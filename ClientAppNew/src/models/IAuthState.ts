export enum IAuthActionTypes {
  LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'AUTH/LOGIN_SUCESS',
  LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE',
  SILENT_LOGIN = 'AUTH/SILENT_LOGIN',
  LOGIN_ERROR = 'AUTH/LOGIN_ERROR',
  LOGOUT = 'AUTH/LOGOUT',
  REGISTER = 'AUTH/REGISTER',
}

export type IAuthState = {
  user: any | null;
  loading?: boolean;
  role: string | null;
  msg?: string | null;
};

export type IAuthActionCreator = {
  type: string;
  payload: IAuthState;
};
