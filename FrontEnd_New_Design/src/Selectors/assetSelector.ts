import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.assets,
    (assets) => assets.loading
);

export const assetSelector = createSelector(
    (state: IRootState) => state.assets,
    (assets) => assets.data
);

export const assetError = createSelector(
    (state: IRootState) => state.assets,
    (assets) => assets.msg
);