import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.connectHistory,
  (connectHistory) => connectHistory.loading,
);

export const connectHistorySelector = createSelector(
  (state: IRootState) => state.connectHistory,
  (connectHistory) => connectHistory.data,
);

export const connectHistoryError = createSelector(
  (state: IRootState) => state.connectHistory,
  (connectHistory) => connectHistory.msg,
);
