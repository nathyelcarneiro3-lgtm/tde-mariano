import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Adicionado o RouterLink aqui

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink], // Adicionado o RouterLink aqui também
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend');
}
