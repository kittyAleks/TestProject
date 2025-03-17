import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzasy8MAaN6NFaG08hP9U5VrqInQM1idwSI5Ig',
  authDomain: 'creatingapp-f78ad.firebaseapp.com',
  projectId: 'creatingapp-f78ad',
  storageBucket: 'creatingapp-f78ad.appspot.com',
  messagingSenderId: '76929809769',
  appId: '1:76929809769:ios:55c836aed858c8e807d1f8',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

console.log('Firebase initialized successfully');
