export type IEmployee = {
  salaryId?: string;
  employeeId: string;
  basicSalary: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  bonus: number;
  da: number;
  hra: number;
  learningAllowance: number;
  uniformAllowance: number;
  conveyanceAllowance: number;
  projectLevelBonus: number;
  grossSalary: string;
  epfApplicable: string;
  esiApplicable: string;
  uanNo: string;
  esiNo: string;
  isActive: boolean;
};
export type IEmpResponse = {
  // message: string;
  status: number;
  data: any;
};
