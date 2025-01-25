export interface Product{
    _id?:string,
    name:string,
    shortDesription:string,
    description: string,
    price: number,
    discount: number,
    images:string[],
    categoryId: string,
    isFeatured:boolean,
    isNew:boolean
    }
    export interface WishListItem {
        _id: string;
        userId: string;
        productId: Product;  // Nested product information
        __v: number;
      }