import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewButtonComponent } from '../../molecules/new-button/new-button.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-solution-detail-download-model',
  templateUrl: './solution-detail-download-model.component.html',
  styleUrls: ['./solution-detail-download-model.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, NgIf, TranslateModule],
})
export class SolutionDetailDownloadModelComponent {
  @Output() public downloadModel = new EventEmitter<void>();
  @Input() public disabled = true;
}
