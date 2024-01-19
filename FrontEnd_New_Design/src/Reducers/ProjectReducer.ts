import { IProjectActionCreator, IProjectActionTypes, IProjectState } from "../models/IProjectState";

const initialState: IProjectState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IProjectActionCreator
) => {
    switch (type) {
        case IProjectActionTypes.PROJECT_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IProjectActionTypes.PROJECT_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IProjectActionTypes.PROJECT_FAILURE:
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
