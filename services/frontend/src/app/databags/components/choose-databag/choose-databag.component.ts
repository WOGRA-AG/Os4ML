import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from '../../services/databag.service';
import { CreateDatabagStepperComponent } from '../create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-choose-databag',
  templateUrl: './choose-databag.component.html',
  styleUrls: ['./choose-databag.component.scss'],
})
export class ChooseDatabagComponent implements OnInit {
  @Input() databags: Databag[] = [];
  @Output() selectedDatabagId: EventEmitter<string> =
    new EventEmitter<string>();
  selectedDatabag: Databag = {};

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
    const id = databag.databagId;
    if (!id) {
      return;
    }
    this.selectedDatabag = databag;
    this.selectedDatabagId.emit(id);
  }

  openAddDialog(): void {
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateDatabagStepperComponent },
    });
  }
}
