export interface HotelCreateItemModel {
	id?: number;
	name: string;
	postalCode: string;
	city: string;
	streetAddress: string;
	hotelType: string;
	hotelImageUrl: string;
	description: string;
	hotelFeatures: string[];
}
