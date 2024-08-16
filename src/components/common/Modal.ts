import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      container
    );
    this._content = ensureElement('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
    this.content = null;
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();

    return this.container;
  }
}
