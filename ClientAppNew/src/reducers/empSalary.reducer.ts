import { IEmpSalaryActionCreator, IEmpSalaryActionType, IEmpSalaryState } from 'models/IEmpSalaryState';

const initialState: IEmpSalaryState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IEmpSalaryActionCreator) => {
  switch (type) {
    case IEmpSalaryActionType.EMP_Salary_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IEmpSalaryActionType.EMP_Salary_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IEmpSalaryActionType.EMP_Salary_FAILURE:
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
