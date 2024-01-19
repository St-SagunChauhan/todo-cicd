import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.dept,
  (dept) => dept.loading,
);

export const deptSelector = createSelector(
  (state: IRootState) => state.dept,
  (dept) => dept.data,
);

export const deptError = createSelector(
  (state: IRootState) => state.dept,
  (dept) => dept.msg,
);

// export const teamLoggerSelector = createSelector(
//   (state: IRootState) => state.teamLogger,
//   (teamLogger) => teamLogger.data,
// );
