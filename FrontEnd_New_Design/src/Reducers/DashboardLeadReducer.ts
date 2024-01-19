import { IDashboardLeadsConnectActionCreator, IDashboardLeadsConnectActionTypes, IDashboardLeadsConnectState } from "../models/ILeadsConnectState";


const initialState: IDashboardLeadsConnectState = {
    data: null,
    msg: null,
    loading: false,
};


const reducer = (
    state = initialState,
    { type, payload }: IDashboardLeadsConnectActionCreator
) => {
    switch (type) {
        case IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IDashboardLeadsConnectActionTypes.DashboardLeads_Connect_FAILURE:
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
