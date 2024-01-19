import { createSelector } from 'reselect';

// types
import IRootState from 'models/IRootState';

export const isLoadingSelector = createSelector(
  (state: IRootState) => state.client,
  (client) => client.loading,
);

export const clientSelector = createSelector(
  (state: IRootState) => state.client,
  (client) => client.data,
);

export const clientError = createSelector(
  (state: IRootState) => state.client,
  (client) => client.msg,
);
