export enum IEmpActionType {
  EMP_REQUEST = 'Emp_REQUEST',
  EMP_SUCCESS = 'Emp_SUCCESS',
  EMP_FAILURE = 'Emp_FAILURE',
}

export type IEmpState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IEmpActionCreator = {
  type: string;
  payload: IEmpState;
  loading: boolean;
};
