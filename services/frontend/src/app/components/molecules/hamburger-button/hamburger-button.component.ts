import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  standalone: true,
})
export class HamburgerButtonComponent {
  @Input() public isActive = false;
}
