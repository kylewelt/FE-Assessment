export interface Hospital {
  id: number;
  name: string;
  address: Address;
  rating: number;
  icon: string;
}

export interface Address {
  line1: string,
  line2: string,
  city: string,
  state: string,
  zipCode: string
}