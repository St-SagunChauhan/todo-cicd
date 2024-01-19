import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.capacity,
  (capacity) => capacity.loading,
);

export const capacitySelector = createSelector(
  (state: IRootState) => state.capacity,
  (capacity) => capacity.data,
);

export const capacityError = createSelector(
  (state: IRootState) => state.capacity,
  (capacity) => capacity.msg,
);
