/**
 * Gera hash SHA-256 de uma string usando a Web Crypto API nativa do browser.
 * Não requer nenhuma dependência externa (sem crypto-js).
 *
 * Uso:
 *   import { gerarHash } from '../../utils/hash';
 *   const hash = await gerarHash(senha);
 */
export async function gerarHash(senha: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
