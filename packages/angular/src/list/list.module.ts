import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckboxModule, IconModule, SearchModule } from 'carbon-components-angular';
import { AIListComponent } from './ai-list.component';
import { AIListHeaderComponent } from './list-header/ai-list-header';
import { AIListItemComponent } from './list-item/ai-list-item.component';
import { AIListTargetDirective } from './list-item/ai-list-target.directive';
import { AIListItemWrapperComponent } from './list-item/ai-list-item-wrapper.component';

export { AIListItem } from './list-item/ai-list-item.class';

@NgModule({
  declarations: [
    AIListHeaderComponent,
    AIListItemComponent,
    AIListItemWrapperComponent,
    AIListComponent,
    AIListTargetDirective,
  ],
  exports: [
    AIListHeaderComponent,
    AIListItemComponent,
    AIListItemWrapperComponent,
    AIListComponent,
    AIListTargetDirective,
  ],
  imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
})
export class ListModule {}
