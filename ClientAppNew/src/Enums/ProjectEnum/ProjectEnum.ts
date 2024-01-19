export enum BillingTypeEnum {
  UpworkBillingOnSystem = 'Upwork Billing On System',
  UpworkManualHours = 'Upwork Manual Hours',
  OutOfUpwork = 'Out Of Upwork',
  Milestone = 'Milestone',
  Clockify = 'Clockify',
}

export enum ContractTypeEnum {
  Hourly = 'Hourly',
  Fixed = 'Fixed',
}
export enum ContractStatus {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  ActiveButNoWork = 'Active But No Work',
}
export enum AccountTypeEnum {
  Agency = 'Agency',
  Freelancer = 'Freelancer',
  AgencyAndFreelancer = 'AgencyAndFreelancer',
}
export enum ProjectStatusEnum {
  Completed = 'Completed',
  Active = 'Active',
  OnHold = 'OnHold',
}

export const AccountType = [AccountTypeEnum.Agency, AccountTypeEnum.Freelancer, AccountTypeEnum.AgencyAndFreelancer];
