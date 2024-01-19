export enum IContractStatusActionTypes {
  ContractStatus_REQUEST = "ContractStatus_REQUEST",
  ContractStatus_SUCCESS = "ContractStatus_SUCCESS",
  ContractStatus_FAILURE = "ContractStatus_FAILURE",
}

export interface IContractStatus {
  contractStatusName: string;
  id: number;
}

export type IContractStatusState = {
  data: any | null;
  msg?: string | null;
  loading: boolean;
};

export type IContractStatusActionCreator = {
  type: string;
  payload: IContractStatusState;
  loading: boolean;
};
