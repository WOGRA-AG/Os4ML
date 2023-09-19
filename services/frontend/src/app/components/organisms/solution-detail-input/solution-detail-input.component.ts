import { Component, Input } from '@angular/core';
import { TransferLearningSetting } from '../../../../../build/openapi/modelmanager';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule  } from '@angular/cdk/table';
import { TranslateModule } from '@ngx-translate/core';
import {JsonPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-solution-detail-input',
  templateUrl: './solution-detail-input.component.html',
  styleUrls: ['./solution-detail-input.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    CdkTableModule,
    TranslateModule,
    JsonPipe,
    RouterLink,
    NgForOf,
  ],
})
export class SolutionDetailInputComponent {
  @Input() public transferLearningSettings: TransferLearningSetting[] = [];

  public displayedColumns: string[] = [
    'name',
    'type',
    'selectedTransferLearningModel',
  ];
}
