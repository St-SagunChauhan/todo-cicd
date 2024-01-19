import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.assetHandovered,
  (assetHandovered) => assetHandovered.loading,
);

export const assetHandoverSelector = createSelector(
  (state: IRootState) => state.assetHandovered,
  (assetHandovered) => assetHandovered.data,
);

export const assetHandoverError = createSelector(
  (state: IRootState) => state.assetHandovered,
  (assetHandovered) => assetHandovered.msg,
);
