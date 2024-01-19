import { IAssetsActionType, IAssetsState, IAssetsActionCreator } from 'models/IAssetsState';

const initialState: IAssetsState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IAssetsActionCreator) => {
  switch (type) {
    case IAssetsActionType.ASSETS_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IAssetsActionType.ASSETS_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IAssetsActionType.ASSETS_FAILURE:
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
