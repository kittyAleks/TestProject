import {Request, Proposal, Rating} from '../types';
import {
  mockCategories,
  mockRequests,
  mockProposals,
  mockRatings,
} from '../data/mockData';

// Initialize categories
export const initializeCategories = async () => {
  return true;
};

// Get categories
export const getCategories = async () => {
  return mockCategories;
};

// Requests
export const saveRequest = async (request: Omit<Request, 'id'>) => {
  const id = `request_${Date.now()}`;
  mockRequests.push({
    id,
    ...request,
  } as Request);
  return id;
};

export const getRequests = async () => {
  return mockRequests;
};

export const getRequestById = async (id: string) => {
  return mockRequests.find(request => request.id === id);
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
  proposalId: string,
  rating: Omit<Rating, 'id'>,
) => {
  console.log('Saving mock rating:', rating);
  const id = `rating_${Date.now()}`;
  if (!mockRatings[proposalId]) {
    mockRatings[proposalId] = [];
  }
  mockRatings[proposalId].push({
    id,
    proposalId,
    ...rating,
  } as Rating);
  return id;
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
