export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  {id: 'repair', name: 'Repair', icon: 'tools'},
  {id: 'cleaning', name: 'Cleaning', icon: 'broom'},
  {id: 'delivery', name: 'Delivery', icon: 'truck-delivery'},
];
