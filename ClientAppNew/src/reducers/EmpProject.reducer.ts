import { IEmpProjectActionCreator, IEmpProjectActionType, IEmpProjectState } from 'models/IEmpProjectsState';

const initialState: IEmpProjectState = {
  data: null,
  msg: null,
};

const reducer = (state = initialState, { type, payload }: IEmpProjectActionCreator) => {
  switch (type) {
    case IEmpProjectActionType.EmpProject_REQUEST:
      return {
        ...state,
        data: null,
      };
    case IEmpProjectActionType.EmpProject_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
      };
    case IEmpProjectActionType.EmpProject_FAILURE:
      return {
        ...state,
        msg: payload.msg,
      };
    default:
      return state;
  }
};

export default reducer;
