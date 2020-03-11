export interface BookingCreateItemModel {
  guestName: string;
  remark: string;
  numberOfGuests: number;
  startDate: Date;
  endDate: Date;
  roomIdList: number[];
}
