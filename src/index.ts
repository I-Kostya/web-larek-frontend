import './scss/styles.scss';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { testData } from './utils/constants';


const events = new EventEmitter();

events.onAll((event) => {
  console.log(event.eventName, event.data);
})


const appData = new AppState({}, events);

appData.setCatalog(testData.items);

console.log('добавили в каталог', appData.catalog);
appData.addProductToBasket(testData.items[0])
console.log('добавили в корзину', appData.basket);
console.log(appData.getTotal());
appData.addProductToBasket(testData.items[1])
appData.clearBasket();
console.log('добавили в корзину', appData.basket);
console.log(appData.getTotal());

appData.setOrderAddress('г. Москва, ул. Ленина, д. 1');
appData.setOrderEmail('a@a.ru');
appData.setOrderPhone('8-800-555-35-35');
appData.setOrderPayment('онлайн');
appData.updateOrder();
// appData.clearOrder();

console.log('данные заказа', appData.order);

appData.setPreview(testData.items[0]);
console.log('получили превью', appData.preview);



