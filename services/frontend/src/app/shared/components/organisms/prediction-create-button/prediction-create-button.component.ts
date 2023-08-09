import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { NgIf } from '@angular/common';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';

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
    NewButtonComponent,
  ],
})
export class PredictionCreateButtonComponent {
  @Input() public type: 'primary' | 'text' | 'FAB' = 'primary';
  @Input() public disabled?: boolean;
  @Output() public addPrediction = new EventEmitter<void>();

  get variant(): 'primary' | 'text' {
    if (this.type === 'primary' || this.type === 'FAB') {
      return 'primary';
    }
    return 'text';
  }
  get isFAB(): boolean {
    return this.type === 'FAB';
  }
}
