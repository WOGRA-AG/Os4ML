import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Params } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ContextMenuItemComponent } from '../../molecules/context-menu-item/context-menu-item.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { StringToTLMOriginPipe } from '../../../pipes/string-to-tlmorigin.pipe';
import { TransferLearningModelsDetailDeleteModelComponent } from '../transfer-learning-models-detail-delete-model/transfer-learning-models-detail-delete-model.component';

@Component({
  selector: 'app-transfer-learning-model-context-menu',
  templateUrl: './transfer-learning-model-context-menu.component.html',
  styleUrls: ['./transfer-learning-model-context-menu.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    IconButtonComponent,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    ContextMenuItemComponent,
    NgIf,
    StringToTLMOriginPipe,
    TransferLearningModelsDetailDeleteModelComponent,
  ],
})
export class TransferLearningModelContextMenuComponent {
  @Input() public deleteTransferLearningModelDisabled = true;
  @Input() public showTransferLearningModelDetailParams: Params = {};
  @Input() public showTransferLearningModelDetailLink: string[] | string = [];
  @Output() public deleteTransferLearningModelButton =
    new EventEmitter<string>();
}
