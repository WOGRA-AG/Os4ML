import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly duration = 2000;

  constructor(private matSnackBar: MatSnackBar) {}
  reportError(msg: string, res = ''): void {
    this.matSnackBar.open(msg, res, { duration: this.duration });
  }
}
