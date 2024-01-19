export type IMasterReport = {
  departmentName: string;
  overallDepartmentBilling: number;
  overallcapacity: number;
  overallTragetedBilling: number;
  currentDate: string;
  startDate: string;
};
export type IMasterResponse = {
  message: string;
  status: number;
  data: any;
};
export const Role = ['Admin', 'HR', 'Employee', 'TeamLead', 'BD'];
export const Gender = ['Male', 'Female'];
