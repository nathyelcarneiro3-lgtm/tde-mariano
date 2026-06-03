import { Routes } from '@angular/router';

// Componentes existentes
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario';
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos';
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento';
import { ListaInscritosComponent } from './components/lista-inscritos/lista-inscritos';

// Novos componentes (Req 2 e 3)
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios';

export const routes: Routes = [
  // Rota inicial
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Rotas públicas
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registo', component: CadastroUsuarioComponent },

  // Rotas de usuário (Req 2 - editar perfil, aceita ?cpf=xxx para admin editar outro)
  { path: 'editar-perfil', component: EditarPerfilComponent },

  // Rotas de administração
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent },
  { path: 'cadastro-evento/:id', component: CadastroEventoComponent }, // Adicione esta linha
  { path: 'lista-inscritos', component: ListaInscritosComponent },

  // Req 3 e 5 - gerenciar usuários (somente admin)
  { path: 'lista-usuarios', component: ListaUsuariosComponent },

  // Fallback
  { path: '**', redirectTo: '/home' }
];