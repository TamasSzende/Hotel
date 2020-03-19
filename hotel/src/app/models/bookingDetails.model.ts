import {RoomShortListItemModel} from "./roomShortListItem.model";
import {HotelShortItemModel} from "./hotelShortItem.model";
import {AccountDetailsModel} from "./accountDetails.model";

export interface BookingDetailsModel {
  id: number;
  hotel: HotelShortItemModel;
  guest: AccountDetailsModel;
  remark: string;
  startDate: Date;
  endDate: Date;
  reservedRooms: RoomShortListItemModel[];
  numberOfGuests: number;
  dateOfBooking: Date;
  priceOfBooking: number;
}
