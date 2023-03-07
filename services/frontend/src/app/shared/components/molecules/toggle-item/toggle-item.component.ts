import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatLegacySlideToggle as MatSlideToggle } from '@angular/material/legacy-slide-toggle';
import { Column } from '../../../../../../build/openapi/modelmanager';

@Component({
  selector: 'app-toggle-item',
  templateUrl: './toggle-item.component.html',
  styleUrls: ['./toggle-item.component.scss'],
})
export class ToggleItemComponent {
  @Input() column: Column = {};
  @Input() disabled = false;
  @Input() selected = false;
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleClick(e: MouseEvent): void {
    e.preventDefault();
  }

  toggleChange(e: MatSlideToggle): void {
    // Workaround because toggle() Method does not trigger change events on SlideToggle Element.
    // See https://github.com/angular/components/issues/11812 and https://github.com/angular/components/pull/11846
    // For more info
    e.toggle();
    this.selected = e.checked;
    this.selectedChange.emit(this.selected);
  }
}
