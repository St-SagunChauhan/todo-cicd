import { IReportActionCreator, IReportActionType, IReportState } from "../models/IReportState";

const initialState: IReportState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IReportActionCreator
) => {
    switch (type) {
        case IReportActionType.REPORT_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IReportActionType.REPORT_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IReportActionType.REPORT_FAILURE:
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
