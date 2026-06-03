import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PalestraService } from '../../services/palestra';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-lista-palestras',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-palestras.html'
})
export class ListaPalestrasComponent implements OnInit {
  palestras: any[] = [];
  carregando = true;
  erroMsg = '';
  isAdmin = false;

  constructor(
    private palestraService: PalestraService,
    private usuarioService: UsuarioService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isAdmin = this.usuarioService.isAdmin();
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erroMsg = '';
    this.palestraService.listarTodos().subscribe({
      next: (dados: any) => {
        const lista = Array.isArray(dados) ? dados : (dados?.palestras ?? []);
        this.palestras = lista.map((p: any) => ({
          ...p,
          dt_fmt: this.fmtData(p.dt_palestra)
        }));
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar palestras.';
        this.carregando = false;
      }
    });
  }

  private fmtData(v: string): string {
    if (!v) return '—';
    const s = v.split('T')[0];
    const [a, m, d] = s.split('-');
    return `${d}/${m}/${a}`;
  }

  editar(id: number): void {
    this.router.navigate(['/cadastro-palestra', id]);
  }

  remover(id: number, nome: string): void {
    if (!confirm(`Remover a palestra "${nome}"?`)) return;
    this.palestraService.remover(id).subscribe({
      next: () => { alert('Palestra removida com sucesso!'); this.carregar(); },
      error: (err: any) => alert(err?.error?.msg || 'Erro ao remover palestra.')
    });
  }
}
