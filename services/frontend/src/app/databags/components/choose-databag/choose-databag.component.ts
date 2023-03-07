import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CreateDatabagStepperComponent } from 'src/app/templates/dialogs/create-databag-stepper/create-databag-stepper.component';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DatabagService } from '../../services/databag.service';

@Component({
  selector: 'app-choose-databag',
  templateUrl: './choose-databag.component.html',
  styleUrls: ['./choose-databag.component.scss'],
})
export class ChooseDatabagComponent implements OnInit {
  @Input() databags: Databag[] = [];
  @Output() selectedDatabagIdChange: EventEmitter<string> =
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
