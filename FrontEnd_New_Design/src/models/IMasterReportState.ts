export enum IMasterReportActionType {
    MasterReport_REQUEST = ' MasterReport_REQUEST',
    MasterReport_SUCCESS = ' MasterReport_SUCCESS',
    MasterReport_FAILURE = ' MasterReport_FAILURE',
}

export type IMasterReportState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IMasterReportActionCreator = {
    type: string;
    payload: IMasterReportState;
    loading: boolean;
};
