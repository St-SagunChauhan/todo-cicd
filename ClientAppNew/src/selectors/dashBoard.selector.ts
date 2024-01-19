import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.dashBoard,
  (dashBoard) => dashBoard.loading,
);

export const dashBoardSelector = createSelector(
  (state: IRootState) => state.dashBoard,
  (dashBoard) => dashBoard.data,
);

export const dashBoardError = createSelector(
  (state: IRootState) => state.emp,
  (dashBoard) => dashBoard.msg,
);
