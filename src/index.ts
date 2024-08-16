import './scss/styles.scss';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { Card, CardBasket, CardPreview } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { IOrderForm, IProduct } from './types';
import { Basket } from './components/common/Basket';
import { Order, Сontacts } from './components/Order';
import { Success } from './components/common/Success';

// шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const api = new LarekApi(API_URL);

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Сontacts(cloneTemplate(contactsTemplate), events);

events.onAll((event) => {
  console.log(event.eventName, event.data);
});

events.on('catalog:changed', () => {
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

events.on('product:select', (item: IProduct) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('product:addToBasket', item),
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      text: item.description,
      price: item.price,
      category: item.category,
      button: appData.getPreviewButton(item),
    }),
  });
});

events.on('product:addToBasket', (item: IProduct) => {
  appData.addProductToBasket(item);
  appData.updateOrder();
  page.counter = appData.basket.length;
  modal.close();
});

events.on('basket:open', () => {
  basket.total = appData.getTotal();
  let i = 1;
  basket.list = appData.basket.map((item) => {
    const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('card:removeFromBasket', item),
    });
    return basketCard.render({
      title: item.title,
      price: item.price,
      index: i++,
    });
  });
  modal.render({
    content: basket.render(),
  });
});

events.on('card:removeFromBasket', (item: IProduct) => {
  appData.removeProductFromBasket(item);
  appData.updateOrder();
  page.counter = appData.basket.length;
  basket.total = appData.getTotal();
  let i = 1;
  basket.list = appData.basket.map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('card:removeFromBasket', item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: i++,
    });
  });
  modal.render({
    content: basket.render(),
  });
});

events.on('order:open', () => {
  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

events.on('payment:changed', (item: HTMLButtonElement) => {
  appData.order.payment = item.name;
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone, address, payment } = errors;
  order.valid = !address && !payment;
  contacts.valid = !email && !phone;
  order.errors = Object.values({ address, payment })
    .filter((i) => !!i)
    .join('; ');
  contacts.errors = Object.values({ phone, email })
    .filter((i) => !!i)
    .join('; ');
});

events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setContactsField(data.field, data.value);
  }
);

// Изменилось одно из полей заказа - сохраняем данные об этом
events.on(
  /^order\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
  }
);

events.on('order:submit', () => {
  appData.order.total = appData.getTotal();
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
});

events.on('contacts:submit', () => {
  api
    .orderProducts(appData.order)
    .then(() => {
      console.log(appData.order);
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          appData.clearBasket();
          page.counter = appData.basket.length;
        },
      });

      modal.render({
        content: success.render({
          total: appData.getTotal(),
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

api
  .getProductList()
  .then((data) => {
    appData.setCatalog(data);
  })
  .catch((error) => {
    console.log(error);
  });
