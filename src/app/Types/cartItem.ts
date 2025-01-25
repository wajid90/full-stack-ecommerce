import {Product} from './product'

export interface CartItem {
  product: {
    _id: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    discount: number;
    images: string[];
    categoryId: string[];
    brandId: string[];
    isFeatured: boolean;
    isNew: boolean;
  };
  quantity: number;
}
