import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-icon',
  templateUrl: './avatar-icon.component.html',
  styleUrls: ['./avatar-icon.component.scss'],
  standalone: true,
})
export class AvatarIconComponent {
  @Input() public large = false;
  @Input() public firstName? = '';
  @Input() public lastName? = '';

  get acronym(): string {
    if (this.firstName && this.lastName) {
      return this.firstName.charAt(0) + this.lastName.charAt(0);
    }
    return 'UU';
  }
}
