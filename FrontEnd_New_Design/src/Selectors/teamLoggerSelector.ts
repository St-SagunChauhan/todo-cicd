import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.teamLogger,
    (teamLogger) => teamLogger.loading
);

export const teamLoggerSelector = createSelector(
    (state: IRootState) => state.teamLogger,
    (teamLogger) => teamLogger?.data
);

export const teamLoggerError = createSelector(
    (state: IRootState) => state.teamLogger,
    (teamLogger) => teamLogger.msg
);