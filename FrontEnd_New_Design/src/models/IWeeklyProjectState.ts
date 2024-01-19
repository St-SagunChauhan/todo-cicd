export enum IWeeklyProjectActionType {
    WEEKLY_PROJECT_REQUEST = 'WEEKLY_PROJECT_REQUEST',
    WEEKLY_PROJECT_REQUEST_SUCCESS = 'WEEKLY_PROJECT_REQUEST_SUCCESS',
    WEEKLY_PROJECT_REQUEST_FAILURE = 'WEEKLY_PROJECT_REQUEST_FAILURE',
  }
  
  export type IWeeklyProjectState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
  };
  
  export type IWeeklyProjectActionCreator = {
    type: string;
    payload: IWeeklyProjectState;
    loading: boolean;
  };