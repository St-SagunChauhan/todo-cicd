export enum IProjectActionTypes {
  PROJECT_REQUEST = 'PROJECT/PROJECT_REQUEST',
  PROJECT_SUCCESS = 'PROJECT/PROJECT_SUCESS',
  PROJECT_FAILURE = 'PROJECT/PROJECT_FAILURE',
}

export type IProjectState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type IProjectActionCreator = {
  type: string;
  payload: IProjectState;
};
