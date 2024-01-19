import {
  IDepartmentActionCreator,
  IDepartmentActionTypes,
  IDepartmentState,
} from "../models/IDepartmentListState";

const initialState: IDepartmentState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (
  state = initialState,
  { type, payload }: IDepartmentActionCreator
) => {
  switch (type) {
    case IDepartmentActionTypes.Department_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IDepartmentActionTypes.Department_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IDepartmentActionTypes.Department_FAILURE:
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
