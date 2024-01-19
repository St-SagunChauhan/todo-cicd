import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.hrExpense,
  (hrExpense) => hrExpense.loading
);

export const hrExpenseSelector = createSelector(
  (state: IRootState) => state.hrExpense,
  (hrExpense) => hrExpense?.data
);

export const hrExpenseError = createSelector(
  (state: IRootState) => state.hrExpense,
  (hrExpense) => hrExpense.msg
);
