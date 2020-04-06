export interface RoomReservationDataModel {
  bookingId: number;
  guestFirstName: string;
  guestLastName: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
}
