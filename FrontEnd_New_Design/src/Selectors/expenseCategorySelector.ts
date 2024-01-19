import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.expenseCategory,
    (expenseCategory) => expenseCategory.loading
);

export const expenseCategorySelector = createSelector(
    (state: IRootState) => state.expenseCategory,
    (expenseCategory) => expenseCategory?.data
);

export const expenseCategoryError = createSelector(
    (state: IRootState) => state.expenseCategory,
    (expenseCategory) => expenseCategory.msg
);