export interface IAssets {
  assetId: string;
  assetName: string;
  quantity: number | null;
  purchasedDate: string;
  manufacturerName: string;
  identificationNumber: string;
  createdDate: string;
  lastModified: string | null;
  createdBy: string;
  lastModifiedBy: string | null;
}

export const assetsInitValues: IAssets = {
  assetId: '',
  assetName: '',
  quantity: 0,
  purchasedDate: '',
  manufacturerName: '',
  identificationNumber: '',
  createdDate: '',
  lastModified: null,
  createdBy: '',
  lastModifiedBy: null,
};
