import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-new-button',
  templateUrl: './new-button.component.html',
  styleUrls: ['./new-button.component.scss'],
  standalone: true,
  imports: [NgIf, MatButtonModule, MatRippleModule, NgClass],
})
export class NewButtonComponent {
  @Input() public type: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() public text = 'Button';
  @Input() public disabled = false;
}
