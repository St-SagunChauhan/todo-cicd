import { IMasterReportActionType, IMasterReportActionCreator, IMasterReportState } from 'models/IMasterReport';

const initialState: IMasterReportState = {
  data: null,
  msg: null,
  loading: false,
};
const reducer = (state = initialState, { type, payload }: IMasterReportActionCreator) => {
  switch (type) {
    case IMasterReportActionType.MasterReport_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IMasterReportActionType.MasterReport_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IMasterReportActionType.MasterReport_FAILURE:
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
