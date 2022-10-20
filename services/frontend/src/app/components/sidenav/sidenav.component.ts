import { Component } from '@angular/core';
import {UserFacade} from '../../user/services/user-facade.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(public userFacade: UserFacade) {
  }
}
