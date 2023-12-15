import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SolutionContextMenuComponent } from '../solution-context-menu/solution-context-menu.component';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { IconButtonComponent } from '../../molecules/icon-button/icon-button.component';
import { JsonPipe } from '@angular/common';
import {
  ModelShare,
} from '../../../../../build/openapi/modelmanager';

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
    JsonPipe,
  ],
})
export class TransferLearningModelsDetailAuthorizedUsersComponent {
  @Output() public addAuthorizedUser = new EventEmitter<void>();
  @Output() public removeAuthorizedUser = new EventEmitter<string>();
  @Input() public modelShare: ModelShare[] = [];

  public displayedColumns: string[] = ['id', 'actions'];
  public dataSource: MatTableDataSource<ModelShare>;

  constructor() {
    this.dataSource = new MatTableDataSource<ModelShare>(this.modelShare);
  }
}
