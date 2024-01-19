import { IPurchaseConnectsActionCreator, IPurchaseConnectsActionType, IPurchaseConnectsState } from "../models/IPurchaseConnectState";

const initialState: IPurchaseConnectsState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IPurchaseConnectsActionCreator
) => {
    switch (type) {
        case IPurchaseConnectsActionType.Purchase_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IPurchaseConnectsActionType.Purchase_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IPurchaseConnectsActionType.Purchase_FAILURE:
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
