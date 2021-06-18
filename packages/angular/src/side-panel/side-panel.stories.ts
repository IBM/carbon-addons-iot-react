import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  PlaceholderModule,
} from 'carbon-components-angular';

import { SidePanelModule } from './side-panel.module';
import { action } from '@storybook/addon-actions';

@Component({
  selector: 'ai-side-panel-component',
  template: `
    <div style="display: flex;">
      <ai-side-panel
        *ngIf="side === 'left'"
        [showClose]="showClose"
        [showDrawer]="showDrawer"
        [active]="active"
        [overlay]="overlay"
        [variation]="variation"
        [side]="side"
        (close)="active = !active; close.emit()"
      >
        <div aiSidePanelTitle>Filter</div>
        <div class="panel-content">Content</div>
        <div class="panel-footer">
          <button ibmButton="secondary">Cancel</button>
          <button ibmButton>Initiate</button>
        </div>
      </ai-side-panel>
      <div style="display: inline-block; position: relative; margin-left: 1rem; margin-right: 1rem">
        <h2>Content</h2>
        <button
          ibmButton
          *ngIf="variation === 'slide-in' || variation === 'slide-over'"
          (click)="active = !active"
        >
          {{ active ? 'Deactivate' : 'Activate' }}
        </button>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus nulla. Fusce et
          enim et elit rutrum interdum quis eu nulla. Nulla neque neque, condimentum eget
          pellentesque sit amet, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet.
          Vivamus eu pellentesque turpis, eget ultricies lectus. Vestibulum sodales massa non
          lobortis interdum. Sed cursus sem in dolor tempus tempus. Pellentesque et nisi vel erat
          egestas ultricies.
        </p>
        <p>
          Etiam id risus nec mi laoreet suscipit. Phasellus porttitor accumsan placerat. Donec
          auctor nunc id erat congue, tincidunt viverra diam feugiat. Donec sit amet quam vel augue
          auctor posuere. Nunc maximus volutpat nulla vel vehicula. Praesent bibendum nulla at erat
          facilisis sodales. Aenean aliquet dui vel iaculis tincidunt. Praesent suscipit ultrices mi
          eget finibus. Mauris vehicula ultricies auctor. Nam vestibulum iaculis lectus, nec sodales
          metus lobortis non.
        </p>
        <p>
          Suspendisse nulla est, consectetur non convallis et, tristique eu risus. Sed ut tortor et
          nulla tempor vulputate et vel ligula. Curabitur egestas lorem ut mi vestibulum porttitor.
          Fusce eleifend vehicula semper. Donec luctus neque quam, et blandit eros accumsan at.
        </p>
      </div>
      <ai-side-panel
        *ngIf="side === 'right'"
        [showClose]="showClose"
        [showDrawer]="showDrawer"
        [active]="active"
        [overlay]="overlay"
        [variation]="variation"
        [side]="side"
        (close)="active = !active; close.emit()"
      >
        <div aiSidePanelTitle>Filter</div>
        <div class="panel-content">Content</div>
        <div class="panel-footer">
          <button ibmButton="secondary">Cancel</button>
          <button ibmButton>Initiate</button>
        </div>
      </ai-side-panel>
    </div>
  `,
  styles: [
    `
      .panel-content {
        margin-left: 1rem;
        margin-right: 1rem;
        min-height: 330px;
      }

      .panel-footer {
        min-width: 15.4rem;
        display: flex;
        width: calc(100% + 2px);
        position: absolute;
        bottom: 0;
        margin: -1px;
      }

      .panel-footer > * {
        flex-grow: 1;
        margin: 1px;
      }

      .panel-footer > button.bx--btn {
        padding-right: 60px;
      }
    `,
  ],
})
class StoryCustomComponent implements OnInit {
  @Input() showClose = true;
  @Input() showDrawer = false;
  @Input() variation: 'slide-in' | 'inline' | 'slide-over' = 'inline';
  @Input() active: false;
  @Input() overlay: false;
  @Input() side: 'left' | 'right' = 'left';
  @Output() close = new EventEmitter();
}

storiesOf('Components/Side panel', module)
  .addDecorator(
    moduleMetadata({
      declarations: [StoryCustomComponent],
      imports: [ButtonModule, DialogModule, PlaceholderModule, SidePanelModule, IconModule],
      entryComponents: [StoryCustomComponent],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-side-panel-component
        [showClose]="showClose"
        [showDrawer]="showDrawer"
        [active]="active"
        [overlay]="overlay"
        [variation]="variation"
        [side]="side"
        (close)="close($event)">
      </ai-side-panel-component>
    `,
    props: {
      showClose: boolean('showClose', true),
      showDrawer: boolean('showDrawer', false),
      active: boolean('active', false),
      overlay: boolean('overlay', false),
      variation: select('variation', ['slide-in', 'inline', 'slide-over'], 'inline'),
      side: select('side', ['left', 'right'], 'left'),
      close: action('close'),
    },
  }));
