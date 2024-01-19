import { IEmpActionCreator, IEmpActionType, IEmpState } from 'models/IEmpState';

const initialState: IEmpState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IEmpActionCreator) => {
  switch (type) {
    case IEmpActionType.EMP_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IEmpActionType.EMP_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IEmpActionType.EMP_FAILURE:
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
