import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../templates/usuario";
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  servidor = new Servidor();
  token: string;
  nueva_area: any = {};
  areas: any = [];
  ver_nuevo: boolean;
  tamano_pantalla: any;
  filtro: string;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.obtenUsuarioActual();
    this.obtenAreas();
    this.ver_nuevo = false;
    this.tamano_pantalla = window.innerWidth;
    this.filtro = "";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tamano_pantalla = window.innerWidth;
  }

  corta() {
    this.filtro = this.filtro.replace(/^\s+/, "");;
  }

  obtenUsuarioActual() {
    var user;
    this.autenticado = JSON.parse(localStorage.getItem('autenticado'));
    if (this.autenticado) {
      user = JSON.parse(localStorage.getItem('usuario'));
      if (user.rol != 'admin') {
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

  obtenAreas() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenAreas.php', JSON.stringify({
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
          this.areas = null;
        }
        else {
          this.areas = res;
        }
      }
    });
  }

  cancelaAlta() {
    this.nueva_area = {};
    this.obtenAreas();
    this.ver_nuevo = false;
  }

  altaArea() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/altaArea.php', JSON.stringify({
      tkn: this.token, area: this.nueva_area, url: this.servidor.url
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
        this.obtenAreas();
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

  /*edita(area, campo, longitud) {
    if (campo == 'correo_area') {
      var expresion = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    }
    else if(campo == "extension_area")
    var expresion = /^[0-9]+$/;
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
        inputValue: area[campo]
      },
    ]).then((result) => {
      if (result.value) {
        area[campo] = result.value[0];
        this.saveEditable(area, campo);
      }
    })
  }*/

  edita(area, campo, longitud) {
    var area2 = JSON.parse(JSON.stringify(area));
    var expresion_correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    var expresion_area = /^[0-9]+$/;
    var expresion = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s.]+$/;
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4']
    }).queue([
      {
        inputValidator: (value) => {
          if (!value) {
            return 'El Área de asignación es obligatoria'
          }
          var valida = expresion.test(value);
          if (!valida) {
            return 'El nombre del área es inválido'
          }
        },
        inputAttributes: {
          maxlength: '128',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        title: 'Modificar Área de Asignación',
        text: 'Escribe un valor válido.',
        inputValue: area2.area_asignacion
      },
      {
        inputValidator: (value) => {
          if (!value) {
            return 'El Nombre del titular es obligatorio'
          }
          var valida = expresion.test(value);
          if (!valida) {
            return 'El nombre es inválido'
          }
        },
        inputAttributes: {
          maxlength: '128',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        title: 'Modificar Titular del área',
        text: 'Escribe un valor válido.',
        inputValue: area2.titular_area
      },
      {
        inputValidator: (value) => {
          if (!value) {
            return 'El Correo del titular es obligatorio'
          }
          var valida = expresion_correo.test(value);
          if (!valida) {
            return 'El correo es inválido'
          }
        },
        inputAttributes: {
          maxlength: '64',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        title: 'Modificar Correo del titular',
        text: 'Escribe un valor válido.',
        inputValue: area2.correo_area
      },
      {
        inputValidator: (value) => {
          if (!value) {
            return 'La extensión del titular es obligatoria'
          }
          var valida = expresion_area.test(value);
          if (!valida) {
            return 'La extensión es inválida'
          }
        },
        inputAttributes: {
          maxlength: '5',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        title: 'Modificar Extensión del titular',
        text: 'Escribe un valor válido.',
        inputValue: area2.extension_area
      },
    ]).then((result) => {
      if (result.value) {
        area2.area_asignacion = result.value[0];
        area2.titular_area = result.value[1];
        area2.correo_area = result.value[2];
        area2.extension_area = result.value[3];
        this.saveEditable(area2, area.correo_area);
      }
    })
  }

  saveEditable(area, correo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaArea2.php', JSON.stringify({
      tkn: this.token, area: area, url: this.servidor.url, correo_anterior: correo
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
        this.obtenAreas();
        Swal.fire({
          type: 'success',
          title: 'ÉXITO',
          text: res['Exito'],
          timer: 5000
        });
      }
    });
  }

  /*saveEditable(area, campo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaArea.php', JSON.stringify({
      tkn: this.token, area: area, campo: campo
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
        this.obtenAreas();
        Swal.fire({
          type: 'success',
          title: 'ÉXITO',
          text: res['Exito'],
          timer: 5000
        });
      }
    });
  }*/

  cambiaEstado(area, evento) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/cambiaEstadoArea.php', JSON.stringify({
      tkn: this.token, area: area
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
        this.obtenAreas();
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
