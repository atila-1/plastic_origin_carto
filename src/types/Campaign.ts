export interface Campaign {
    distance: number;
    end_date: Date;
    id: string;
    isaidriven: boolean;
    locomotion: string;
    remark: string;
    riverside: string;
    start_date: Date;
    trashes_count_by_type: TrashesCountByType;
}
export type TrashesCountByType = {
    bottleShaped: number;
    insulatingMaterial: number;
    sheetTarpPlasticBagFragment: number;
}