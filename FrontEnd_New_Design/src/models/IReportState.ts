export enum IReportActionType {
    REPORT_REQUEST = 'Report_REQUEST',
    REPORT_SUCCESS = 'Report_SUCCESS',
    REPORT_FAILURE = 'Report_FAILURE',
  }
  
  export type IReportState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
  };
  
  export type IReportActionCreator = {
    type: string;
    payload: IReportState;
    loading: boolean;
  };
  