export enum IEodReportActionTypes {
  EOD_REPORT_REQUEST = 'EOD_REPORT/EOD_REPORT_REQUEST',
  EOD_REPORT_SUCCESS = 'EOD_REPORT/EOD_REPORT_SUCCESS',
  EOD_REPORT_FAILURE = 'EOD_REPORT/EOD_REPORT_FAILURE',
}

export interface IEodReportState {
  data?: any | null;
  msg?: string | null;
  loading?: boolean;
}
export type IEodReportActionCreator = {
  type: string;
  payload: IEodReportState;
};
export type Friends = [projectId: string | null, billingHours: number];

export type IEodReportAddEditModel = {
  eodReportId?: string | null;
  departmentId: string | null;
  employeeId: string | null;
  projectId: string | null;
  billingHours: number | null;
  employeeDelightHours: number | null;
  unbilledHours: number | null;
  isActive: boolean;
  projectHours: [];
  // friends: Friends;
};
