export type IEmployee = {
  // password?: string;
  firstName: string;
  lastName: string;
  address: string;
  gender?: string;
  email: string;
  mobileNo: string;
  role?: string;
  joiningDate?: string;
  resignationDate?: string | null;
  departmentId: string;
  assignedTo?: string | null;
  isActive: boolean;
  employeeNumber: string;
  employeeId: string | null;
  department?: string;
  employeeTargetedHours: number | null;
  profilePicture?: string;
  casualLeaves?: string;
  sickLeaves?: string;
  isInImpersonation?: string;
};
export type IEmpResponse = {
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
