import {Request, Proposal, Rating} from '../types';
import {mockCategories, mockProposals, mockRatings} from '../data/mockData';
import {ref, set, push, get, child} from 'firebase/database';
import {db} from '../config/firebase';

// Initialize categories
export const initializeCategories = async () => {
  return true;
};

// Get categories
export const getCategories = async () => {
  return mockCategories;
};

// Transform Firebase data to Request type
const transformRequest = (data: any): Request => ({
  id: data.id,
  userId: data.userId,
  categoryId: data.categoryId,
  description: data.description,
  photos: data.photos || [],
  videos: data.videos || [],
  status: data.status,
  createdAt: new Date(data.createdAt),
  location: data.location || {
    latitude: 0,
    longitude: 0,
    address: '',
  },
});

// Save request
export const saveRequest = async (
  request: Omit<Request, 'id'>,
): Promise<string> => {
  try {
    const newRequestRef = push(ref(db, 'requests'));
    const newRequestId = newRequestRef.key;

    if (!newRequestId) {
      throw new Error('Failed to generate request ID');
    }

    await set(newRequestRef, {
      ...request,
      id: newRequestId,
      createdAt: new Date().toISOString(),
    });

    console.log('Request saved successfully:', newRequestId);
    return newRequestId;
  } catch (error) {
    console.error('Error saving request:', error);
    throw error;
  }
};

// Get all requests
export const getRequests = async (): Promise<Request[]> => {
  try {
    const snapshot = await get(child(ref(db), 'requests'));

    if (snapshot.exists()) {
      const data = snapshot.val();
      const requests = Object.values(data).map(transformRequest);
      console.log('Requests loaded:', requests.length);
      return requests;
    }

    return [];
  } catch (error) {
    console.error('Error loading requests:', error);
    throw error;
  }
};

// Get request by ID
export const getRequestById = async (id: string): Promise<Request | null> => {
  try {
    const snapshot = await get(child(ref(db), `requests/${id}`));

    if (snapshot.exists()) {
      return transformRequest(snapshot.val());
    }

    return null;
  } catch (error) {
    console.error('Error loading request:', error);
    throw error;
  }
};

// Proposals
export const saveProposal = async (proposal: Omit<Proposal, 'id'>) => {
  const id = `proposal_${Date.now()}`;
  const {requestId} = proposal;

  if (!mockProposals[requestId]) {
    mockProposals[requestId] = [];
  }

  const newProposal = {
    id,
    ...proposal,
  } as Proposal;

  mockProposals[requestId].push(newProposal);
  return id;
};

export const getProposals = async (requestId: string) => {
  return mockProposals[requestId] || [];
};

// Ratings
export const saveRating = async (
  ratingData: Omit<Rating, 'id'>,
): Promise<string> => {
  const id = `rating-${Date.now()}`;
  mockRatings[id] = {
    ...ratingData,
    id,
  };
  return id;
};

export const getRatings = async (proposalId: string): Promise<Rating[]> => {
  return Object.values(mockRatings).filter(
    rating => rating.proposalId === proposalId,
  );
};

// Upload media
export const uploadMedia = async (
  _uri: string,
  _type: 'photo' | 'video',
): Promise<string> => {
  return `https://picsum.photos/200/300?random=${Date.now()}`;
};

// Test database connection
export const testDatabaseConnection = async () => {
  console.log('Mock database connection test');
  return true;
};
