import { IProduct, IOrder, IOrderResult, IGetProductsResponse } from '../types';
import { CDN_URL } from '../utils/constants';
import { Api } from './base/api';

interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekAPI {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: IGetProductsResponse) =>
      data.items.map((item) => ({
        ...item,
        image: CDN_URL + item.image,
      }))
    );
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}
