import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.purchaseConnect,
    (purchaseConnect) => purchaseConnect.loading
);

export const purchaseConnectSelector = createSelector(
    (state: IRootState) => state.purchaseConnect,
    (purchaseConnect) => purchaseConnect?.data
);

export const purchaseConnectError = createSelector(
    (state: IRootState) => state.purchaseConnect,
    (purchaseConnect) => purchaseConnect.msg
);