export interface IClients {
  clientName: string;
  departmentId: string;
  marketPlaceAccountId: string;
  accounts: string;
  country: string;
  communication: string;
  clientEmail: string;
  isActive: boolean;
}

export const clientsInitValues: IClients = {
  clientName: '',
  departmentId: '',
  marketPlaceAccountId: '',
  accounts: '',
  country: '',
  communication: '',
  clientEmail: '',
  isActive: true,
};

export type Clients = {
  clientName?: string;
  departmentId?: string;
  marketPlaceAccountId?: string;
  accounts: string;
  country?: string;
  communication?: string;
  clientId?: string;
  clientEmail?: string;
  isActive: boolean;
  initials?: {
    label: string;
    state: string;
  };
};

export const initialUser: Clients = {
  clientName: '',
  departmentId: '',
  marketPlaceAccountId: '',
  accounts: '',
  country: '',
  communication: '',
  clientId: '',
  clientEmail: '',
  isActive: true,
};
