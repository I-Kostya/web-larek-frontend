import { IProduct, IOrder, IOrderResult, IGetProductsResponse } from '../types';
import { Api } from './base/api';

interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekAPI {
  readonly cdn: string;
  
  constructor(baseUrl: string, cdn: string, options?: RequestInit) {
    super(baseUrl, options);

    this.cdn = cdn;
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: IGetProductsResponse) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}
