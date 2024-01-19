export interface ILeave {
    id: string;
    employeeId: string;
    leaveType: string;
    status: string;
    startDate?: string | '';
    reason: string;
    endDate?: string | '' | null;
    isActive: boolean;
}

export const leaveValues: ILeave = {
    id: '',
    employeeId: '',
    leaveType: '',
    status: '',
    startDate: '',
    reason: '',
    endDate: '',
    isActive: true,
};
