import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly duration = 2000;

  constructor(private matSnackBar: MatSnackBar) {}

  reportError(msg: string, res: string = ''): void {
    this.matSnackBar.open(msg, res, { duration: this.duration });
  }
}
