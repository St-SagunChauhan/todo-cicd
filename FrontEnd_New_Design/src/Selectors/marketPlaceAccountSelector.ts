import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.marketPlaceAccount,
    (marketPlaceAccount) => marketPlaceAccount.loading
);

export const marketPlaceAccountSelector = createSelector(
    (state: IRootState) => state.marketPlaceAccount,
    (marketPlaceAccount) => marketPlaceAccount?.data
);

export const marketPlaceAccountError = createSelector(
    (state: IRootState) => state.marketPlaceAccount,
    (marketPlaceAccount) => marketPlaceAccount.msg
);