import { IDeptActionTypes, IDeptActionCreator, IDeptState } from 'models/IDeptState';

const initialState: IDeptState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IDeptActionCreator) => {
  switch (type) {
    case IDeptActionTypes.DEPARTMENT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IDeptActionTypes.DEPARTMENT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IDeptActionTypes.DEPARTMENT_FAILURE:
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
