import { createSelector } from 'reselect';
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.assetCategories,
  (assetCategories) => assetCategories.loading,
);

export const assetCategoriesSelector = createSelector(
  (state: IRootState) => state.assetCategories,
  (assetCategories) => assetCategories.data,
);

export const assetCategoriesError = createSelector(
  (state: IRootState) => state.assetCategories,
  (assetCategories) => assetCategories.msg,
);
