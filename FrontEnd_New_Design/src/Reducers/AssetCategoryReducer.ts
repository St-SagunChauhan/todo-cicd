import { IAssetCategoryActionCreator, IAssetCategoryActionTypes, IAssetCategoryState } from "../models/IAssetCategoryState";

const initialState: IAssetCategoryState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IAssetCategoryActionCreator
) => {
    switch (type) {
        case IAssetCategoryActionTypes.AssetCategory_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IAssetCategoryActionTypes.AssetCategory_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IAssetCategoryActionTypes.AssetCategory_FAILURE:
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
