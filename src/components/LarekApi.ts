import { IProduct, IOrder, IOrderResult, IProductsList, IGetProductsResponse } from "../types";
import { Api } from "./base/api";

interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}


export class LarekApi extends Api implements ILarekAPI {
  
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: IGetProductsResponse) => data.items);
  };

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }


}