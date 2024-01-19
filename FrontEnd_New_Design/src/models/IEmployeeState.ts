export enum IEmployeeActionTypes {
    Employee_REQUEST = "Employee_REQUEST",
    Employee_SUCCESS = "Employee_SUCESS",
    Employee_FAILURE = "Employee_FAILURE",
}

export type IEmployeeState = {
    data: any | null;
    msg?: string | null;
    loading: boolean;
};

export type IEmployeeActionCreator = {
    type: string;
    payload: IEmployeeState;
    loading: boolean;
};