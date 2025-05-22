import { Room } from "./room.model";

export interface Hotel {
  hotelID: number;
  name: string;
  location: string;
  managerID: number;
  amenities: string;
  rating: number;
  isActive: boolean;
  imageURL: string;
}