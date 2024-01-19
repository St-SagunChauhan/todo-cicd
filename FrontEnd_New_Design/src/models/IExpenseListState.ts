export enum IHRExpenseActionTypes {
  HRExpense_REQUEST = "HRExpense_REQUEST",
  HRExpense_SUCCESS = "HRExpense_SUCESS",
  HRExpense_FAILURE = "HRExpense_FAILURE",
}

export type IHRExpenseState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IHRExpenseActionCreator = {
  type: string;
  payload: IHRExpenseState;
  loading: boolean;
};
