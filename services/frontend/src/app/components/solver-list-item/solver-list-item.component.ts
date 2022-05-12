import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Column} from '../../../../build/openapi/objectstore';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-solver-list-item',
  templateUrl: './solver-list-item.component.html',
  styleUrls: ['./solver-list-item.component.scss']
})
export class SolverListItemComponent {
  @Input() column: Column = {};
  @Input() disabled = false;
  @Input() selected = false;
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleClick(e: MouseEvent) {
    e.preventDefault();
  }

  toggleChange(e: MatSlideToggle) {
    // Workaround because toggle() Method does not trigger change events on SlideToggle Element.
    // See https://github.com/angular/components/issues/11812 and https://github.com/angular/components/pull/11846
    // For more info
    e.toggle();
    this.selected = e.checked;
    this.selectedChange.emit(this.selected);
  }
}
