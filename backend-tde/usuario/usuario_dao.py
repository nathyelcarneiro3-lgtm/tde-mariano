from persistencia.base_dao import BaseDAO


class UsuarioDAO(BaseDAO):

    def obterTodos(self):
        return self.obterRegistros("select id, cpf, nome, email, usuario_admin from usuarios")
    
    def obterPorId(self, id):
        parametros = [id]
        return self.obterRegistroPorParametro("select id, cpf, nome, email, hash_senha, usuario_admin from usuarios where id = ?", parametros)

    def obterPorCPF(self, cpf):
        parametros = [cpf]
        return self.obterRegistroPorParametro("select id, cpf, nome, email, hash_senha, usuario_admin from usuarios where cpf = ?", parametros)
    
    def salvar(self, cpf, nome, email, senha):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            # O seu SQL espera: cpf, email, nome, usuario_admin, hash_senha
            # O BC envia: cpf, nome, email, senha
            
            usuario_admin = 0 # Valor padrão para novo usuário
            
            cursor.execute('''
                INSERT INTO usuarios (cpf, email, nome, usuario_admin, hash_senha)
                VALUES (?, ?, ?, ?, ?)
            ''', (cpf, email, nome, usuario_admin, senha))
            
            conn.commit()
            return cursor.rowcount # Retorna 1 se salvou com sucesso
        except Exception as e:
            print(f"Erro no SQL: {e}")
            return 0
        finally:
            conn.close()
    
    def atualizar(self, id, nome, email, senha):
        parametros = [nome, email, senha, id]
        return self.executarComandoDML("update usuarios set nome = ?, email = ?, hash_senha = ? where id = ?", parametros)
    
    def remover(self, id):
        parametros = [id]
        return self.executarComandoDML("delete from usuarios where id = ?", parametros)
    
    def atualizarTipoUsuario(self, id):
        parametros = [True, id]
        return self.executarComandoDML("update usuarios set usuario_admin = ? where id = ?", parametros)