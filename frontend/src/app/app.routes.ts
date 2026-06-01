import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AdminEventosComponent } from './components/admin-eventos/admin-eventos';
import { CadastroEventoComponent } from './components/cadastro-evento/cadastro-evento';
import { HomeComponent } from './components/home/home'; // Importámos a Home

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Agora o site abre logo na Home!
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminEventosComponent },
  { path: 'cadastro-evento', component: CadastroEventoComponent }
]
