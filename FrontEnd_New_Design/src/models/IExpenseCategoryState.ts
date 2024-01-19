export enum IExpenseCategoryActionTypes {
    ExpenseCategory_REQUEST = "ExpenseCategory_REQUEST",
    ExpenseCategory_SUCCESS = "ExpenseCategory_SUCCESS",
    ExpenseCategory_FAILURE = "ExpenseCategory_FAILURE",
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