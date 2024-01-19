import {
  IContractStatusActionCreator,
  IContractStatusActionTypes,
  IContractStatusState,
} from "../models/IContractStatusState";

const initialState: IContractStatusState = {
  data: null,
  msg: null,
  loading: false,
};

const reducer = (
  state = initialState,
  { type, payload }: IContractStatusActionCreator
) => {
  switch (type) {
    case IContractStatusActionTypes.ContractStatus_REQUEST:
      return {
        ...state,
        data: null,
        loading: true,
      };
    case IContractStatusActionTypes.ContractStatus_SUCCESS:
      return {
        ...state,
        data: payload.data,
        msg: payload.msg,
        loading: false,
      };
    case IContractStatusActionTypes.ContractStatus_FAILURE:
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
