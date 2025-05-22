export class BookingDetails {
  bookingId: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  totalCost: number;
  status: string;

  constructor(
    bookingId: string, 
    hotelName: string, 
    roomType: string, 
    checkInDate: string, 
    checkOutDate: string, 
    totalCost: number
  ) {
    this.bookingId = bookingId || 'N/A';
    this.hotelName = hotelName || 'N/A';
    this.roomType = roomType || 'N/A';
    this.checkInDate = checkInDate || new Date().toISOString();
    this.checkOutDate = checkOutDate || new Date().toISOString();
    this.totalCost = totalCost || 0;
    this.status = 'Pending'; // Default status
  }
}
