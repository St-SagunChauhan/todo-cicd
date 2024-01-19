import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.connectleads,
    (connectleads) => connectleads.loading
);

export const leadsConnectSelector = createSelector(
    (state: IRootState) => state.connectleads,
    (connectleads) => connectleads.data
);

export const leadsConnectError = createSelector(
    (state: IRootState) => state.connectleads,
    (connectleads) => connectleads.msg
);