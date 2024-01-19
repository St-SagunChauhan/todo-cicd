export const StatusEnum = {
  Applied: { name: "Applied", value: 1 },
  Lead: { name: "Lead", value: 2 },
  Hired: { name: "Hired", value: 3 },
} as const;
//BillingTypes
export const BillingTypes = {
  UpworkBillingOnSystem: { name: "Upwork Billing On System", value: 1 },
  UpworkManualHours: { name: "Upwork Manual Hours", value: 2 },
  OutOfUpwork: { name: "Out Of Upwork", value: 3 },
  Milestone: { name: "Milestone", value: 4 },
  Clockify: { name: "Clockify", value: 5 },
} as const;

//Contract Status
export const ContractStatus = {
  FullTime: { name: "Full Time", value: 1 },
  PartTime: { name: "Part Time", value: 2 },
  ActiveButNoWork: { name: "Active But No Work", value: 3 },
  Completed: { name: "Completed", value: 4 },
  Closed: { name: "Closed", value: 5 },
} as const;
// AccountTypes
export const AccountTypes = {
  Agency: { name: "Agency", value: 1 },
  Freelancer: { name: "Freelancer", value: 2 },
  OutOfUpwork: { name: "Out Of Upwork", value: 3 },
  AgencyAndFreelancer: { name: "Agency And Freelancer", value: 4 },
} as const;

export const ContractType = {
  Hourly: { name: "Hourly", value: 1 },
  Fixed: { name: "Fixed", value: 2 },
} as const;

export const UpworkRating = {
  Good: { name: "Good", value: 1 },
  Average: { name: "Average", value: 2 },
  BelowAverage: { name: "Below Average", value: 3 },
} as const;
