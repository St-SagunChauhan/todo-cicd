import { IAssetsCategoryActionCreator, IAssetsCategoryActionType, IAssetsCategoryState } from 'models/IAssetsCategory';

const initialState: IAssetsCategoryState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IAssetsCategoryActionCreator) => {
  switch (type) {
    case IAssetsCategoryActionType.ASSETSCATEGORY_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IAssetsCategoryActionType.ASSETSCATEGORY_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IAssetsCategoryActionType.ASSETSCATEGORY_FAILURE:
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
