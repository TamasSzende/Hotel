import {RoomShortListItemModel} from "./roomShortListItem.model";

export interface BookingListItemModel {
  id: number;
  guestName: string;
  startDate: Date;
  endDate: Date;
  reservedRooms: RoomShortListItemModel[];
  numberOfGuests: number;
  dateOfBooking: Date;
}
