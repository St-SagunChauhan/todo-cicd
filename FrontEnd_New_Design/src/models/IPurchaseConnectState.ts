export enum IPurchaseConnectsActionType {
    Purchase_REQUEST = 'Purchase_REQUEST',
    Purchase_SUCCESS = 'Purchase_SUCCESS',
    Purchase_FAILURE = 'Purchase_FAILURE',
}

export type IPurchaseConnectsState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IPurchaseConnectsActionCreator = {
    type: string;
    payload: IPurchaseConnectsState;
    loading: boolean;
};