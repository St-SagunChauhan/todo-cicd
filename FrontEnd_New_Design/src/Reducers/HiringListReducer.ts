import { IHiringListActionCreator, IHiringListActionType, IHiringListState } from '../models/IHiringListState';

const initialState: IHiringListState = {
    data: null,
    msg: null,
    loading: false,
};

const reducer = (state = initialState, { type, payload }: IHiringListActionCreator) => {
    switch (type) {
        case IHiringListActionType.HIRING_LIST_REQUEST:
            return {
                ...state,
                data: null,
                loading: true,
            };
        case IHiringListActionType.HIRING_LIST_REQUEST_SUCCESS:
            return {
                ...state,
                data: payload.data,
                msg: payload.msg,
                loading: false,
            };
        case IHiringListActionType.HIRING_LIST_REQUEST_FAILURE:
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
