import { ICapacityActionCreator, ICapacityActionType, ICapacityState } from "../models/ICapacityState";

const initialState: ICapacityState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (
    state = initialState,
    { type, payload }: ICapacityActionCreator
) => {
    switch (type) {
        case ICapacityActionType.CAPACITY_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case ICapacityActionType.CAPACITY_REQUEST_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case ICapacityActionType.CAPACITY_REQUEST_FAILURE:
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
