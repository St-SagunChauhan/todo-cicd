import { IProjectDepartmentActionTypes, IProjectDepartmentState, IProjectDepartmentActionCreator } from 'models/IProjectDept';

const initialState: IProjectDepartmentState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IProjectDepartmentActionCreator) => {
  switch (type) {
    case IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_SUCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IProjectDepartmentActionTypes.PROJECT_DEPARTMENT_FAILURE:
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
