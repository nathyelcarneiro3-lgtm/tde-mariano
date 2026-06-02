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
  // Variável para controlar se o menu está aberto ou fechado
  isDropdownOpen = false;

   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  usuarioEstaLogado(): boolean {
     if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
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
      this.isDropdownOpen = false; // Fecha o menu ao sair
      window.location.reload();
    }
  }

  // Função que inverte o estado do menu ao clicar
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}