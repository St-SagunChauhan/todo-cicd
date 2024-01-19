import { IEodReportState, IEodReportActionCreator, IEodReportActionTypes } from 'features/EodReport/EodReportModel';

const initialState: IEodReportState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IEodReportActionCreator) => {
  switch (type) {
    case IEodReportActionTypes.EOD_REPORT_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IEodReportActionTypes.EOD_REPORT_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IEodReportActionTypes.EOD_REPORT_FAILURE:
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
