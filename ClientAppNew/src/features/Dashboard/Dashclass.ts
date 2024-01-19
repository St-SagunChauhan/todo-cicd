export type IDashboardRequest = {
  departmentName: string;
  totalWeeklyHours: number;
  totalBilledHours: number;
  totalUnbilledHours: number;
  totalTargetHours: number;
  overAllCapacity: number;
  dashBoardEmployees: IDashBoardEmployees[];
};
export type IDashBoardEmployees = {
  employeeName: string;
  employeeDesignation: string;
  employeeTargetedHours: number;
  employeeBilledHours: number;
  employeeBillableHours: number;
  employeeUnBilledHours: number;
};

export type IDashboardResponse = {
  message: string;
  status: number;
  data: any;
};
export const Role = ['Admin', 'HR', 'Employee', 'TeamLead'];
export const Gender = ['Male', 'Female'];
