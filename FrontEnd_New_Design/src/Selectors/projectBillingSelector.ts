import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.projectBilling,
    (projectBilling) => projectBilling.loading
);

export const projectBillingSelector = createSelector(
    (state: IRootState) => state.projectBilling,
    (projectBilling) => projectBilling?.data
);

export const projectBillingError = createSelector(
    (state: IRootState) => state.projectBilling,
    (projectBilling) => projectBilling.msg
);