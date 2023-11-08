import { Component, Input } from '@angular/core';
import { NewButtonComponent } from '../new-button/new-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  standalone: true,
  imports: [NewButtonComponent, TranslateModule],
})
export class HamburgerButtonComponent {
  @Input() public isActive = false;
}
