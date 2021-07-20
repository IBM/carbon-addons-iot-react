import { NgModule } from '@angular/core';

import { ButtonModule, DialogModule, TableModule } from 'carbon-components-angular';

import { CommonModule } from '@angular/common';
import { AITableHeadCell } from './head/table-head-cell.component';
import { AITableHeadComponent } from './head/table-head.component';
import { AITableComponent } from './table.component';

@NgModule({
  declarations: [AITableComponent, AITableHeadComponent, AITableHeadCell],
  imports: [DialogModule, ButtonModule, CommonModule, TableModule],
  exports: [AITableComponent, AITableHeadComponent, AITableHeadCell],
})
export class AITableModule {}
