import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
 selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  fileBase64: string | null = null;
  originalFileName: string | null = null;
  errorMessage: string | null = null;

     constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.originalFileName = file.name; 
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = (e.target as FileReader).result as string;
        this.fileBase64 = base64String.split(',')[1]; 
        this.errorMessage = null;
      };

      reader.readAsDataURL(file); 
    } else {
      this.fileBase64 = null;
      this.originalFileName = null;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.emailControl.valid || !this.fileBase64) {
      this.errorMessage = 'Por favor, insira um e-mail válido e selecione um arquivo.';
      return;
    }

    const requestData = {
      user_email: this.emailControl.value,
      file_data: this.fileBase64,
      file_name: this.originalFileName,
    };

    this.http
      .post(
        'https://bgxsrfg2k72v53bpmr3wzsqk7e0xzide.lambda-url.us-east-1.on.aws/',
        requestData,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
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
