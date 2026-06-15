import { Component, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  // Default é usado aqui pois o app-root lê do localStorage em métodos chamados
  // diretamente pelo template — OnPush causaria desync na navbar após login/logout.
  // A solução correta é disparar cdr.markForCheck() em cada navegação.
  changeDetection: ChangeDetectionStrategy.Default
})
export class App {
  isDropdownOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // Sempre que o router terminar de navegar, força a re-verificação da navbar.
    // Isto resolve o bug em que o Angular não detecta mudanças no localStorage
    // (ex: após login, a navbar continuava a mostrar "Fazer Login").
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isDropdownOpen = false;
        this.cdr.detectChanges();
      });
  }

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
      // Navega para /home e força detecção de mudanças (sem reload de página)
      this.router.navigate(['/home']).then(() => this.cdr.detectChanges());
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.markForCheck();
  }
}
