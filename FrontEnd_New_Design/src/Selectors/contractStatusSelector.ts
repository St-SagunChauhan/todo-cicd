import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.contractStatus,
  (contractStatus) => contractStatus.loading
);

export const contractStatusSelector = createSelector(
  (state: IRootState) => state.contractStatus,
  (contractStatus) => contractStatus?.data
);

export const departmentError = createSelector(
  (state: IRootState) => state.contractStatus,
  (contractStatus) => contractStatus.msg
);
