# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Продукт

```ts
interface IProduct {
	_id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}
```

Список продуктов

```ts
interface IProductsList {
	products: IProductItem[];
}
```

Интерфейс описывает данные частей приложения: каталог, превью, корзина, форма заказа

```ts
interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder;
	total: string | number;
	loading: boolean;
}
```

Данные формы заказа

```ts
interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}
```

Данные покупки

```ts
interface IOrder extends IOrderForm {
	items: string[];
}
```

Интерфейс успешного заказа

```ts
interface IOrderResult {
	id: string;
}
```

Тип категорий продуктов

```ts
type TCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
```

Тип данных, находящихся в корзине

```ts
type TBasketItem = Pick<IProduct, 'title' | 'price' | 'id'>;
```

Тип данных, при просмотре продукта

```ts
type TPreviewItem = Pick<IProduct, 'title' | 'image' | `description' | 'price'>;
```

Тип метода оплаты

```ts
type TPaymentMethod = 'онлайн' | 'при получении';
```

Тип формы оплаты

```ts
type TPaymentForm = Pick<IOrderForm, 'payment' | 'address'>;
```

Тип формы контактов

```ts
type TContactsForm = Pick<IOrderForm, 'email' | 'phone'>;
```

Тип ошибки заказа

```ts
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Хранит основные поля и методы, необходимые при работе с сервером.\
В конструктор передается базовый url (baseUrl) и опции запроса (options).

Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс Model

Абстрактный класс дженерик, обощающий в себе конструктор и метод привязки события.

Конструктор:

- принимает на вход объект данных неявного типа и объект события типа IEvent.
- производит слияние входящего объекта с родительским

Методы:

- `emmitChanges` — регистрирует входящее событие в EventEmitter

#### Класс Component

Абстрактный класс дженерик, обобщающий в себе конструктор и основные методы работы с компонентами отображения.

Конструктор:
-принимает на вход `container` типа HTMLElement

Методы:

- `toggleClass` - метод переключения классов
- `setText` - метод установки текстового содержимого
- `setDisabled` - метод смены статуса блокировки
- `setHidden` - метод скрыть
- `setVisible` - метод показать
- `setImage` - метод установить изображения с альтернативным текстом
- `render` - метод возвращения корневого DOM-элемента

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс `LarekApi`

Основной класс для работы с сервером в проекте.\
Расширяет базовый класс `Api` по интерфейсу `ILarekAPI`.

```ts
interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
```

Поля класса:

- cdn - хранит входящий url

Конструктор:

- принимает и передает в родительский конструктор Api поля baseUrl и options
- принимает и сохраняет входящий url запроса в cdn

Методы:

- getProductList — метод получения списка товаров с сервера
- orderProducts — метод отправки данных заказа на сервер

#### Класс `ProductItem`

Принимает и хранит в себе данные товара: идентификатор, заголовок, описание, категория, изображение, цена.\
Расширяет базовый абстрактный класс `Model<T>` по интерфейсу `IProduct`.

Поля класса:

- `id` - идентифекатор продукта
- `title` - название продукта
- `description` - описание продукта
- `category` - категория рассматриваемого продукта
- `image` - изображение описывающее продукт
- `price` - цена продукта

#### Класс AppState

Содержит в себе все основные группы данных страницы и методы работы с ними.\
Расширяет базовый абстрактный класс `Model<T>` по интерфейсу `IAppState`.

Поля класса:

- `_catalog` - для данных списка товаров
- `_basket` - для данных корзины покупок
- `_order` - для данных заказа, который отправляется на сервер

Методы:

- `clearBasket` - очистить данные корзины
- `addProductToBusket` - добавить продукт в корзину
- `removeProductFromBusket` - убрать один продукт из корзины
- `get total` - получить финальную сумму заказа
- `get basket` - получить данные из корзины
- `validateOrderAddress` - провести валидацию данных адреса заказа
- `validateOrderContacts` - провести валидацию данных контактов заказа

### Слой представления

Все классы представления отвечают за отображение данных внутри контейнера (DOM-элемент).

#### Класс Page

Класс отвечает за отображение всех элементов страницы: корзины, счетчика корзины, каталога товаров.\
Расширяет базовый абстрактный класс `Component<T>` по интерфейсу `IProductsList`.

Поля класса:

- `_counter` - отвечает за счетчик корзины
- `_catalog` - отвечает за хранение разметки каталога карточек
- `_buttonBasket` - отвечает за хранение разметки кнопки корзины

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает на кнопку корзины `_buttonBasket` слушатель события `click`, при котором регистрируется событие `basket:open`

Методы класса:

- `set counter` - отвечает за установку счетчика
- `set catalog` - отвечает за установку каталога
- `set isLocked` - отвечает за блокироку прокрутки страницы

#### Класс Card

Класс отвечает за отображение данных карточки товара в каталоге.\
Расширяет базовый абстрактный класс `Component<T>` по интерфейсу `IProduct`.

Поля:

- `_title` - отвечает за храненине названия карточки
- `_category` - хранит разметку категории карточки
- `_image` - хранит разметку изображения карточки
- `_price` - хранит разметку цены карточки

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- `set title` - устанавливает название товара
- `set category` - устанавливает данные категории товара
- `set image` - устанавливает данные изображение
- `set price` - устанавливает данные цены товара

#### Класс CardPreview

Класс отображает превью выбранного товара.\
Расширяет базовый абстрактный класс `Component<T>` по типу `TPreviewItem`.

Поля:

- `_button` - хранит разметку кнопки "В корзину"
- `_description` - хранит разметку описания

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- `set description` - установка содержимого описания

#### Класс CardBasket

Класс отвечает за отображение данных товара в корзине.\
Расширяет базовый абстрактный класс `Component<T>` по типу `TBasketItem`.

Поля:

- `_title` - хранит разметку названия товара
- `_price` - хранит разметку цены товара
- `_button` - хранит разметку кнопки товара

Конструктор:

- принимает `container` типа `HTMLElement` и объект `event` типа `IEvent`.
- передает `container` в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы:

- `set index` - установка данных индекса
- `set title` - установка данных названия
- `set price` - установка данных цены

#### Класс Modal

Принимает разметку модального окна, отвечает за отображение содержимого таких элементов (модальных окон).\
Расширяет базовый абстрактный класс `Component<T>` по интерфейсу `IModalData`.

```ts
interface IModalData {
	content: HTMLElement;
}
```

Поля:

- `_content` - отвечает за храненеие разметки контейнера модального окна
- `_buttonClose` - отвечает за хранение кнопки закрытия модального окна

Конструктор:

- принимает `сontainer` с типом HTMLElement и `event` с типом IEvent
- передает данные в родительский конструктор
- записывает нужные данные в поля класса
- вешает слушатель клика

Методы:

- `set сontent` - устанавливает содержимое модального окна
- `open` - открывает модальное окно
- `close` - закрывает модально окно
- `render` - отрисовывает контент и открывает модалку

#### Класс Basket

Класс отвечает за отображение корзины: кнопки сабмита, полной стоимости.\
Расширяет базовый абстрактный класс `Component<T>` по типу `TBasketItem`.

Поля:

- `_total` - хранит разметку обертки полной стоимости
- `submitButton` - хранит разметку кнопки
- `_list` - хранит разметку листа карточек (товаров)
- `items` - хранит список товаров

Конструктор:

- принимает `container` типа HTMLElement и `event` типа IEvent
- записывает данные в поля
- передает данные в родительский класс (конструктор)
- вешает слушатель на кнопку сабмита

Методы:

- `set total` - устанавливает финальную сумму
- `set items` - устанавливает карточки в разметку `_list`

#### Класс Form

Класс отвечает за обертку форм с данными, работу с ними.\
Расширяет базовый абстрактный класс `Component<T>` по интерфейсу `IForm`.

```ts
interface IForm {
	errors: string[];
	valid: boolean;
}
```

Поля:

- `_errors` - хранит разметку поля ошибок в инпутах
- `_submit` - хранит разметку кнопки сабмита

Конструктор:

- принимает `сontainer` с типом HTMLElement и `event` с типом IEvent
- передает данные в родительский конструктор
- записывает нужные данные в поля класса
- добавляет слушатели на сабмит и инпуты

Методы:

- `render` - отрисовывает форму
- `inputChange` - фиксирует изменения в инпутах
- `set valid` - устанавливает валидность формы
- `set errors` - устанавливает ошибки

#### Класс OrderAddress

Отвечает за первое модальное окно оплаты заказа, расширяет класс Form<IOrderForm>.

Поля:

- `_buttons` — хранит разметку кнопок формы оплаты

Конструктор:

- принимает `container:HTMLElement` и объект `event:IEvent`
- передает данные в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- вешает слушатель клика

Методы

- `set payment` — устанавливает класс активности на кнопку
- `set address` — устанавливает значение поля адрес

#### Класс OrderContacts

Отвечает за второе модальное окно оплаты заказа, расширяет класс Form<IOrderForm>.

Поля:

- `_button` - хранит разметку кнопки формы

Конструктор:

- принимает `container:HTMLElement` и объект `event:IEvent`
- передает данные в родительский конструктор

Методы:

- `set phone` - устанавливает значение инпута телефона
- `set email` - устанавливает значение инпута почты

#### Класс Success

Класс нужен для отображения данных успешного заказа.\
Расширяет базовый абстрактный класс `Component<T>` по интерфесу `ISuccess`

```ts
interface ISuccess {
	total: string | number;
}
```

Поля:

- `_total` - разметка общей суммы товаров
- `_close` - разметка кнопки закрытия окна

Конструктор:

- принимает `container:HTMLElement` и `actions:ISuccessActions`.
- передает данные в родительский конструктор
- сохраняет необходимые данные в поля класса
- вешает слушатель на кнопку `_close`

Методы:

- `set total` - установка полной стоимости

### Взаимодействие компонентов (Presenter)

Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в index.ts\
В index.ts сначала создаются экземпляры событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts\

Список всех событий, генерируемых в системе:
События изменения данных (генерируются классами моделями данных)

- `product:select` - изменение открываемого в модальном окне товара
- `products:changed` - изменение массива товаров
- `items:changed` - изменение массива товаров в корзине

События, возникающие при взаимодействии пользователя с интерфейсом:

- `product:addToBasket` - добавление товара в корзину
- `basket:submit` - подтверждение товаров в корзине
- `basket:open` - открытие корзины
- `basket:changed` - изменение количества товаров в корзине
- `modal:open` - изменение контента модального окна
- `modal:changed` - изменение контента модального окна
- `product:select` - выбор товара для просмотра в модальном окне
- `product:previewChange` - необходима очистка данных выбранного для показа в модальном окне товара
- `order:input` - изменение данных в форме с информацией заказа
- `contacts:input` - изменение данных в форме с контактами пользователя
- `order:submit` - сохранение данных о заказе в форме
- `contacts:submit` - сохранение данных о контактах пользователя в форме
- `order:validated` - событие после выполнения валидации формы заказа
- `contacts:validated` - событие после выполнения валидации формы контактов пользователя
- `order:completed` - завершение оформления заказа
- `contacts:completed` - завершение оформления заказа (контакты)
