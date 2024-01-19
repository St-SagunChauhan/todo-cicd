import { IEmpActionCreator, IEmpState } from 'models/IEmpState';
import { IReportActionType } from 'models/IReportsState';

const initialState: IEmpState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IEmpActionCreator) => {
  switch (type) {
    case IReportActionType.REPORT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IReportActionType.REPORT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IReportActionType.REPORT_FAILURE:
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
