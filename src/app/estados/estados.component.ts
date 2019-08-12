import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../templates/usuario";
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.css']
})
export class EstadosComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  servidor = new Servidor();
  token: string;
  nuevo_estado: any = {};
  estados: any = [];
  ver_nuevo: boolean;
  tamano_pantalla: any;
  filtro: string;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.obtenUsuarioActual();
    this.obtenEstados();
    this.ver_nuevo = false;
    this.tamano_pantalla = window.innerWidth;
    this.filtro = "";
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
      if(user.rol != 'admin'){
        this.router.navigate(['/sugerencias']);
      }
      this.usuario_actual.rol = user.rol;
      this.usuario_actual.id_usuario = user.id_usuario;
      this.usuario_actual.nombre = user.nombre;
      this.usuario_actual.apellidos = user.apellidos;
      this.usuario_actual.correo = user.correo;
      this.token = JSON.parse(localStorage.getItem('tkn'));
    }
  }

  obtenEstados() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenEstados.php', JSON.stringify({
      tkn: this.token
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
          if (res == "Sin registros") {
            this.estados = null;
          }
          else {
            this.estados = res;
          }
        }
      });
  }

  cancelaAlta() {
    this.nuevo_estado = {};
    this.obtenEstados();
    this.ver_nuevo = false;
  }

  altaEstado() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/altaEstado.php', JSON.stringify({
      tkn: this.token, estado: this.nuevo_estado
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
          this.cancelaAlta();
          this.obtenEstados();
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

  edita(estado, campo, longitud) {
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
          return 'El campo '+campo+' es obligatorio'
        }
        var valida = expresion.test(value);
        if(campo == 'descripcion')
          valida = true;
        if (!valida) {
          return 'El valor es inválido'
        }
      }
      }).queue([
        {
          title: 'Modificar '+campo,
          text: 'Escribe un valor válido.',
          inputValue: estado[campo]
        },
      ]).then((result) => {
        if (result.value) {
          estado[campo] = result.value[0];
          this.saveEditable(estado, campo);
        }
      })
  }

  editar(estado, campo, longitud) {
    var expresion = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s.]+$/;
    Swal.mixin({
      input: 'textarea',
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
          return 'El campo '+campo+' es obligatorio'
        }
        var valida = expresion.test(value);
        if(campo == 'descripcion')
          valida = true;
        if (!valida) {
          return 'El valor es inválido'
        }
      }
      }).queue([
        {
          title: 'Modificar '+campo,
          text: 'Escribe un valor válido.',
          inputValue: estado[campo]
        },
      ]).then((result) => {
        if (result.value) {
          estado[campo] = result.value[0];
          this.saveEditable(estado, campo);
        }
      })
  }

  saveEditable(estado, campo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaEstado.php', JSON.stringify({
      tkn: this.token, estado: estado, campo: campo
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
          this.obtenEstados();
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
        }
      });
  }

  cambiaEstado(estado, evento) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/cambiaEstadoEstado.php', JSON.stringify({
      tkn: this.token, estado: estado
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
          this.obtenEstados();
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
        }
      });
  }

}
