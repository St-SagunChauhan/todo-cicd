import { IWeeklyProjectActionCreator, IWeeklyProjectActionType, IWeeklyProjectState } from 'models/IWeeklyProjectState';

const initialState: IWeeklyProjectState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IWeeklyProjectActionCreator) => {
  switch (type) {
    case IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IWeeklyProjectActionType.WEEKLY_PROJECT_REQUEST_FAILURE:
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
