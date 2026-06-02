import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // 1. Adicionado aqui!

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // 2. Adicionado aqui!
  templateUrl: './login.html'
})
export class LoginComponent {
  
  loginData = {
    email: '', // Trocamos cpf por email
    senha: ''
  };

  
  fazerLogin() {
    console.log('Tentativa de login com:', this.loginData);
    
    // Agora, se o seu backend esperar o campo 'cpf' mas você quer passar o email,
    // você tem duas opções:
    // 1. Enviar como 'cpf' mesmo (se o backend usar o campo CPF para guardar o email)
    // 2. Enviar como 'email' (se o backend estiver configurado para isso)
    
    // Mantenha assim se o backend espera 'cpf':
    const payload = {
       cpf: this.loginData.email, // O backend recebe como 'cpf'
       senha: this.loginData.senha
    };

    // ... código de chamada ao serviço ...
  }
}