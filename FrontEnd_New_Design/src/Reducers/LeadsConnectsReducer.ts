import { ILeadsConnectActionCreator,ILeadsConnectActionTypes,ILeadsConnectState } from "../models/ILeadsConnectState";

const initialState: ILeadsConnectState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: ILeadsConnectActionCreator
) => {
    switch (type) {
        case ILeadsConnectActionTypes.Leads_Connect_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case ILeadsConnectActionTypes.Leads_Connect_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case ILeadsConnectActionTypes.Leads_Connect_FAILURE:
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
