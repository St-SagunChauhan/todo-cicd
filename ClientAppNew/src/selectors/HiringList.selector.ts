import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.hiringlist,
  (hiringList) => hiringList.loading,
);

export const hiringListSelector = createSelector(
  (state: IRootState) => state.hiringlist,
  (hiringlist) => hiringlist.data,
);

export const hiringListError = createSelector(
  (state: IRootState) => state.hiringlist,
  (hiringlist) => hiringlist.msg,
);
