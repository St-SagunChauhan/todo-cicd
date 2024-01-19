export interface IProject {
  contractName: string;
  accounts: string;
  contractType: string;
  billingType: string;
  projectUrl?: string;
  departmentId?: string[];
  projectReview?: string;
  hoursPerWeek: string | null;
  clientId: string;
  startDate?: string | null;
  endDate?: string | null;
  rating?: number | null;
  employeeId?: string[];
  isActive: boolean;
  upworkName: string;
  communicationMode: string;
  country: string;
  marketPlaceAccountId: string;
  billingStatus: string;
  reason: string;
}
export const projectInitValues: IProject = {
  contractName: '',
  accounts: '',
  clientId: '',
  departmentId: [],
  contractType: '',
  billingType: '',
  projectUrl: '',
  projectReview: '',
  hoursPerWeek: '',
  startDate: null,
  endDate: null,
  rating: 0,
  employeeId: [],
  isActive: true,
  upworkName: '',
  communicationMode: '',
  country: '',
  marketPlaceAccountId: '',
  billingStatus: '',
  reason: '',
};
