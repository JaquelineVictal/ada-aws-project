import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
 selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  email: string = '';
  isEmailValid: boolean = false;
  fileBase64: string | null = null;
  originalFileName: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar e-mails
    this.isEmailValid = emailRegex.test(this.email); // Valida e-mail
  }

  onFileChange(event: any) {
  const file = event.target.files[0]; 
  if (file) {
    const timestamp = Date.now(); 
    const fileExtension = file.name.split('.').pop(); 
    const baseName = file.name.split('.').slice(0, -1).join('.'); 
    
    // Cria um novo nome para o arquivo com o timestamp
    this.originalFileName = `${baseName}_${timestamp}.${fileExtension}`;

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = (e.target as FileReader).result as string;
      this.fileBase64 = base64String.split(',')[1]; 
      this.errorMessage = null;
    };

    reader.readAsDataURL(file); // Converte o arquivo para Base64
  } else {
    this.fileBase64 = null;
    this.originalFileName = null;
  }
}

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.isEmailValid|| !this.fileBase64) {
      this.errorMessage = 'Por favor, insira um e-mail válido e selecione um arquivo.';
      return;
    }

    const requestData = {
      user_email: this.email,
      file_data: this.fileBase64,
      file_name: this.originalFileName,
    };
    console.log(requestData)

    this.http
      .post(
        'https://bgxsrfg2k72v53bpmr3wzsqk7e0xzide.lambda-url.us-east-1.on.aws/',
        JSON.stringify(requestData),
        {
          headers:{
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe(
        (response) => {
          console.log('Resposta do Lambda:', response);
        },
        (error) => {
          console.error('Erro ao chamar Lambda:', error);
        }
      );
  }
}
