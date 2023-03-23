import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-element-divider',
  templateUrl: './element-divider.component.html',
  styleUrls: ['./element-divider.component.scss'],
  standalone: true,
  imports: [MatDividerModule],
})
export class ElementDividerComponent {}
