import { IProjectBillingActionCreator, IProjectBillingActionTypes, IProjectBillingState } from "../models/IProjectBillingState";

const initialState: IProjectBillingState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: IProjectBillingActionCreator
) => {
    switch (type) {
        case IProjectBillingActionTypes.ProjectBilling_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IProjectBillingActionTypes.ProjectBilling_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IProjectBillingActionTypes.ProjectBilling_FAILURE:
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
