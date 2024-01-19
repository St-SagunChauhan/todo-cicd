export enum ITeamLoggerActionTypes {
    TeamLogger_REQUEST = 'TeamLogger_REQUEST',
    TeamLogger_SUCCESS = 'TeamLogger_SUCESS',
    TeamLogger_FAILURE = 'TeamLogger_FAILURE',
  }
  
  export type ITeamLoggerState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
  };
  
  export type ITeamLoggerActionCreator = {
    type: string;
    payload: ITeamLoggerState;
    loading: boolean;
  };
  