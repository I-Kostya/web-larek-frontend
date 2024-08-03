export interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: TCategory;
  image: string;
  price: number | null;
}

export interface IProductsList {
  products: IProduct[];
}

export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder;
  total: string | number;
  loading: boolean;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}


export type TCategory =
  | 'софт-скил'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type TBasketItem = Pick<IProduct, 'title' | 'price'>;

export type TPreviewItem = Pick<
  IProduct,
  'title' | 'image' | 'description' | 'price'
>;

export type TPaymentMethod = 'онлайн' | 'при получении';

export type TPaymentForm = Pick<IOrderForm, 'payment' | 'address'>;

export type TContactsForm = Pick<IOrderForm, 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
