export interface BookingCreateItemModel {
  guestAccountName: string;
  remark: string;
  numberOfGuests: number;
  startDate: Date;
  endDate: Date;
  roomIdList: number[];
}
