import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../templates/usuario";
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css']
})

export class AdminUsuarioComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  usuario = new Usuario();
  servidor = new Servidor();
  token: string;
  ver_cambia_pass: boolean;
  contrasenas: any = {};
  tamano_pantalla: any;

  ver_password: boolean;
  ver_password1: boolean;
  ver_password2: boolean;


  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.obtenUsuarioActual();
    this.obtenUsuario();
    this.ver_cambia_pass = false;
    this.tamano_pantalla = window.innerWidth;
    this.ver_password = false;
    this.ver_password1 = false;
    this.ver_password2 = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tamano_pantalla = window.innerWidth;
  }

  obtenUsuarioActual() {
    var user;
    this.autenticado = JSON.parse(localStorage.getItem('autenticado'));
    if (this.autenticado) {
      user = JSON.parse(localStorage.getItem('usuario'));
      /*if(user.rol != 'admin'){
        this.router.navigate(['/sugerencias']);
      }*/
      this.usuario_actual.rol = user.rol;
      this.usuario_actual.id_usuario = user.id_usuario;
      this.usuario_actual.nombre = user.nombre;
      this.usuario_actual.apellidos = user.apellidos;
      this.usuario_actual.correo = user.correo;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  obtenUsuario() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenUsuario.php', JSON.stringify({
      tkn: this.token, usuario: this.usuario_actual
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
        else if (res['ErrorToken']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Por favor, inicia sesión nuevamente',
            timer: 3000
          });
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else {
          res = res[0];
          if(res['rol']=='admin'){
            this.usuario.nombre = res['nombre'];
            this.usuario.apellidos = res['apellidos'];
            this.usuario.correo = res['correo'];
          }
          this.usuario.id_usuario = res['id_usuario'];
          this.usuario.rol = res['rol'];
        }
      });
  }

  myHandleError() {
    Swal.fire({
      type: 'error',
      title: 'ERROR',
      text: 'El formato no es correcto',
      timer: 5000
    });
  }

  edita(usuario, campo, longitud) {
    if (campo == 'correo') {
      var expresion = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    }
    else
      var expresion = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s.]+$/;
    Swal.mixin({
      input: 'text',
      inputAttributes: {
        maxlength: longitud,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'El campo ' + campo + ' es obligatorio'
        }
        var valida = expresion.test(value);
        if (!valida) {
          return 'El valor es inválido'
        }
      }
    }).queue([
      {
        title: 'Modificar ' + campo,
        text: 'Escribe un valor válido.',
        inputValue: usuario[campo]
      },
    ]).then((result) => {
      if (result.value) {
        usuario[campo] = result.value[0];
        this.saveEditable(usuario, campo);
      }
    })
  }

  saveEditable(usuario, campo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaUsuario.php', JSON.stringify({
      tkn: this.token, usuario: usuario, campo: campo
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
        else if (res['ErrorToken']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Por favor, inicia sesión nuevamente',
            timer: 3000
          });
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else {
          this.obtenUsuarioActual();
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
        }
      });
  }

  cancelaCambiaPass() {
    this.contrasenas = {};
    this.obtenUsuario();
    this.ver_cambia_pass = false;
  }

  cambiaPassword() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/cambiaPassword.php', JSON.stringify({
      tkn: this.token, contrasenas: this.contrasenas, usuario: this.usuario
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
        }
        else if (res['ErrorToken']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR DE SESIÓN',
            text: 'Por favor, inicia sesión nuevamente',
            timer: 3000
          });
          setTimeout(() => { this.router.navigate(['/login']); }, 3000);
        }
        else {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
          this.cancelaCambiaPass();
        }
      });
  }

  verPassword() {
    if (this.ver_password)
      this.ver_password = false;
    else
      this.ver_password = true;
  }

  verPassword1() {
    if (this.ver_password1)
      this.ver_password1 = false;
    else
      this.ver_password1 = true;
  }

  verPassword2() {
    if (this.ver_password2)
      this.ver_password2 = false;
    else
      this.ver_password2 = true;
  }

}
