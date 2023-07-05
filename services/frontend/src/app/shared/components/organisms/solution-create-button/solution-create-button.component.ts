import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonVariant } from '../../../lib/types/button-types';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-solution-create-button',
  templateUrl: './solution-create-button.component.html',
  styleUrls: ['./solution-create-button.component.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    TranslateModule,
    IconButtonComponent,
    MatTooltipModule,
    NgIf,
  ],
})
export class SolutionCreateButtonComponent {
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
