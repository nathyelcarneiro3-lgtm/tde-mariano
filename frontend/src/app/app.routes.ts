import { Routes } from '@angular/router';

// Componentes existentes
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario';
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos';
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento';
import { ListaInscritosComponent } from './components/lista-inscritos/lista-inscritos';

// Req 2, 3, 5
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios';

// Req 9 - inscrição em evento
import { InscricaoEventoComponent } from './components/inscricao-evento/inscricao-evento';

// Req 14–22, 24 - minicursos
import { CadastroMinicursoComponent } from './components/cadastro-minicurso/cadastro-minicurso';
import { ListaMinicursosComponent } from './components/lista-minicursos/lista-minicursos';
import { ListaInscritosMinicursoComponent } from './components/lista-inscritos-minicurso/lista-inscritos-minicurso';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Públicas
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registo', component: CadastroUsuarioComponent },

  // Usuário
  { path: 'editar-perfil', component: EditarPerfilComponent },

  // Eventos (admin)
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent },
  { path: 'cadastro-evento/:id', component: CadastroEventoComponent },

  // Req 12 - inscritos por evento
  { path: 'lista-inscritos/:id', component: ListaInscritosComponent },

  // Req 3, 5 - usuários (admin)
  { path: 'lista-usuarios', component: ListaUsuariosComponent },

  // Req 9 - inscrição em evento
  { path: 'inscricao-evento/:id', component: InscricaoEventoComponent },

  // Req 14 - cadastrar/editar minicurso (admin)
  { path: 'cadastro-minicurso', component: CadastroMinicursoComponent },
  { path: 'cadastro-minicurso/:id', component: CadastroMinicursoComponent },

  // Req 24 - listar todos os minicursos
  { path: 'lista-minicursos', component: ListaMinicursosComponent },

  // Req 22 - listar inscritos de um minicurso
  { path: 'inscritos-minicurso/:id', component: ListaInscritosMinicursoComponent },

  { path: '**', redirectTo: '/home' }
];