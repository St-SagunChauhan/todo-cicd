import { IEmpProjectActionCreator, IEmpProjectActionType, IEmpProjectState } from "../models/IEmpProjectState";

const initialState: IEmpProjectState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IEmpProjectActionCreator
) => {
    switch (type) {
        case IEmpProjectActionType.EmpProject_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IEmpProjectActionType.EmpProject_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IEmpProjectActionType.EmpProject_FAILURE:
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
