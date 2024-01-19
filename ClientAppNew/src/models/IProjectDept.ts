export enum IProjectDepartmentActionTypes {
  PROJECT_DEPARTMENT_REQUEST = 'PROJECT_DEPARTMENT/PROJECT_DEPARTMENT_REQUEST',
  PROJECT_DEPARTMENT_SUCESS = 'PROJECT_DEPARTMENT/PROJECT_DEPARTMENT_SUCESS',
  PROJECT_DEPARTMENT_FAILURE = 'PROJECT_DEPARTMENT/PROJECT_DEPARTMENT_FAILURE',
}

export type IProjectDepartmentState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type IProjectDepartmentActionCreator = {
  type: string;
  payload: IProjectDepartmentState;
};
