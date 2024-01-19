import { IConnectActionTypes, IConnectActionCreator, IConnectState } from 'models/IConnectState';

const initialState: IConnectState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IConnectActionCreator) => {
  switch (type) {
    case IConnectActionTypes.CONNECT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IConnectActionTypes.CONNECT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IConnectActionTypes.CONNECT_FAILURE:
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
