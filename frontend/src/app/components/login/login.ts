import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Essencial para o ngModel funcionar!

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicionado o FormsModule aqui
  templateUrl: './login.html'
})
export class LoginComponent { // O nome deve ser LoginComponent para o app.routes funcionar
  
  // Variável que o HTML está procurando para salvar o texto do input
  loginData = {
    cpf: '',
    senha: ''
  };

  // Função que o botão de "submit" do HTML vai chamar
  fazerLogin() {
    console.log('Tentativa de login:', this.loginData);
    alert('Tentativa de login para o CPF: ' + this.loginData.cpf);
    // Em breve vamos conectar isso ao backend!
  }
}