import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDatabagStepperComponent } from 'src/app/pages/dialogs/create-databag-stepper/create-databag-stepper.component';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../services/databag.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { ButtonComponent } from '../../../design/components/atoms/button/button.component';
import { NgFor, NgClass } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-choose-databag',
  templateUrl: './choose-databag.component.html',
  styleUrls: ['./choose-databag.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    NgFor,
    NgClass,
    ButtonComponent,
    LocalizedDatePipe,
    TranslateModule,
  ],
})
export class ChooseDatabagComponent implements OnInit {
  @Input() public databags: Databag[] = [];
  @Output() public selectedDatabagIdChange: EventEmitter<string> =
    new EventEmitter<string>();
  public selectedDatabag: Databag = {};

  constructor(
    private dialog: MatDialog,
    public databagService: DatabagService
  ) {}

  ngOnInit(): void {
    if (this.databags.length > 0) {
      this.changeSelectedDatabag(this.databags[0]);
    }
  }

  changeSelectedDatabag(databag: Databag): void {
    const id = databag.id;
    if (!id) {
      return;
    }
    this.selectedDatabag = databag;
    this.selectedDatabagIdChange.emit(id);
  }

  openAddDialog(): void {
    this.dialog.open(CreateDatabagStepperComponent);
  }
}
