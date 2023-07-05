import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ButtonTypes,
  NewButtonComponent,
} from '../../molecules/new-button/new-button.component';

@Component({
  selector: 'app-databag-create-button',
  templateUrl: './databag-create-button.component.html',
  styleUrls: ['./databag-create-button.component.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf,
    TranslateModule,
    IconButtonComponent,
    MatTooltipModule,
    NewButtonComponent,
  ],
})
export class DatabagCreateButtonComponent {
  @Input() public type: 'primary' | 'text' | 'FAB' = 'text';
  @Input() public disabled?: boolean;
  @Output() public addSolution = new EventEmitter<void>();

  get variant(): ButtonTypes {
    if (this.type === 'primary' || this.type === 'FAB') {
      return ButtonTypes.primary;
    }
    return ButtonTypes.text;
  }
  get isFAB(): boolean {
    return this.type === 'FAB';
  }
}
