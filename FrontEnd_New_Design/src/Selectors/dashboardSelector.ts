import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingDashboardSelector = createSelector(
    (state: IRootState) => state.dashboardLeads,
    (dashboardLeads) => dashboardLeads.loading
);

export const dashboardLeadsConnectSelector = createSelector(
    (state: IRootState) => state.dashboardLeads,
    (dashboardLeads) => dashboardLeads.data
);

export const dashboardLeadsConnectError = createSelector(
    (state: IRootState) => state.dashboardLeads,
    (dashboardLeads) => dashboardLeads.msg
);