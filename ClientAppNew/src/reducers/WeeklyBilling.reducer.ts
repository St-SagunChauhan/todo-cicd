import { IWeeklyBillingActionCreator, IWeeklyBillingActionType, IWeeklyBillingState } from 'models/IWeeklyBillingState';

const initialState: IWeeklyBillingState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IWeeklyBillingActionCreator) => {
  switch (type) {
    case IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IWeeklyBillingActionType.WEEKLY_BILLING_REQUEST_FAILURE:
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
