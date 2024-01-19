export enum IProjectBillingActionTypes {
  PROJECT_BILLING_REQUEST = 'PROJECT_BILLING/PROJECT_BILLING_REQUEST',
  PROJECT_BILLING_SUCCESS = 'PROJECT_BILLING/PROJECT_BILLING_SUCCESS',
  PROJECT_BILLING_FAILURE = 'PROJECT_BILLING/PROJECT_BILLING_FAILURE',
}

export interface IProjectBilling {
  data?: any | null;
  msg?: string | null;
  loading?: boolean;
}
export type IProjectBillingActionCreator = {
  type: string;
  payload: IProjectBilling;
};

export type IProjectBillingAddEditModel = {
  billingId?: string | null;
  projectId: string | null;
  hoursBilled: number | null;
  minutesBilled: number | null;
  departmentId: string | null;
  marketPlaceAccountId: string | null;
  // week: string | null;
  startDate: string | null;
  endDate: string | null;
  billableHours: number | null;
  isActive: boolean;
};
