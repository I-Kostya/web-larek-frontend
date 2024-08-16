import './scss/styles.scss';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { API_URL, testData } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { Card, CardBasket, CardPreview } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { IProduct } from './types';
import { Basket } from './components/common/Basket';

// шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const api = new LarekApi(API_URL);

events.onAll((event) => {
  console.log(event.eventName, event.data);
});

api
  .getProductList()
  .then((data) => {
    appData.setCatalog(data);
    console.log('добавили в каталог', appData.catalog);
    appData.emitChanges('products:changed', appData.catalog);
  })
  .catch((error) => {
    console.log(error);
  });

events.on('products:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('product:select', item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

events.on('basket:open', () => {
  basket.total = appData.getTotal();
  basket.list = appData.basket.map((item) => {
    const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('card:remove', item),
    });
    return basketCard.render({
      title: item.title,
      price: item.price,
      index: appData.setBasketIndex(item),
    });
  });
  modal.render({
    content: basket.render(),
  });
});

events.on('product:select', (item: IProduct) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:addToBasket', item),
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      text: item.description,
      price: item.price,
      category: item.category,
    }),
  });
});

events.on('card:addToBasket', (item: IProduct) => {
  appData.addProductToBasket(item);
  appData.updateOrder();
  page.counter = appData.basket.length;
  modal.close();
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});
