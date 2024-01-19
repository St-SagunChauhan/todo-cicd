export enum IClientActionTypes {
    Client_REQUEST = "Client_REQUEST",
    Client_SUCCESS = "Client_SUCESS",
    Client_FAILURE = "Client_FAILURE",
}

export type IClientState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IClientActionCreator = {
    type: string;
    payload: IClientState;
    loading: boolean;
};