import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-element-divider',
  templateUrl: './element-divider.component.html',
  styleUrls: ['./element-divider.component.scss'],
  standalone: true,
  imports: [MaterialModule],
})
export class ElementDividerComponent {}
