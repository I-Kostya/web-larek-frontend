export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

export interface IGetProductsResponse {
  total: number;
  items: IProduct[];
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
  total: string | number;
}

export interface IOrder extends IOrderForm {
  items: string[];
}

export interface IOrderResult {
  id: string;
}


export type TCategory =
  | 'софт-скил'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type TBasketItem = Pick<IProduct, 'title' | 'price' | 'id'>;

export type TPreviewItem = Pick<
  IProduct,
  'title' | 'image' | 'description' | 'price' | 'id'
>;

export type TPaymentForm = Pick<IOrderForm, 'payment' | 'address'>;

export type TContactsForm = Pick<IOrderForm, 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
