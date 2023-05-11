import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggleTheme(theme: string): void {
    const previousTheme = theme === 'dark' ? 'light' : 'dark';
    this.renderer.removeClass(document.body, previousTheme);
    this.renderer.addClass(document.body, theme);
    localStorage.setItem('theme', theme);
  }

  loadTheme(): void {
    const theme = localStorage.getItem('theme') || 'light';
    this.toggleTheme(theme);
  }
}
