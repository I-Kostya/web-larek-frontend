import { IProduct, TCategory } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

enum Categories {
  'софт-скил' = 'card__category_soft',
  'другое' = 'card__category_other',
  'дополнительное' = 'card__category_additional',
  'кнопка' = 'card__category_button',
  'хард-скил' = 'card__category_hard',
}

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement(`.card__title`, container);
    this._category = ensureElement(`.card__category`, container);
    this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
    this._price = ensureElement(`.card__price`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(id: string) {
    this.container.dataset.id = id;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set category(value: TCategory) {
    this._category.textContent = value;
    this._category.classList.add(Categories[value]);
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }

  set price(value: number) {
    if (value !== null) {
      this._price.textContent = String(value) + ' синапсов';
    } else {
      this._price.textContent = 'Бесценно';
    }
  }
}

export class CardPreview extends Card {
  protected _text: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._text = ensureElement(`.card__text`, container);
  }

  set text(value: string) {
    this.setText(this._text, value);
  }
}

export class CardBasket extends Card {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this._title = ensureElement(`.card__title`, container);
    this._price = ensureElement(`.card__price`, container);
    this._index = ensureElement(`.basket__item-index`, container);
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set index(value: number) {
    this.setText(this._index, value);
  }
}
