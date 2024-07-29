export interface IProduct {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}

export interface IAppState {
	catalog: IProduct[];
	preview: string | null;
}

// модель корзины
export interface IBasket {
	items: IProduct[];
  addProduct: (product: IProduct) => void;
  deleteProduct: (productId: string, payload: Function | null) => void;
}


// модель данных

export interface IAppModel {
  order: IOrder;
  
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
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

export type TPaymentMethod = 'онлайн' | '' | 'при получении';

export type TPaymentForm = Pick<IOrder, 'payment' | 'address'>;

export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;