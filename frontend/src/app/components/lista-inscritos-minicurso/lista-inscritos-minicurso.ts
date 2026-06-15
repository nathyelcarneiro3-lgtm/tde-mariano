import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-inscritos-minicurso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-inscritos-minicurso.html',
  styleUrls: ['./lista-inscritos-minicurso.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaInscritosMinicursoComponent implements OnInit {
  inscritos: any[] = [];
  carregando = true;
  removendo: number | null = null;
  erroMsg = '';
  sucessoMsg = '';
  minicursoId: number = 0;
  nomeMinicurso: string = '';
  isAdmin = false;
  termoBusca = '';

  constructor(
    private minicursoService: MinicursoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    this.isAdmin      = this.usuarioService.isAdmin();
    this.minicursoId  = Number(this.route.snapshot.paramMap.get('id'));
    const state       = window.history.state;
    this.nomeMinicurso = state?.nomeMinicurso || '';
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.cdr.markForCheck();
    this.minicursoService.listarInscritos(this.minicursoId).subscribe({
      next: (dados: any) => {
        this.inscritos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar inscritos.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  get inscritosFiltrados(): any[] {
    if (!this.termoBusca.trim()) return this.inscritos;
    const t = this.termoBusca.toLowerCase();
    return this.inscritos.filter(i =>
      (i.nome  || '').toLowerCase().includes(t) ||
      (i.cpf   || '').includes(t) ||
      (i.email || '').toLowerCase().includes(t)
    );
  }

  removerInscricao(idParticipante: number, nome: string): void {
    if (!confirm(`Remover a inscrição de "${nome}" deste minicurso?`)) return;
    this.removendo = idParticipante;
    this.erroMsg = '';
    this.sucessoMsg = '';
    this.cdr.markForCheck();
    this.minicursoService.removerInscricao(this.minicursoId, idParticipante).subscribe({
      next: (resp: any) => {
        this.removendo = null;
        this.sucessoMsg = resp?.msg || 'Inscrição removida com sucesso.';
        this.cdr.markForCheck();
        this.carregar();
      },
      error: (err: any) => {
        this.removendo = null;
        this.erroMsg = err?.error?.msg || 'Erro ao remover inscrição.';
        this.cdr.markForCheck();
      }
    });
  }
}
