import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
  list: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement('.basket__list', container);
    this._total = ensureElement('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>(
      '.basket__button',
      container
    );

    if (this._button) {
      this._button.addEventListener('click', () => {
        this.events.emit('order:open');
      });
    }

    this.list = [];
  }

  set list(items: HTMLElement[]) {
    if (items.length) {
      this.setDisabled(this._button, false);
      this._list.replaceChildren(...items);
    } else {
      this.setDisabled(this._button, true);
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        })
      );
    }

    console.log();
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }
}
