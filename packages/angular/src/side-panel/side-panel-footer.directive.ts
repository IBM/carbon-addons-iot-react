import { Directive, HostBinding } from '@angular/core';

/**
 * selector: `aiSidePanelFooter`
 */
@Directive({
  selector: '[aiSidePanelFooter]',
  exportAs: 'aiSidePanelFooter',
})
export class SidePanelFooterDirective {
  @HostBinding('class.iot--side-panel-footer') footerClass = true;
}
