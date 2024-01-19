export interface IConnect {
  employeeId: string;
  departmentId: string;
  marketPlaceAccountId: string;
  connectUsed: number | null;
  connect_Date: string | null;
  bidStatus: string;
  jobUrl: string;
  dealsWon: number | null;
  marketingQualifiedLeads: number | null;
  salesQualifiedLeads: number | null;
  technology: string | null;
}

export const connectValues: IConnect = {
  employeeId: '',
  departmentId: '',
  marketPlaceAccountId: '',
  connectUsed: 0,
  connect_Date: '',
  bidStatus: '',
  jobUrl: '',
  salesQualifiedLeads: 0,
  marketingQualifiedLeads: 0,
  dealsWon: 0,
  technology: '',
};
