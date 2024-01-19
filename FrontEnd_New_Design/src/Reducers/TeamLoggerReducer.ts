import { ITeamLoggerActionCreator, ITeamLoggerActionTypes, ITeamLoggerState } from "../models/ITeamLoggerState";

const initialState: ITeamLoggerState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: ITeamLoggerActionCreator
) => {
    switch (type) {
        case ITeamLoggerActionTypes.TeamLogger_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case ITeamLoggerActionTypes.TeamLogger_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case ITeamLoggerActionTypes.TeamLogger_FAILURE:
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
