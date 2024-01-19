import { createSelector } from "reselect";

// types
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
  [(state: IRootState) => state.app, (app) => app.app.isLoading],
  (state, isLoading) => {
    return isLoading;
  }
);

export const userSelector = createSelector(
  [(state: IRootState) => state.auth, (auth) => auth.Auth.user],
  (state, user) => {
    return user;
  }
);

export const roleSelector = createSelector(
  [(state: IRootState) => state.auth, (auth) => auth.Auth.role],
  (state, role) => {
    return role;
  }
);

export const userError = createSelector(
  [(state: IRootState) => state.auth, (auth) => auth],
  (state, auth) => {
    return auth;
  }
);
