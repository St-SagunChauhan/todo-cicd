import {
  IMarketPlaceAccountActionTypes,
  IMarketPlaceAccountActionCreator,
  IMarketPlaceAccountState,
} from 'models/IMarketPlaceAccountState';

const initialState: IMarketPlaceAccountState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IMarketPlaceAccountActionCreator) => {
  switch (type) {
    case IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IMarketPlaceAccountActionTypes.MARKETPLACEACCOUNT_FAILURE:
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
