import { Component } from '@angular/core';
import { ElementDividerComponent } from '../../atoms/element-divider/element-divider.component';

@Component({
  selector: 'app-dialog-section',
  templateUrl: './dialog-section.component.html',
  styleUrls: ['./dialog-section.component.scss'],
  standalone: true,
  imports: [ElementDividerComponent],
})
export class DialogSectionComponent {}
