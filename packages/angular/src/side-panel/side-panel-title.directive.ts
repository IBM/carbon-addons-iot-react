import { Directive, HostBinding, Input } from '@angular/core';

/**
 * selector: `aiSidePanelTitle`
 */
@Directive({
  selector: '[aiSidePanelTitle]',
  exportAs: 'aiSidePanelTitle',
})
export class SidePanelTitleDirective {
  @HostBinding('class.iot--side-panel-title') titleClass = true;
  @Input() @HostBinding('class.iot--side-panel-title__condensed') condensed = false;
  @Input() @HostBinding('class.iot--side-panel-title__with-close') showClose = true;
}
