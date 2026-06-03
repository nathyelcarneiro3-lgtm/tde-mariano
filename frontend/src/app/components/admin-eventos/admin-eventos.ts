import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EventoService } from '../../services/evento';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-eventos.html',
  styleUrls: ['./admin-eventos.css']
})
export class AdminEventosComponent implements OnInit {
  eventos: any[] = [];
  carregando = false;
  erroMsg = '';

  constructor(
    private eventoService: EventoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.carregando = true;
    this.erroMsg = '';

    this.eventoService.obterTodos().subscribe({
      next: (dados: any) => {
        // Backend retorna array direto: [{id, nome, dt_inicio, dt_fim, ...}, ...]
        const lista = Array.isArray(dados) ? dados : (dados?.eventos ?? dados?.data ?? []);
        this.eventos = lista.map((e: any) => ({
          ...e,
          // Formata datas para exibição (o banco retorna strings como "2026-05-01")
          dt_inicio_fmt: this.formatarData(e.dt_inicio),
          dt_fim_fmt:    this.formatarData(e.dt_fim)
        }));
        this.carregando = false;
      },
      error: (erro: any) => {
        this.carregando = false;
        if (erro.status === 401 || erro.status === 403) {
          this.erroMsg = 'Sessão expirada. Faça login novamente.';
        } else if (erro.status === 0) {
          this.erroMsg = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else {
          this.erroMsg = erro?.error?.msg || 'Erro ao carregar eventos.';
        }
        console.error('Erro ao carregar eventos:', erro);
      }
    });
  }

  private formatarData(valor: string): string {
  if (!valor) return '—';

  // Remove qualquer espaço extra nas pontas da string
  let str = valor.trim();

  // Caso 1: Trata o bug da data com hora injetada no meio (ex: "20 00:00:00/06/2026")
  if (str.includes('/') && str.includes(':')) {
    // Transforma "20 00:00:00/06/2026" em ["20", "00:00:00/06/2026"] -> pega o "20" como dia
    const parteDia = str.split(' ')[0]; 
    // Isola o restante após a hora (ex: "/06/2026")
    const restante = str.split('/')[1] + '/' + str.split('/')[2]; 
    return `${parteDia}/${restante}`; // Retorna "20/06/2026"
  }

  // Caso 2: Se vier no formato internacional limpo (ex: "2026-06-20 00:00:00" ou com "T")
  const apenasData = str.split('T')[0].split(' ')[0];
  
  if (apenasData.includes('-')) {
    const [ano, mes, dia] = apenasData.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Caso 3: Se a API já mandar a data perfeitamente formatada em PT-BR (ex: "20/06/2026")
  if (apenasData.includes('/')) {
    return apenasData;
  }

  return valor; // Retorno de segurança caso não entre em nenhuma regra
}


  excluirEvento(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    this.eventoService.excluir(id).subscribe({
      next: () => {
        alert('Evento excluído com sucesso!');
        this.carregarEventos();
      },
      error: (erro: any) => {
        const msg = erro?.error?.msg || 'Erro ao excluir o evento.';
        alert(msg);
        console.error('Erro ao excluir:', erro);
      }
    });
  }

  editarEvento(id: number): void {
    this.router.navigate(['/cadastro-evento', id]);
  }
}
