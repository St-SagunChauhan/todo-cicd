import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isConnectsLoadingSelector = createSelector(
  (state: IRootState) => state.connects,
  (connects) => connects.loading
);

export const connectsSelector = createSelector(
  (state: IRootState) => state.connects,
  (connects) => connects?.data
);

export const connectsError = createSelector(
  (state: IRootState) => state.connects,
  (connects) => connects.msg
);
