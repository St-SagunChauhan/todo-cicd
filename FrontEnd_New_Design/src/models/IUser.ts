export const IUserActionType = {
  SET_LOADING: "USER/SETLOADING",
  UPDATE_USER: "USER/UPDATEUSER",
};

export type IUser = {
  at_hash: string;
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: boolean;
  iss: string;
  locale: string;
  name: string;
  nickname: string;
  nonce: string;
  profilePicture: string;
  sub: string;
  updated_at: string;
};

export type IUserState = {
  isLoading: boolean;
  profilePicture: string | null;
};

export type IUserActionCreator = {
  type: string;
  payload: IUserState;
  loading: boolean;
};
