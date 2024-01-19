import { IBidReportActionCreator, IBidReportState, IBidReportActionTypes } from "../models/IBidReportState";

const initialState: IBidReportState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IBidReportActionCreator
) => {
    switch (type) {
        case IBidReportActionTypes.Bid_Report_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IBidReportActionTypes.Bid_Report_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IBidReportActionTypes.Bid_Report_FAILURE:
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