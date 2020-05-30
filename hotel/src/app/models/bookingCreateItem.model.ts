import {RoomReservationShortItemModel} from "./roomReservationShortItem.model";

export interface BookingCreateItemModel {
  guestAccountName: string;
  remark: string;
  numberOfGuests: number;
  roomReservationList: RoomReservationShortItemModel[];
}
