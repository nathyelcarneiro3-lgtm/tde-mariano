import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-inscricao-evento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inscricao-evento.html',
  styleUrls: ['./inscricao-evento.css']
})
export class InscricaoEventoComponent implements OnInit {
  evento: any = null;
  carregando = false;
  inscrevendo = false;
  erroMsg = '';
  sucessoMsg = '';
  jaInscrito = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erroMsg = 'Evento não encontrado.';
      return;
    }

    if (!this.estaLogado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregarEvento(id);
  }

  estaLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getIdUsuario(): number {
    if (isPlatformBrowser(this.platformId)) {
      return Number(localStorage.getItem('usuarioId') || '0');
    }
    return 0;
  }

  getNomeUsuario(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioNome') || 'Usuário';
    }
    return 'Usuário';
  }

  carregarEvento(id: number): void {
    this.carregando = true;
    this.eventoService.obterPorId(id).subscribe({
      next: (dados: any) => {
        this.evento = dados;
        this.carregando = false;
        this.verificarSeJaInscrito(id);
      },
      error: (err: any) => {
        this.carregando = false;
        this.erroMsg = err?.error?.msg || 'Erro ao carregar dados do evento.';
      }
    });
  }

  verificarSeJaInscrito(idEvento: number): void {
    const idUsuario = this.getIdUsuario();
    this.eventoService.obterInscritosPorEvento(idEvento).subscribe({
      next: (lista: any) => {
        const inscritos = Array.isArray(lista) ? lista : (lista?.inscritos ?? lista?.data ?? []);
        this.jaInscrito = inscritos.some(
          (i: any) => Number(i.id_usuario) === idUsuario
        );
      },
      error: () => { this.jaInscrito = false; }
    });
  }

  inscrever(): void {
    if (!this.evento) return;
    const idUsuario = this.getIdUsuario();
    if (!idUsuario) {
      this.erroMsg = 'Não foi possível identificar o usuário. Faça login novamente.';
      return;
    }

    this.inscrevendo = true;
    this.erroMsg = '';
    this.sucessoMsg = '';

    this.eventoService.inscrever(this.evento.id, idUsuario).subscribe({
      next: (resp: any) => {
        this.inscrevendo = false;
        this.sucessoMsg = resp?.msg || 'Inscrição realizada com sucesso! 🎉';
        this.jaInscrito = true;
      },
      error: (err: any) => {
        this.inscrevendo = false;
        this.erroMsg = err?.error?.msg || 'Erro ao realizar inscrição. Tente novamente.';
      }
    });
  }

  formatarData(valor: string): string {
    if (!valor) return '—';
    const apenasData = valor.split('T')[0].split(' ')[0];
    if (apenasData.includes('-')) {
      const [ano, mes, dia] = apenasData.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return valor;
  }
}