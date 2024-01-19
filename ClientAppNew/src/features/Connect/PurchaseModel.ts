export type IPurchasehistory = {
  Id: string;
  PurchasedDate: string;
  NumberConnects: number;
  Price: number;
  UpworkID: string;
  Department: string;
  ConnectsUsed: number;
};
export type IPurchasehistoryResponse = {
  // message: string;
  status: number;
  data: any;
};
export const Role = ['Admin', 'HR', 'Employee', 'TeamLead'];
export const Gender = ['Male', 'Female'];

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}
// export const Gender = [GenderEnum.Male, GenderEnum.Female];
