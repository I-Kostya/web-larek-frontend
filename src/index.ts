import './scss/styles.scss';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { API_URL, testData } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';

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
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:select', item),
    });
    return card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
    });
});
});
