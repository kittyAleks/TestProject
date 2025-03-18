export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Request {
  id: string;
  categoryId: string;
  description: string;
  photos: string[];
  videos: string[];
  status: 'active' | 'completed' | 'cancelled';
  userId: string;
  createdAt: string;
  location: Location;
}

export type RequestCreate = Omit<Request, 'id'>;

export interface Proposal {
  id: string;
  requestId: string;
  userId: string;
  price: number;
  description: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  proposalId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'provider';
  averageRating?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type NavigationParams = {
  Home: undefined;
  AddRequest: undefined;
  RequestDetails: {requestId: string};
  CategoryList: undefined;
};
