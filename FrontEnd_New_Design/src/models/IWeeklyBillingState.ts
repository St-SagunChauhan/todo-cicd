export enum IWeeklyBillingActionType {
    WEEKLY_BILLING_REQUEST = 'WEEKLY_BILLING_REQUEST',
    WEEKLY_BILLING_REQUEST_SUCCESS = 'WEEKLY_BILLING_REQUEST_SUCCESS',
    WEEKLY_BILLING_REQUEST_FAILURE = 'WEEKLY_BILLING_REQUEST_FAILURE',
}

export type IWeeklyBillingState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IWeeklyBillingActionCreator = {
    type: string;
    payload: IWeeklyBillingState;
    loading: boolean;
};
