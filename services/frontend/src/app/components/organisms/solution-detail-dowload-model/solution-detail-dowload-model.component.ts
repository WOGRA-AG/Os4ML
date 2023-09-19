import { Component } from '@angular/core';
import {NewButtonComponent} from "../../molecules/new-button/new-button.component";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-solution-detail-dowload-model',
  templateUrl: './solution-detail-dowload-model.component.html',
  styleUrls: ['./solution-detail-dowload-model.component.scss'],
  standalone: true,
  imports: [
    NewButtonComponent,
    NgIf,
    TranslateModule
  ]
})
export class SolutionDetailDowloadModelComponent {}
