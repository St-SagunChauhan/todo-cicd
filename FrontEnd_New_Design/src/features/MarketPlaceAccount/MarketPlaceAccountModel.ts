export interface IMarketPlaceAccount {
    name: string;
    id?: string;
    isActive: boolean;
}
export const marketPlaceAccountInitValues: IMarketPlaceAccount = {
    name: '',
    isActive: true,
};

export type IMarketPlaceAccountResponse = {
    status: number;
    data: any;
};