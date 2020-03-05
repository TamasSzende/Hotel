import {RoomListItemModel} from "./roomListItem.model";

export interface HotelDetailsModel {
	id: number;
	name: string;
	postalCode: string;
	city: string;
	streetAddress: string;
	hotelType: string;
	hotelCapacity: number;
  rooms: RoomListItemModel[]
	hotelImageUrl: string;
	description: string;
	hotelFeatures: string[];
}
