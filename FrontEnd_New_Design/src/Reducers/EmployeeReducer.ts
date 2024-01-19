import { IEmployeeActionCreator, IEmployeeActionTypes, IEmployeeState } from "../models/IEmployeeState";

const initialState: IEmployeeState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IEmployeeActionCreator
) => {
    switch (type) {
        case IEmployeeActionTypes.Employee_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IEmployeeActionTypes.Employee_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IEmployeeActionTypes.Employee_FAILURE:
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
