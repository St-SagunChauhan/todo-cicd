import { IClientActionCreator, IClientActionTypes, IClientState } from "../models/IClientState";

const initialState: IClientState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IClientActionCreator
) => {
    switch (type) {
        case IClientActionTypes.Client_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IClientActionTypes.Client_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IClientActionTypes.Client_FAILURE:
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
