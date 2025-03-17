export interface Request {
  id: string;
  userId: string;
  photos: string[];
  videos: string[];
  description: string;
  categoryId: string;
  createdAt: Date;
  status: 'active' | 'completed';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

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
