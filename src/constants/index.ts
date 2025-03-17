export const CATEGORIES = [
  {id: '1', name: 'Ремонт', icon: 'tools'},
  {id: '2', name: 'Уборка', icon: 'broom'},
  {id: '3', name: 'Доставка', icon: 'truck'},
  {id: '4', name: 'Красота', icon: 'cut'},
  {id: '5', name: 'Обучение', icon: 'book'},
];

export const ROUTES = {
  HOME: 'Home',
  ADD_REQUEST: 'AddRequest',
  REQUEST_DETAILS: 'RequestDetails',
  PROFILE: 'Profile',
  AUTH: 'Auth',
} as const;

export const FIREBASE_CONFIG = {

};

export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
};
