import { IMarketPlaceAccountActionCreator, IMarketPlaceAccountActionTypes, IMarketPlaceAccountState } from "../models/IMarketPlaceAccountState";

const initialState: IMarketPlaceAccountState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IMarketPlaceAccountActionCreator
) => {
    switch (type) {
        case IMarketPlaceAccountActionTypes.MarketPlaceAccount_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IMarketPlaceAccountActionTypes.MarketPlaceAccount_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IMarketPlaceAccountActionTypes.MarketPlaceAccount_FAILURE:
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
