export enum IBidReportActionTypes {
    Bid_Report_REQUEST = "Bid_Report_REQUEST",
    Bid_Report_SUCCESS = "Bid_Report_SUCCESS",
    Bid_Report_FAILURE = "Bid_Report_FAILURE",
}

export type IBidReportState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IBidReportActionCreator = {
    type: string;
    payload: IBidReportState;
    loading: boolean;
};