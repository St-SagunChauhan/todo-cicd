import { IDashBoardActionType, IDashBoardActionCreator, IDashBoardState } from 'models/IDashBoardState';

const initialState: IDashBoardState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IDashBoardActionCreator) => {
  switch (type) {
    case IDashBoardActionType.DashBoard_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IDashBoardActionType.DashBoard_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IDashBoardActionType.DashBoard_FAILURE:
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
