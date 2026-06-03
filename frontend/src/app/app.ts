import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html'
})
export class App {
  isDropdownOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  usuarioEstaLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  usuarioEAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioAdmin') === '1';
    }
    return false;
  }

  getNomeUsuario(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioNome') || 'Usuário';
    }
    return 'Usuário';
  }

  deslogar() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioNome');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('usuarioCpf');
      localStorage.removeItem('usuarioAdmin');
      this.isDropdownOpen = false;
      window.location.reload();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}