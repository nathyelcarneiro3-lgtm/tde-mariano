import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importe o withFetch aqui
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Adicione o withFetch() aqui dentro
    provideHttpClient(withFetch()) 
  ]
};