import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';

@Component({
  selector: 'app-lista-inscritos-minicurso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-inscritos-minicurso.html'
})
export class ListaInscritosMinicursoComponent implements OnInit {
  inscritos: any[] = [];
  carregando = true;
  erroMsg = '';
  minicursoId: number = 0;

  constructor(
    private minicursoService: MinicursoService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.minicursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.minicursoService.listarInscritos(this.minicursoId).subscribe({
      next: (dados: any) => {
        this.inscritos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar inscritos.';
        this.carregando = false;
      }
    });
  }
}
