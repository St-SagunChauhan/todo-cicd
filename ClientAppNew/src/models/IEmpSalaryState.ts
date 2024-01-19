export enum IEmpSalaryActionType {
  EMP_Salary_REQUEST = 'Emp_Salary_REQUEST',
  EMP_Salary_SUCCESS = 'Emp_Salary_SUCCESS',
  EMP_Salary_FAILURE = 'Emp_Salary_FAILURE',
}

export type IEmpSalaryState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IEmpSalaryActionCreator = {
  type: string;
  payload: IEmpSalaryState;
  loading: boolean;
};
