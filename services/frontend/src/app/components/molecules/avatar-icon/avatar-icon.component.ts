import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-icon',
  templateUrl: './avatar-icon.component.html',
  styleUrls: ['./avatar-icon.component.scss'],
  standalone: true,
})
export class AvatarIconComponent {
  @Input() public acronym = 'AU';
  @Input() public large = false;
}
