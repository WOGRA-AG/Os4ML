import { ThemePalette } from '@angular/material/core';

export type ColorPalette = ThemePalette | 'tertiary' | 'info' | 'success';
export type ButtonType = 'submit' | 'button' | 'reset';
export type ButtonVariant =
  | 'basic'
  | 'raised'
  | 'flat'
  | 'icon'
  | 'stroked'
  | 'fab'
  | 'mini-fab';
export type ButtonSize = 'small' | 'medium' | 'large';
