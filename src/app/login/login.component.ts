import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Servidor } from "../templates/servidor";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modelo: any = {};
  ver_password: boolean;
  miss_password: boolean;
  servidor = new Servidor();
  autentidado: boolean;
  tamano_pantalla: any;
  miss_correo: string;

  constructor(private router: Router, private http: HttpClient) {
    this.ver_password = false;
    this.miss_password = false;
  }

  ngOnInit() {
    this.autentidado = false;
    localStorage.removeItem('autenticado');
    localStorage.removeItem('usuario');
    localStorage.removeItem('tkn');
    this.tamano_pantalla = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tamano_pantalla = window.innerWidth;
  }

  verPassword() {
    if (this.ver_password)
      this.ver_password = false;
    else
      this.ver_password = true;
  }

  login() {
    if (this.modelo.correo && this.modelo.password) {
      this.http.post(this.servidor.ip + '/buzon_backend/login.php', JSON.stringify({
        usuario: this.modelo
      }), {
        }).subscribe(res => {
          if (!res['Error']) {
            localStorage.setItem('usuario', JSON.stringify(res['usuario']));
            localStorage.setItem('tkn', JSON.stringify(res['tkn']));
            localStorage.setItem('autenticado', 'true');
            this.autentidado = true;
            if (res['usuario']['rol'] == 'admin')
              this.router.navigate(['/panel']);
            else
              this.router.navigate(['/administracion_sugerencias']);
          }
          else {
            Swal.fire({
              type: 'error',
              title: 'ERROR',
              text: res['Error'],
              timer: 5000
            });
            this.autentidado = false;
          }
        });
    }
  }

  cambiaPassword() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/missPassword.php', JSON.stringify({
      correo: this.miss_correo, url: this.servidor.url
    }), {
      }).subscribe(res => {
        if (!res['Error']) {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
          this.cancelaCambiaPass();
        }
        else {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
      });
  }

  cancelaCambiaPass() {
    this.miss_password = false;
    this.miss_correo = '';
  }

}
