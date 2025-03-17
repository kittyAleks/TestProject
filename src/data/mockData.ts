import {Request, Proposal, Rating, Category} from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Cleaning',
    icon: 'broom',
  },
  {
    id: '2',
    name: 'Repair',
    icon: 'tools',
  },
  {
    id: '3',
    name: 'Moving',
    icon: 'truck',
  },
];

export const mockRequests: Request[] = [
  {
    id: '1',
    userId: 'user1',
    categoryId: '1',
    description: 'Need help cleaning 2-bedroom apartment',
    photos: ['https://example.com/photo1.jpg'],
    videos: [],
    status: 'active',
    createdAt: new Date('2024-03-15'),
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: 'New York, NY',
    },
  },
  {
    id: '2',
    userId: 'user2',
    categoryId: '2',
    description: 'Fix leaking faucet in kitchen',
    photos: [],
    videos: ['https://example.com/video1.mp4'],
    status: 'active',
    createdAt: new Date('2024-03-14'),
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA',
    },
  },
];

export const mockProposals: Record<string, Proposal[]> = {
  '1': [
    {
      id: '1',
      requestId: '1',
      userId: 'provider1',
      price: 120,
      description:
        'I can help clean your apartment. I have 5 years of experience.',
      createdAt: new Date('2024-03-15T10:00:00'),
    },
    {
      id: '2',
      requestId: '1',
      userId: 'provider2',
      price: 150,
      description: 'Professional cleaning service with eco-friendly products.',
      createdAt: new Date('2024-03-15T11:30:00'),
    },
  ],
};

export const mockRatings: Record<string, Rating[]> = {
  '1': [
    {
      id: '1',
      proposalId: '1',
      userId: 'user1',
      rating: 5,
      comment: 'Excellent service, very thorough cleaning',
      createdAt: new Date('2024-03-16'),
    },
  ],
};
