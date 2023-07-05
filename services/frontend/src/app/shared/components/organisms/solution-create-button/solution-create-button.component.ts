import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../../design/components/atoms/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconButtonComponent } from '../../../../design/components/atoms/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import {ButtonTypes, NewButtonComponent} from "../../molecules/new-button/new-button.component";

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
    NewButtonComponent,
  ],
})
export class SolutionCreateButtonComponent {
  @Input() public type: 'primary' | 'text' | 'FAB' = 'primary';
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
