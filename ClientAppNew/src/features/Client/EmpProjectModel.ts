export interface IEmpProject {
  clientName: string;
  contactNo: string;
  address: string;
  communication: string;
  clientEmail: string;
}

export const EmpProjectInitValues: IEmpProject = {
  clientName: '',
  contactNo: '',
  address: '',
  communication: '',
  clientEmail: '',
};

export type EmpProject = {
  clientName?: string;
  contactNo?: string;
  address?: string;
  communication?: string;
  clientId?: string;
  clientEmail?: string;
  initials?: {
    label: string;
    state: string;
  };
};

export const initialUser: EmpProject = {
  clientName: '',
  contactNo: '',
  address: '',
  communication: '',
  clientId: '',
  clientEmail: '',
};
