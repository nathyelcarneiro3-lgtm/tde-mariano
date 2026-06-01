import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necessário para o *ngIf funcionar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend');

  // Função que o HTML vai usar para saber se o botão Admin deve aparecer
  usuarioEstaLogado(): boolean {
    // Se existir um token no localStorage, retorna verdadeiro (true)
    // Caso contrário, retorna falso (false)
    return !!localStorage.getItem('token'); 
  }
}