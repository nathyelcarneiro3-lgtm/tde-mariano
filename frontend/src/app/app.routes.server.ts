import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rotas com parâmetros dinâmicos não podem ser pre-renderizadas
  {
    path: 'cadastro-evento/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'editar-perfil',
    renderMode: RenderMode.Server
  },
  // Todas as outras usam Client-side rendering para evitar problemas com localStorage
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
