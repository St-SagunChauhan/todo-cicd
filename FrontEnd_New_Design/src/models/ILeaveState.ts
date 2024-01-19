export enum ILeaveActionTypes {
    Leave_REQUEST = "Leave_REQUEST",
    Leave_SUCCESS = "Leave_SUCESS",
    Leave_FAILURE = "Leave_FAILURE",
}

export type ILeaveState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type ILeaveActionCreator = {
    type: string;
    payload: ILeaveState;
    loading: boolean;
};