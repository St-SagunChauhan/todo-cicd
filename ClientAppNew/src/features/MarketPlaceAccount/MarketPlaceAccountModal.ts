export interface IMarketPlaceAccount {
  name: string;
  accounts: string;
  id?: string;
  message?: string;
  isActive: boolean;
}
export interface IPassword {
  id?: string;
  password: string;
  newPassword: string;
}

export interface IResponse {
  marketPlaceAccount: null;
  message: string;
  success: boolean;
}
export const deptInitValues: IMarketPlaceAccount = {
  name: '',
  accounts: '',
  isActive: true,
};
