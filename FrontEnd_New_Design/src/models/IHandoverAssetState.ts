export enum IHandoverAssetActionTypes {
    HandoverAsset_REQUEST = "HandoverAsset_REQUEST",
    HandoverAsset_SUCCESS = "HandoverAsset_SUCESS",
    HandoverAsset_FAILURE = "HandoverAsset_FAILURE",
}

export type IHandoverAssetState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IHandoverAssetActionCreator = {
    type: string;
    payload: IHandoverAssetState;
    loading: boolean;
};