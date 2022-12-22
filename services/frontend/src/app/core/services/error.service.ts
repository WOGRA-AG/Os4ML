import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  duration = 2000;

  constructor(private matSnackBar: MatSnackBar) { }

  reportError(msg: string) {
    this.matSnackBar.open(msg, '', {duration: this.duration });
  }
}
