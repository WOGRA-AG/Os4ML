import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly duration = 5000;

  constructor(private matSnackBar: MatSnackBar) {}
  reportError(msg: string): void {
    this.matSnackBar.open(msg, undefined, {
      duration: this.duration,
    });
  }
}
