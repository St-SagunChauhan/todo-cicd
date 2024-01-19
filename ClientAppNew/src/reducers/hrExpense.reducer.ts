import { IHRExpenseActionCreator, IHRExpenseActionTypes, IHRExpenseState } from 'models/IHrExpenseState';

const initialState: IHRExpenseState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IHRExpenseActionCreator) => {
  switch (type) {
    case IHRExpenseActionTypes.HRExpense_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IHRExpenseActionTypes.HRExpense_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IHRExpenseActionTypes.HRExpense_FAILURE:
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
