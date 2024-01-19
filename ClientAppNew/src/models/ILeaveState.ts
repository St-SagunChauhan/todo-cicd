export enum ILeaveActionTypes {
  LEAVE_REQUEST = 'LEAVE/LEAVE_REQUEST',
  LEAVE_SUCCESS = 'LEAVE/LEAVE_SUCESS',
  LEAVE_FAILURE = 'LEAVE/LEAVE_FAILURE',
}

export type ILeaveState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type ILeaveActionCreator = {
  type: string;
  payload: ILeaveState;
};
