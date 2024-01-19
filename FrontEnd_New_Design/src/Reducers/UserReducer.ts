import {
  IUserActionType,
  IUserState,
  IUserActionCreator,
} from "../models/IUser";

const initialState: IUserState = {
  isLoading: false,
  profilePicture: null,
};

const reducer = (
  state = initialState,
  { type, payload }: IUserActionCreator
) => {
  switch (type) {
    case IUserActionType.SET_LOADING:
      return {
        ...state,
        isLoading: true,
        profilePicture: null,
      };
    case IUserActionType.UPDATE_USER: {
      return {
        ...state,
        isLoading: false,
        profilePicture: payload.profilePicture,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
