import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeStorageKey = 'theme';
  private _theme$ = new BehaviorSubject<Theme>('light');
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.setTheme(this.loadTheme());
  }

  get theme$(): Observable<Theme> {
    return this._theme$.asObservable();
  }

  get currentTheme(): Theme {
    return this._theme$.value;
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.renderer.removeClass(
      document.body,
      this.getThemeClass(this.currentTheme)
    );
    this.renderer.addClass(document.body, this.getThemeClass(theme));
    this._theme$.next(theme);
    this.saveTheme(theme);
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.themeStorageKey, theme);
  }

  private loadTheme(): Theme {
    const theme = localStorage.getItem(this.themeStorageKey);
    if (theme !== 'dark' && theme !== 'light') {
      return this.getInitialTheme();
    }
    return theme;
  }

  private getThemeClass(theme: Theme): string {
    return `color-scheme-${theme}`;
  }

  private getInitialTheme(): Theme {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDark.matches ? 'dark' : 'light';
  }
}
