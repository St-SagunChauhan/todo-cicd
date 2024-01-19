import { IProjectHealthActionTypes, IProjectHealthActionCreator, IProjectHealthState } from 'models/IProjectHealthState';

const initialState: IProjectHealthState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (state = initialState, { type, payload }: IProjectHealthActionCreator) => {
  switch (type) {
    case IProjectHealthActionTypes.PROJECTHEALTH_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IProjectHealthActionTypes.PROJECTHEALTH_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IProjectHealthActionTypes.PROJECTHEALTH_FAILURE:
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
