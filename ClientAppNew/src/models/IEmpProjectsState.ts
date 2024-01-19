export enum IEmpProjectActionType {
  EmpProject_REQUEST = 'EmpProject_REQUEST',
  EmpProject_SUCCESS = 'EmpProject_SUCCESS',
  EmpProject_FAILURE = 'EmpProject_FAILURE',
}

export type IEmpProjectState = {
  data: any | null;
  msg?: string | null;
};

export type IEmpProjectActionCreator = {
  type: string;
  payload: IEmpProjectState;
};
