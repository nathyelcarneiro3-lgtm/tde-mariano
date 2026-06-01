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
    cpf: '',
    senha: ''
  };


  fazerLogin() {
    console.log('Tentativa de login:', this.loginData);
    alert('Tentativa de login para o CPF: ' + this.loginData.cpf);
    // Em breve vamos conectar isso ao backend!
  }
}