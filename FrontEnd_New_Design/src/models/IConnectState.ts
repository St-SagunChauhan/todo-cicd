export enum IConnectActionTypes {
    Connect_REQUEST = "Connect_REQUEST",
    Connect_SUCCESS = "Connect_SUCESS",
    Connect_FAILURE = "Connect_FAILURE",
}

export type IConnectState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IConnectActionCreator = {
    type: string;
    payload: IConnectState;
    loading: boolean;
};