import { IExpenseCategoryActionCreator, IExpenseCategoryActionTypes, IExpenseCategoryState } from 'models/IExpenseCategoryState';

const initialState: IExpenseCategoryState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IExpenseCategoryActionCreator) => {
  switch (type) {
    case IExpenseCategoryActionTypes.EXPENSECATEGORY_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IExpenseCategoryActionTypes.EXPENSECATEGORY_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IExpenseCategoryActionTypes.EXPENSECATEGORY_FAILURE:
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
