import IRootState from 'models/IRootState';
import { createSelector } from 'reselect';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.expenseCategory,
  (expenseCategory) => expenseCategory.loading,
);

export const expenseCategorySelector = createSelector(
  (state: IRootState) => state.expenseCategory,
  (expenseCategory) => expenseCategory.data,
);

export const expenseCategoryError = createSelector(
  (state: IRootState) => state.expenseCategory,
  (expenseCategory) => expenseCategory.msg,
);
