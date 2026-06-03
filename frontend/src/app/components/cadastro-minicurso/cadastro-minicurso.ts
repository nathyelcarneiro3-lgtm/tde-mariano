import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MinicursoService } from '../../services/minicurso';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-cadastro-minicurso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-minicurso.html',
  styleUrls: ['./cadastro-minicurso.css']
})
export class CadastroMinicursoComponent implements OnInit {
  minicurso: any = {
    id_evento: null,
    nome: '',
    descricao: '',
    dt_minicurso: '',
    horario_inicio_minicurso: '',
    horario_fim_minicurso: '',
    nome_instrutor: '',
    minicurriculo_instrutor: '',
    dt_limite_inscricao: '',
    numero_vagas: null
  };

  eventos: any[] = [];
  isEdit = false;
  minicursoId: number | null = null;
  carregando = false;
  erroMsg = '';

  constructor(
    private minicursoService: MinicursoService,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    if (localStorage.getItem('usuarioAdmin') !== '1') { this.router.navigate(['/home']); return; }

    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => { this.eventos = Array.isArray(dados) ? dados : []; },
      error: () => { this.eventos = []; }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.minicursoId = Number(id);
      this.carregarMinicurso();
    }
  }

  carregarMinicurso(): void {
    this.carregando = true;
    this.minicursoService.obterPorId(this.minicursoId!).subscribe({
      next: (res: any) => {
        this.minicurso = {
          id_evento:                res.id_evento,
          nome:                     res.nome || '',
          descricao:                res.descricao || '',
          dt_minicurso:             (res.dt_minicurso || '').split('T')[0].split(' ')[0],
          horario_inicio_minicurso: res.horario_inicio_minicurso || '',
          horario_fim_minicurso:    res.horario_fim_minicurso || '',
          nome_instrutor:           res.nome_instrutor || '',
          minicurriculo_instrutor:  res.minicurriculo_instrutor || '',
          dt_limite_inscricao:      (res.dt_limite_inscricao || '').split('T')[0].split(' ')[0],
          numero_vagas:             res.vagas_disponiveis ?? res.numero_vagas ?? null
        };
        this.carregando = false;
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao carregar minicurso.';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.erroMsg = '';
    this.carregando = true;

    const acao = this.isEdit
      ? this.minicursoService.atualizar(this.minicursoId!, this.minicurso)
      : this.minicursoService.cadastrar(this.minicurso);

    acao.subscribe({
      next: () => {
        alert(this.isEdit ? 'Minicurso atualizado com sucesso!' : 'Minicurso cadastrado com sucesso!');
        this.router.navigate(['/lista-minicursos']);
      },
      error: (err: any) => {
        this.erroMsg = err?.error?.msg || 'Erro ao salvar minicurso.';
        this.carregando = false;
      }
    });
  }
}