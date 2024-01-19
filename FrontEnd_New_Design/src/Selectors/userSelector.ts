import { createSelector } from "reselect";
import IRootState from "../models/IRootState";

export const isLoadingSelector = createSelector(
  [
    (state: IRootState) => state.userProfile,
    (userProfile) => userProfile.userProfile.isLoading,
  ],
  (state, isLoading) => {
    return isLoading;
  }
);

export const userProfileSeletore = createSelector(
  [
    (state: IRootState) => state.userProfile,
    (userProfile) => userProfile.userProfile,
  ],
  (state, profilePicture) => {
    return profilePicture;
  }
);
