import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionContextMenuComponent } from '../solution-context-menu/solution-context-menu.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';

@Component({
  selector: 'app-transfer-learning-models-detail-authorized-users',
  templateUrl:
    './transfer-learning-models-detail-authorized-users.component.html',
  styleUrls: [
    './transfer-learning-models-detail-authorized-users.component.scss',
  ],
  standalone: true,
  imports: [
    MatTableModule,
    RouterLink,
    TranslateModule,
    SolutionContextMenuComponent,
    NewButtonComponent,
    IconButtonComponent,
  ],
})
export class TransferLearningModelsDetailAuthorizedUsersComponent {
  @Output() public addAuthorizedUser = new EventEmitter<void>();
  @Output() public removeAuthorizedUser = new EventEmitter<string>();
  @Input() public sharedWith: string[] = [];

  public displayedColumns: string[] = ['id', 'actions'];
}
