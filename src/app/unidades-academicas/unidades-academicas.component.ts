import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../templates/usuario";
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidades-academicas',
  templateUrl: './unidades-academicas.component.html',
  styleUrls: ['./unidades-academicas.component.css']
})
export class UnidadesAcademicasComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  servidor = new Servidor();
  token: string;
  nueva_unidad_academica: any = {};
  unidades_academicas: any = [];
  niveles_educativos: any = [];
  niveles_educativos2: any = [];
  ver_nuevo: boolean;
  tamano_pantalla: any;
  filtro: string;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.obtenUsuarioActual();
    this.obtenUnidades();
    this.obtenNivelesEducativos();
    this.obtenNivelesEducativos2();
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

  obtenUnidades() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenUnidades.php', JSON.stringify({
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
            this.unidades_academicas = null;
          }
          else {
            this.unidades_academicas = res;
          }
        }
      });
  }

  obtenNivelesEducativos2() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenNivelesEducativosSelect2.php', JSON.stringify({
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
            this.niveles_educativos2 = null;
          }
          else {
            this.niveles_educativos2 = res;
          }
        }
      });
  }

  obtenNivelesEducativos() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenNivelesEducativosSelect.php', JSON.stringify({
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
            this.niveles_educativos = null;
          }
          else {
            this.niveles_educativos = res;
          }
        }
      });
  }

  cancelaAlta() {
    this.nueva_unidad_academica = {};
    this.obtenUnidades();
    this.obtenNivelesEducativos();
    this.ver_nuevo = false;
  }

  altaUnidad() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/altaUnidad.php', JSON.stringify({
      tkn: this.token, unidad_academica: this.nueva_unidad_academica
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
          this.obtenUnidades();
          this.obtenNivelesEducativos();
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

  edita(unidad_academica, campo, longitud) {
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
      }
      }).queue([
        {
          title: 'Modificar '+campo,
          text: 'Escribe un valor válido.',
          inputValue: unidad_academica[campo]
        },
      ]).then((result) => {
        if (result.value) {
          unidad_academica[campo] = result.value[0];
          this.saveEditable(unidad_academica, campo);
        }
      })
  }

  editaSelect(unidad_academica, campo) {
    Swal.mixin({
      input: 'select',
      inputOptions: this.niveles_educativos,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'El campo '+campo+' es obligatorio'
        }
      }
      }).queue([
        {
          title: 'Modificar '+campo,
          text: 'Selecciona un nivel educativo.',
          inputValue: unidad_academica[campo]
        },
      ]).then((result) => {
        if (result.value) {
          unidad_academica[campo] = result.value[0];
          this.saveEditable(unidad_academica, campo);
        }
      })
  }

  saveEditable(unidad_academica, campo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaUnidad.php', JSON.stringify({
      tkn: this.token, unidad_academica: unidad_academica, campo: campo
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
          this.obtenUnidades();
          this.obtenNivelesEducativos();
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            timer: 5000
          });
        }
      });
  }

  cambiaEstado(unidad_academica, evento) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/cambiaEstadoUnidad.php', JSON.stringify({
      tkn: this.token, unidad_academica: unidad_academica
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
          this.obtenUnidades();
          this.obtenNivelesEducativos();
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
