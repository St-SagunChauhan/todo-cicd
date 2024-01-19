import {
  IProjectBilling,
  IProjectBillingActionCreator,
  IProjectBillingActionTypes,
} from '../features/ProjectBilling/ProjectBillingModel';

const initialState: IProjectBilling = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IProjectBillingActionCreator) => {
  switch (type) {
    case IProjectBillingActionTypes.PROJECT_BILLING_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IProjectBillingActionTypes.PROJECT_BILLING_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IProjectBillingActionTypes.PROJECT_BILLING_FAILURE:
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
