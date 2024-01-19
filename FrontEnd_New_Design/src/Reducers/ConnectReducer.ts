import { IConnectActionCreator, IConnectActionTypes, IConnectState } from "../models/IConnectState";

const initialState: IConnectState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IConnectActionCreator
) => {
    switch (type) {
        case IConnectActionTypes.Connect_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IConnectActionTypes.Connect_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IConnectActionTypes.Connect_FAILURE:
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
