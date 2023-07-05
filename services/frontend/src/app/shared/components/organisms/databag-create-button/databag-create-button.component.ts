import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonVariant } from '../../../lib/types/button-types';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
})
export class DatabagCreateButtonComponent {
  @Input() public type: 'primary' | 'base' | 'FAB' = 'base';
  @Input() public disabled?: boolean;
  @Output() public addSolution = new EventEmitter<void>();

  get variant(): ButtonVariant {
    if (this.type === 'primary' || this.type === 'FAB') {
      return 'raised';
    }
    return 'basic';
  }
  get isFAB(): boolean {
    return this.type === 'FAB';
  }
}
