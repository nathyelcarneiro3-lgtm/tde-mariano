import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend');

  // Injetamos a ferramenta que descobre onde o código está a rodar
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  usuarioEstaLogado(): boolean {
    // Só tenta procurar o token se estiver efetivamente no ecrã do utilizador (browser)
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  // ... dentro da classe App
  
  getNomeUsuario(): string {
    // Busca o nome guardado no login. 
    // Ajuste a chave 'usuarioNome' se a sua for diferente.
    return localStorage.getItem('usuarioNome') || 'Perfil';
  }

  deslogar() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNome'); // Remove também o nome
    window.location.reload(); // Recarrega para atualizar o menu
  }
}