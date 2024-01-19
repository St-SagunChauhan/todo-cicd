export interface IExpenseCategoryModel {
  categoryName: string;
  expenseCategoryId?: string;
  isActive: boolean;
}
export const expenseCategoryInitValues: IExpenseCategoryModel = {
  categoryName: '',
  isActive: true,
};

export type IExpenseCategoryResponse = {
  status: number;
  data: any;
};
