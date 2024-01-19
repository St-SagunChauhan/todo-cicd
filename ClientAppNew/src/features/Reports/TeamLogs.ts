export type ITeamLogs = {
  file: string;
  uploadDate: string;
  Name: string;
  Department: string;
  PunchIn: string;
  PunchOut: string;
  Timer: string;
  Manual: string;
  Inactive: string;
  Total: string;
  Remarks: string;
};
export type ITeamLogsResponse = {
  // message: string;
  status: number;
  data: any;
};
export const Role = ['Admin', 'HR', 'Employee', 'TeamLead'];
export const Gender = ['Male', 'Female'];

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}
// export const Gender = [GenderEnum.Male, GenderEnum.Female];
