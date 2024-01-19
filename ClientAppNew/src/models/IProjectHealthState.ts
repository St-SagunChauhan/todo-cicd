export enum IProjectHealthActionTypes {
  PROJECTHEALTH_REQUEST = 'PROJECTHEALTH/PROJECTHEALTH_REQUEST',
  PROJECTHEALTH_SUCCESS = 'PROJECTHEALTH/PROJECTHEALTH_SUCESS',
  PROJECTHEALTH_FAILURE = 'PROJECTHEALTH/PROJECTHEALTH_FAILURE',
}

export type IProjectHealthState = {
  data: any | null;
  msg?: string | null;
  loading?: boolean;
};

export type IProjectHealthActionCreator = {
  type: string;
  payload: IProjectHealthState;
  loading: boolean;
};
