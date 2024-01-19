export enum IExpenseCategoryActionTypes {
  EXPENSECATEGORY_REQUEST = 'EXPENSECATEGORY/EXPENSECATEGORY_REQUEST',
  EXPENSECATEGORY_SUCCESS = 'EXPENSECATEGORY/EXPENSECATEGORY_SUCCESS',
  EXPENSECATEGORY_FAILURE = 'EXPENSECATEGORY/EXPENSECATEGORY_FAILURE',
}

export type IExpenseCategoryState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IExpenseCategoryActionCreator = {
  type: string;
  payload: IExpenseCategoryState;
  loading: boolean;
};
