import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonVariant } from '../../../lib/types/button-types';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { NgIf } from '@angular/common';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-prediction-create-button',
  templateUrl: './prediction-create-button.component.html',
  styleUrls: ['./prediction-create-button.component.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf,
    IconButtonComponent,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class PredictionCreateButtonComponent {
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
