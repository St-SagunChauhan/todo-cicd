export interface IHandoverAsset {
  handoverId?: string;
  assetId?: string[];
  employeeId?: string;
  assignedDate?: string | null;
  identificationNumber?: string | null;
}
export const handoverAssetInitValues: IHandoverAsset = {
  handoverId: '',
  assetId: [],
  employeeId: '',
  assignedDate: null,
  identificationNumber: '',
};
