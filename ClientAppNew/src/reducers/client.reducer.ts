import { IClientActionCreator, IClientActionType, IClientState } from 'models/IClientState';

const initialState: IClientState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IClientActionCreator) => {
  switch (type) {
    case IClientActionType.CLIENT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IClientActionType.CLIENT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IClientActionType.CLIENT_FAILURE:
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
