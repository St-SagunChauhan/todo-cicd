import { IAssetActionCreator, IAssetActionTypes, IAssetState } from "../models/IAssetState";

const initialState: IAssetState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IAssetActionCreator
) => {
    switch (type) {
        case IAssetActionTypes.Asset_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IAssetActionTypes.Asset_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IAssetActionTypes.Asset_FAILURE:
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
