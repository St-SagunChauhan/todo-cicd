import { createSelector } from 'reselect';
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.assets,
  (assets) => assets.loading,
);

export const assetsSelector = createSelector(
  (state: IRootState) => state.assets,
  (assets) => assets.data,
);

export const assetsError = createSelector(
  (state: IRootState) => state.assets,
  (assets) => assets.msg,
);
