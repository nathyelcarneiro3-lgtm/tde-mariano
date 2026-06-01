import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos';
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento';
import { HomeComponent } from './components/home/home';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario'; // Importação adicionada

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registo', component: CadastroUsuarioComponent }, // Nova rota!
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent }
];
