import { Component, Event, EventEmitter, h, JSX, Prop } from '@stencil/core';

@Component({
  tag: 'button-stencil',
  styleUrl: 'button-stencil.css',
  shadow: true
})
export class Button {
  /**
   * Disabled button
   */
  @Prop() public disabled: boolean = false;

  /**
   * Variation of the button
   * Available variations are primary, secondary, buy
   */
  @Prop() public variation: string = 'primary';

  /**
   * Decides if the button should
   * be a small button
   */
  @Prop() public small: boolean = false;

  /**
   * Decides the type
   */
  @Prop() public type: string = 'type';

  /**
   * Decides the name
   */
  @Prop() public name: string = 'name';

  /**
   * Decides the Id
   * a unique id will be created
   */
  @Prop() public componentId: string = '';

  /**
   * Decides the ariaLabel
   */
  @Prop() public ariaLabel: string = '';

  /**
   * Decides if you want an loader
   * on the button
   */
  @Prop() public hasLoader: boolean = false;

  /**
   * Decides if the button is loading
   */
  @Prop() public loading: boolean = false;

  /**
   * the button text
   */
  @Prop() public text!: string;

  /**
   * loading state
   */
  @Prop() public messageHasLoaded: string = '';

  /**
   * loading state
   */
  @Prop() public messageLoading: string = '';

  /**
   * OnClick event
   */
  @Event({
    eventName: 'clickHandler',
    composed: true,
    cancelable: true,
    bubbles: true
  })
  public clickHandler: EventEmitter;

  private _clickHandler: any = (e: MouseEvent) => {
    if (this.clickHandler && !this.disabled && !this.loading) {
      this.clickHandler.emit(e);
    }
  };

  private _modifiers: any = () => {
    return {
      'IcaButton--primary': !this.disabled && (!this.variation || this.variation === `primary`),
      'IcaButton--secondary': !this.disabled && this.variation === `secondary`,
      'IcaButton--buy': !this.disabled && this.variation === `buy`,
      'IcaButton--disabled': this.disabled,
      'IcaButton--small': this.small,
      IcaButton: true
    };
  };

  private _labelModifiers: any = () => {
    return {
      'IcaButton__label--inactive': this.hasLoader && this.loading,
      IcaButton__label: true,
      lIcaButton__label: true
    };
  };

  public render(): JSX.IntrinsicElements {
    return (
      <button
        class={this._modifiers()}
        disabled={this.disabled}
        type={this.type}
        name={this.name}
        id={this.componentId}
        aria-label={this.ariaLabel}
        onClick={this._clickHandler}
      >
        <div class="IcaButton__loader">
          <ica-loader
            messageHasLoaded={this.messageHasLoaded}
            messageLoading={this.messageLoading}
            loading={this.loading}
          />
        </div>
        <div class={this._labelModifiers()}>
          <slot name="first" />
          <span class="IcaButton__text">{this.text}</span>
          <slot name="last" />
        </div>
      </button>
    );
  }
}
