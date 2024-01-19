import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
    (state: IRootState) => state.assetCategories,
    (assetCategories) => assetCategories.loading
);

export const assetCategorySelector = createSelector(
    (state: IRootState) => state.assetCategories,
    (assetCategories) => assetCategories.data
);

export const assetCategoryError = createSelector(
    (state: IRootState) => state.assetCategories,
    (assetCategories) => assetCategories.msg
);