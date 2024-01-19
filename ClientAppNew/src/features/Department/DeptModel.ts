export interface IDept {
  departmentName: string;
  departmentId?: string;
  isActive: boolean;
}
export const deptInitValues: IDept = {
  departmentName: '',
  isActive: true,
};

export type IDeptResponse = {
  status: number;
  data: any;
};
