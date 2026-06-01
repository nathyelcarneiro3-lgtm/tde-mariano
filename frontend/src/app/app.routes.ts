import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; // Removido .ts
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos'; // Removido .ts
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento'; // Removido .ts

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent }
]