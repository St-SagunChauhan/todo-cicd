import { ILeaveActionTypes, ILeaveActionCreator, ILeaveState } from 'models/ILeaveState';

const initialState: ILeaveState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: ILeaveActionCreator) => {
  switch (type) {
    case ILeaveActionTypes.LEAVE_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case ILeaveActionTypes.LEAVE_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case ILeaveActionTypes.LEAVE_FAILURE:
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
