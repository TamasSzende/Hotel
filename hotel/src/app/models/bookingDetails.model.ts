import {RoomShortListItemModel} from "./roomShortListItem.model";
import {HotelShortItemModel} from "./hotelShortItem.model";

export interface BookingDetailsModel {
  id: number;
  hotel: HotelShortItemModel;
  guestName: string;
  remark: string;
  startDate: Date;
  endDate: Date;
  reservedRooms: RoomShortListItemModel[];
  numberOfGuests: number;
  dateOfBooking: Date;
  priceOfBooking: number;
}
