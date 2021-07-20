import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  Close16,
  ChevronLeft16,
  ChevronRight16,
  OpenPanelLeft16,
  OpenPanelRight16,
} from '@carbon/icons';
import { IconService } from 'carbon-components-angular';

/**
 *
 * [See demo](../../?path=/story/components-side-panel--basic)
 *
 * html:
 * ```
 * <ai-side-panel>
 *	options
 * </ai-side-panel>
 * ```
 */
@Component({
  selector: 'ai-side-panel',
  template: `
    <div
      class="panel"
      [ngClass]="{
        'iot--side-panel__left': side === 'left',
        'iot--side-panel__right': side === 'right'
      }"
    >
      <button
        *ngIf="showClose || showDrawer"
        tabindex="0"
        class="iot--btn bx--btn bx--btn--ghost bx--btn--icon-only close-button"
        type="button"
        (click)="close.emit()"
      >
        <svg *ngIf="showClose && !shouldShowDrawer" ibmIcon="close" size="16"></svg>
        <svg
          *ngIf="shouldShowDrawer && active && side === 'left'"
          [ibmIcon]="closeIcon || 'chevron--left'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && active && side === 'right'"
          [ibmIcon]="closeIcon || 'chevron--right'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && !active && side === 'left'"
          [ibmIcon]="drawerIcon || 'open-panel--left'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && !active && side === 'right'"
          [ibmIcon]="drawerIcon || 'open-panel--right'"
          size="16"
        ></svg>
      </button>
      <div class="panel-content-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['side-panel.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidePanel implements OnInit {
  @HostBinding('class.iot--side-panel') sidePanelClass = true;
  @HostBinding('class.iot--side-panel__slide-in') get sidePanelSlideInClass() {
    return this.variation === 'slide-in';
  }
  @HostBinding('class.iot--side-panel__inline') get sidePanelInlineClass() {
    return this.variation === 'inline';
  }
  @HostBinding('class.iot--side-panel__slide-over') get sidePanelSlideOverClass() {
    return this.variation === 'slide-over';
  }
  @HostBinding('class.iot--side-panel__right') get sidePanelRightClass() {
    return this.side === 'right';
  }
  @HostBinding('class.iot--side-panel__drawer') get sidePanelDrawerClass() {
    return this.showDrawer && !this.active;
  }
  @Input() showClose = true;
  @Input() showDrawer = false;
  /**
   * Name of the icon to use when `showDrawer` is `true` and `active` is `false`
   */
  @Input() drawerIcon: string;
  /**
   * Name of the icon to use as close icon when `showDrawer` is `true`
   */
  @Input() closeIcon: string;
  @Input() variation: 'slide-in' | 'inline' | 'slide-over' = 'inline';
  /**
   * Activates the panel when set to `true`, by sliding it in or over.
   *
   * Has no effect for `variation` `inline`
   */
  @Input()
  @HostBinding('class.active')
  active = false;

  /**
   * Enables overlay when active with `variation` `slide-over`.
   */
  @Input() overlay: false;

  @Input() side: 'left' | 'right' = 'left';

  @Output() close = new EventEmitter();

  get shouldShowDrawer() {
    return this.showDrawer && this.variation === 'inline';
  }

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Close16);
    this.iconService.register(ChevronLeft16);
    this.iconService.register(ChevronRight16);
    this.iconService.register(OpenPanelLeft16);
    this.iconService.register(OpenPanelRight16);
  }
}
