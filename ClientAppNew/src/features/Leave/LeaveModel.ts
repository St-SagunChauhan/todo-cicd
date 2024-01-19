export interface ILeave {
  employeeId: string;
  leaveType: string;
  status: string;
  startDate?: string | '';
  reason: string;
  endDate?: string | '' | null;
  isActive: boolean;
}

export const leaveValues: ILeave = {
  employeeId: '',
  leaveType: '',
  status: '',
  startDate: '',
  reason: '',
  endDate: '',
  isActive: true,
};
