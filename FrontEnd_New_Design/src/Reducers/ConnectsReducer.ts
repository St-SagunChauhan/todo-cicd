import {
  IConnectsActionTypes,
  IConnectsState,
  IConnectsStateActionCreator,
} from "../models/IConnectsState";

const initialState: IConnectsState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (
  state = initialState,
  { type, payload }: IConnectsStateActionCreator
) => {
  switch (type) {
    case IConnectsActionTypes.Connects_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IConnectsActionTypes.Connects_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IConnectsActionTypes.Connects_FAILURE:
      return {
        ...state,
        msg: payload.msg,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
