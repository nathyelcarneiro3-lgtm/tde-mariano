import { Routes } from '@angular/router';

// 1. Importações de todos os Componentes
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario';
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos';
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento';
import { ListaInscritosComponent } from './components/lista-inscritos/lista-inscritos';

// 2. Definição das Rotas (Navegação)
export const routes: Routes = [
  // Rota inicial padrão (redireciona para a Home)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Rotas principais
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registo', component: CadastroUsuarioComponent }, 
  
  // Rotas da Área de Administração
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent },
  { path: 'lista-inscritos', component: ListaInscritosComponent },
  
  // Rota de fallback (Se o utilizador digitar um endereço que não existe, volta para a Home)
  { path: '**', redirectTo: '/home' }
];