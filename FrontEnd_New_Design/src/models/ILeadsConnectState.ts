export enum ILeadsConnectActionTypes {
    Leads_Connect_REQUEST = "Leads_Connect_REQUEST",
    Leads_Connect_SUCCESS = "Leads_Connect_SUCCESS",
    Leads_Connect_FAILURE = "Leads_Connect_FAILURE",
}

export type ILeadsConnectState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type ILeadsConnectActionCreator = {
    type: string;
    payload: ILeadsConnectState;
    loading: boolean;
};

export enum IDashboardLeadsConnectActionTypes {
    DashboardLeads_Connect_REQUEST = "DashboardLeads_Connect_REQUEST",
    DashboardLeads_Connect_SUCCESS = "DashboardLeads_Connect_SUCCESS",
    DashboardLeads_Connect_FAILURE = "DashboardLeads_Connect_FAILURE",
}


export type IDashboardLeadsConnectState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IDashboardLeadsConnectActionCreator = {
    type: string;
    payload: IDashboardLeadsConnectState;
    loading: boolean;
};
