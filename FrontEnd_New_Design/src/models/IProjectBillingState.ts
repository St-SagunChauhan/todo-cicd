export enum IProjectBillingActionTypes {
    ProjectBilling_REQUEST = "ProjectBilling_REQUEST",
    ProjectBilling_SUCCESS = "ProjectBilling_SUCESS",
    ProjectBilling_FAILURE = "ProjectBilling_FAILURE",
}

export type IProjectBillingState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IProjectBillingActionCreator = {
    type: string;
    payload: IProjectBillingState;
    loading: boolean;
};