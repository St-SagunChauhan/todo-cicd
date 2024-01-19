export enum IConnectsActionTypes {
  Connects_REQUEST = "Connects_REQUEST",
  Connects_SUCCESS = "Connects_SUCESS",
  Connects_FAILURE = "Connects_FAILURE",
}

export type IConnectsState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IConnectsStateActionCreator = {
  type: string;
  payload: IConnectsState;
  loading: boolean;
};
