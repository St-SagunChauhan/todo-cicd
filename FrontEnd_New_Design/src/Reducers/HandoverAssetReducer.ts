import { IHandoverAssetActionCreator, IHandoverAssetActionTypes, IHandoverAssetState } from "../models/IHandoverAssetState";

const initialState: IHandoverAssetState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IHandoverAssetActionCreator
) => {
    switch (type) {
        case IHandoverAssetActionTypes.HandoverAsset_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IHandoverAssetActionTypes.HandoverAsset_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IHandoverAssetActionTypes.HandoverAsset_FAILURE:
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
