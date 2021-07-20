// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// imports
import {
  ButtonModule,
  PlaceholderModule,
  DialogService,
  DialogModule,
  LinkModule,
  IconModule,
  I18nModule,
} from 'carbon-components-angular';

import { SidePanel } from './side-panel.component';
import { SidePanelTitleDirective } from './side-panel-title.directive';
import { SidePanelFooterDirective } from './side-panel-footer.directive';

@NgModule({
  declarations: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
  exports: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
  providers: [DialogService],
  imports: [
    ButtonModule,
    CommonModule,
    I18nModule,
    PlaceholderModule,
    DialogModule,
    IconModule,
    LinkModule,
  ],
})
export class SidePanelModule {}
