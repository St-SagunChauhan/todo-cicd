export enum ICapacityActionType {
    CAPACITY_REQUEST = 'CAPACITY_REQUEST',
    CAPACITY_REQUEST_SUCCESS = 'CAPACITY_REQUEST_SUCCESS',
    CAPACITY_REQUEST_FAILURE = 'CAPACITY_REQUEST_FAILURE',
}

export type ICapacityState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type ICapacityActionCreator = {
    type: string;
    payload: ICapacityState;
    loading: boolean;
};