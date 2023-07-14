import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from "../../../../design/components/atoms/button/button.component";
import { TranslateModule } from '@ngx-translate/core';
import { ButtonTypes, NewButtonComponent } from "../../molecules/new-button/new-button.component";
import { NgClass } from '@angular/common';
import { DatabagCreateButtonComponent } from "../databag-create-button/databag-create-button.component";

@Component({
    selector: 'app-placeholder',
    templateUrl: './placeholder.component.html',
    styleUrls: ['./placeholder.component.scss'],
    standalone: true,
    imports: [ButtonComponent, TranslateModule, NewButtonComponent, NgClass, DatabagCreateButtonComponent]
})
export class PlaceholderComponent {
  @Input() public type: 'fallback' | 'noDataOnDatabags' | 'noDataOnSolutions' | 'noSolutionOnSolutions' | 'selectedDataHasNoSolutionsOnSolutions' | 'noDataNoSolutionOnPredictions' | 'selectedDataHasNoSolutionOnPrediction' | 'noPredictionsOnPredictions' | 'selectedSolutionHasNoPrediction' = 'fallback';
  public buttonTypes = ButtonTypes;

  @Output() public addDatabag = new EventEmitter<void>();

  onAddDatabag(){
    this.addDatabag.emit();
  }

}
