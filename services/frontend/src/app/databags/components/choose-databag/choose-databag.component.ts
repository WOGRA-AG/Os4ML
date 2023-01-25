import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Databag } from '../../../../../build/openapi/modelmanager';
import { DialogDynamicComponent } from '../../../shared/components/dialog/dialog-dynamic/dialog-dynamic.component';
import { DatabagService } from '../../services/databag.service';
import { CreateDatabagStepperComponent } from '../create-databag-stepper/create-databag-stepper.component';

@Component({
  selector: 'app-choose-databag',
  templateUrl: './choose-databag.component.html',
  styleUrls: ['./choose-databag.component.scss']
})
export class ChooseDatabagComponent implements OnInit, OnChanges {

  @Input() databags: Databag[] = [];
  @Output() selectedDatabagChange: EventEmitter<Databag> = new EventEmitter<Databag>();
  selectedDatabag: Databag = {};

  constructor(private dialog: MatDialog, public databagService: DatabagService) {
  }

  ngOnInit(): void {
    if (this.databags.length > 0) {
      this.changeSelectedDatabag(this.databags[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const databagChanges = changes['databags'];
    if (databagChanges.isFirstChange()) {
      return;
    }
    const newSelectedDatabag = databagChanges.currentValue.filter(
      (databag: Databag) => databag.databagId === this.selectedDatabag.databagId)[0];
    if (!this.databagService.isSameDatabag(newSelectedDatabag, this.selectedDatabag)) {
      this.changeSelectedDatabag(newSelectedDatabag);
    }
  }

  changeSelectedDatabag(databag: Databag) {
    this.selectedDatabag = databag;
    this.selectedDatabagChange.emit(this.selectedDatabag);
  }

  openAddDialog() {
    this.dialog.open(DialogDynamicComponent, {
      data: { component: CreateDatabagStepperComponent }
    });
  }
}
