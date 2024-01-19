export enum IDepartmentActionTypes {
  Department_REQUEST = "Department_REQUEST",
  Department_SUCCESS = "Department_SUCCESS",
  Department_FAILURE = "Department_FAILURE",
}

export type IDepartmentState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IDepartmentActionCreator = {
  type: string;
  payload: IDepartmentState;
  loading: boolean;
};
