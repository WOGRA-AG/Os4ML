import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer-learning-model-create-button',
  templateUrl: './transfer-learning-model-create-button.component.html',
  styleUrls: ['./transfer-learning-model-create-button.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, NgIf, TranslateModule],
})
export class TransferLearningModelCreateButtonComponent {
  @Input() public type: 'primary' | 'text' | 'FAB' = 'primary';
  @Output() public addTransferLearningModel = new EventEmitter<void>();
  get variant(): 'primary' | 'text' {
    if (this.type === 'primary' || this.type === 'FAB') {
      return 'primary';
    }
    return 'text';
  }
}
