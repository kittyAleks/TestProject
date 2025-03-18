import {Request, Proposal, Rating} from '../types';
import {ref, set, push, get, child} from 'firebase/database';
import {db} from '../config/firebase';

// Initialize categories
export const initializeCategories = async () => {
  return true;
};

// Get categories from Firebase
export const getCategories = async () => {
  try {
    const snapshot = await get(child(ref(db), 'categories'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error loading categories:', error);
    throw error;
  }
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

// Save proposal
export const saveProposal = async (
  proposal: Omit<Proposal, 'id'>,
): Promise<string> => {
  try {
    const newProposalRef = push(ref(db, `proposals/${proposal.requestId}`));
    const newProposalId = newProposalRef.key;

    if (!newProposalId) {
      throw new Error('Failed to generate proposal ID');
    }

    await set(newProposalRef, {
      ...proposal,
      id: newProposalId,
      createdAt: new Date().toISOString(),
    });

    return newProposalId;
  } catch (error) {
    console.error('Error saving proposal:', error);
    throw error;
  }
};

// Get proposals for request
export const getProposals = async (requestId: string): Promise<Proposal[]> => {
  try {
    const snapshot = await get(child(ref(db), `proposals/${requestId}`));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error loading proposals:', error);
    throw error;
  }
};

// Save rating
export const saveRating = async (
  ratingData: Omit<Rating, 'id'>,
): Promise<string> => {
  try {
    const newRatingRef = push(ref(db, `ratings/${ratingData.proposalId}`));
    const newRatingId = newRatingRef.key;

    if (!newRatingId) {
      throw new Error('Failed to generate rating ID');
    }

    await set(newRatingRef, {
      ...ratingData,
      id: newRatingId,
      createdAt: new Date().toISOString(),
    });

    return newRatingId;
  } catch (error) {
    console.error('Error saving rating:', error);
    throw error;
  }
};

// Get ratings for proposal
export const getRatings = async (proposalId: string): Promise<Rating[]> => {
  try {
    const snapshot = await get(child(ref(db), `ratings/${proposalId}`));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error loading ratings:', error);
    throw error;
  }
};

// Upload media
export const uploadMedia = async (
  uri: string,
  type: 'photo' | 'video',
): Promise<string> => {
  // TODO: Implement Firebase Storage upload
  return uri;
};

// Test database connection
export const testDatabaseConnection = async () => {
  console.log('Mock database connection test');
  return true;
};
