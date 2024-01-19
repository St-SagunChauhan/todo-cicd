export type IEmployee = {
    // password?: string;
    firstName: string;
    lastName: string;
    address: string;
    gender?: string;
    email: string;
    mobileNo: string;
    role?: string;
    joiningDate?: string;
    resignationDate?: string | null;
    departmentId: string;
    assignedTo?: string | null;
    isActive: boolean;
    employeeNumber: string;
    employeeId: string | null;
    department?: string;
    employeeTargetedHours: number | null;
    profilePicture?: string;
    casualLeaves?: string;
    sickLeaves?: string;
    isInImpersonation?: string;
};
export type IEmpResponse = {
    // message: string;
    status: number;
    data: any;
};
export const Gender = ['Male', 'Female'];

export const GenderEnum = {
    Male: { name: "Male", value: 1 },
    Female: { name: "Female", value: 2 },
} as const;

export const RoleEnum = {
    Admin: { name: "Admin", value: 1 },
    HR: { name: "HR", value: 2 },
    Employee: { name: "Employee", value: 3 },
    TeamLead: { name: "TeamLead", value: 4 },
    BD: { name: "BD", value: 5 },
    BDM: { name: "BDM", value: 6 }
} as const;