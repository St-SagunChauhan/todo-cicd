import { IConnectHistoryActionCreator, IConnectHistoryActionType, IConnectHistoryState } from 'models/IConnectHistoryState';

const initialState: IConnectHistoryState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IConnectHistoryActionCreator) => {
  switch (type) {
    case IConnectHistoryActionType.CONNECT_HISTORY_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IConnectHistoryActionType.CONNECT_HISTORY_REQUEST_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IConnectHistoryActionType.CONNECT_HISTORY_REQUEST_FAILURE:
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
