export type IClient = {
  clientId?: string;
  bidId?: string;
  clientName?: string;
  clientEmail: string | null;
  contactNo?: string;
  departmentId?: string;
  marketPlaceAccountId?: string;
  communicationId?: string;
  accountType?: string;
  country?: string;
  amountSpent?: string;
  lastFollowUpRemark?: string;
  communicationProfile?: string;
  departmentName?: string;
};
export type IClientResponse = {
  message: string;
  status: number;
  data: any;
};
