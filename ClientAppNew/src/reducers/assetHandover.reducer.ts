import { IAssetsHandoverState, IAssetsHandoverActionType, IAssetsHandoverActionCreator } from 'models/IAssetHandoveredState';

const initialState: IAssetsHandoverState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IAssetsHandoverActionCreator) => {
  switch (type) {
    case IAssetsHandoverActionType.ASSETSHANDOVER_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IAssetsHandoverActionType.ASSETSHANDOVER_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IAssetsHandoverActionType.ASSETSHANDOVER_FAILURE:
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
