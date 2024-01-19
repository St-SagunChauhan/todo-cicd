export enum IDeptActionTypes {
  DEPARTMENT_REQUEST = 'DEPT/DEPARTMENT_REQUEST',
  DEPARTMENT_SUCCESS = 'DEPT/DEPARTMENT_SUCESS',
  DEPARTMENT_FAILURE = 'DEPT/DEPARTMENT_FAILURE',
}

export type IDeptState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IDeptActionCreator = {
  type: string;
  payload: IDeptState;
  loading: boolean;
};
