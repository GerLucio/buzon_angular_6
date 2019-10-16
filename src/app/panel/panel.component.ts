import { Component, OnInit, HostListener } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  token: string;
  servidor = new Servidor();
  tamano_pantalla: any;
  descripcion: string;

  estados: any = [];
  estados_select: any = {};
  sugerencias: any = [];
  prioridades: any = [];
  areas: any = [];
  areas_select: any = [];

  estado_actual: any;
  sugerencia_actual: any;

  ver_panel: boolean;
  ver_tabla: boolean;
  ver_detalles: boolean;

  modelo: any = {};

  //fecha = new Date().toLocaleDateString();

  filtro: string;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.tamano_pantalla = window.innerWidth;
    this.obtenUsuarioActual();
    this.obtenEstados();
    this.ver_panel = true;
    this.ver_tabla = false;
    this.ver_detalles = false;
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
      if(user.rol == 'admin' || user.area_asignacion == "Dirección"){
        this.usuario_actual.rol = user.rol;
        this.usuario_actual.id_usuario = user.id_usuario;
        this.usuario_actual.nombre = user.nombre;
        this.usuario_actual.apellidos = user.apellidos;
        this.usuario_actual.correo = user.correo;
        this.token = JSON.parse(localStorage.getItem('tkn'));
      }
      else{
        this.router.navigate(['/sugerencias']);
      }
    }
  }

  obtenEstados() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenCuentaEstadosSugerencias.php', JSON.stringify({
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

  obtenPrioridades() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenPrioridadesSelect.php', JSON.stringify({
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
            this.prioridades = null;
          }
          else {
            this.prioridades = res;
          }
        }
      });
  }

  obtenEstadosSelect() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenEstadosSelect.php', JSON.stringify({
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
            this.estados_select = null;
          }
          else {
            this.estados_select = res;
          }
        }
      });
  }

  obtenAreas() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenAreasSelect.php', JSON.stringify({
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

  obtenAreasSelect() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenAreasForSelect.php', JSON.stringify({
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
            this.areas_select = null;
          }
          else {
            this.areas_select = res;
          }
        }
      });
  }

  filtraFecha(event, accion){
    if (this.modelo.fecha_f && this.modelo.fecha_i) {
      this.verTabla(this.estado_actual);
    }
    else {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'Debes elegir una fecha de inicio y una de fin',
        timer: 5000
      });
    }
  }

  limpia(){
    this.filtro = "";
    this.modelo = {};
    this.verTabla(this.estado_actual);
  }

  validaBotonLimpia(){
    if(this.filtro != '' || this.modelo.fecha_i || this.modelo.fecha_f || this.modelo.area){
      return false;
    }
    return true;
  }

  verTabla(estado) {
    this.obtenAreasSelect();
    this.estado_actual = estado;
    this.sugerencia_actual = null;
    this.http.post(this.servidor.ip + '/buzon_backend/obtenSugerenciasEstado.php', JSON.stringify({
      tkn: this.token, estado: estado, filtros: this.modelo
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
            this.sugerencias = null;
          }
          else {
            this.sugerencias = res;
          }
        }
      });

    this.ver_panel = false;
    this.ver_tabla = true;
    this.ver_detalles = false;
  }

  verPanel() {
    this.limpia();
    this.estado_actual = null;
    this.ver_panel = true;
    this.ver_tabla = false;
    this.ver_detalles = false;
    this.filtro = "";
    this.obtenEstados();
  }

  verDetalles(sugerencia) {
    this.obtenPrioridades();
    this.obtenAreas();
    this.obtenEstadosSelect();
    this.sugerencia_actual = sugerencia;
    this.ver_panel = false;
    this.ver_tabla = false;
    this.ver_detalles = true;
  }

  ver_documento(ruta) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.ip + '/buzon_backend/verArchivo.php?file=' + ruta,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  Administrar() {
    if (!this.prioridades) {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'No hay prioridades dadas de alta',
        timer: 5000
      });
    }
    else if (!this.areas) {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'No hay áreas de asignación dadas de alta',
        timer: 5000
      });
    }
    else {
      Swal.mixin({
        input: 'select',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo es obligatorio'
          }
        }
      }).queue([
        {
          title: 'Asignar prioridad',
          text: 'Elige una prioridad para la sugerencia.',
          //inputValue: this.sugerencia_actual.prioridad,
          inputOptions: this.prioridades,
        },
        {
          title: 'Asignar área',
          text: 'Elige un área de asignación para la sugerencia.',
          //inputValue: this.sugerencia_actual.area_asignacion,
          inputOptions: this.areas,
        },
      ]).then((result) => {
        if (result.value) {
          this.sugerencia_actual.id_prioridad = result.value[0];
          this.sugerencia_actual.id_area_asignacion = result.value[1];
          this.atiendeSugerenciaRecibida(this.sugerencia_actual);
        }
      })
    }
  }

  atiendeSugerenciaRecibida(sugerencia_actual) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/atiendeSugerenciaRecibida.php', JSON.stringify({
      tkn: this.token, sugerencia: sugerencia_actual
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
          this.verTabla(this.estado_actual);
        }
      });
  }

  CancelarSugerencia() {

    Swal.mixin({
      input: 'textarea',
      inputAttributes: {
        maxlength: '2048',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Sí, cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El campo es obligatorio'
        }
      }
      }).queue([
        {
          title: "¿Deseas cancelar la sugerencia con folio: " + this.sugerencia_actual.folio_sugerencia + '?',
          text: "Escribe la razón por la cuál deseas a cancelar la sugerencia",
        },
      ]).then((result) => {
        if (result.value) {
          this.descripcion = result.value[0];
          Swal.fire({
            type: 'info',
            title: 'Enviando petición',
            text: 'Espera un momento por favor',
            showConfirmButton: false,
            allowOutsideClick: false
          });
          this.http.post(this.servidor.ip + '/buzon_backend/cancelarSugerencia.php', JSON.stringify({
            tkn: this.token, sugerencia: this.sugerencia_actual, descripcion: this.descripcion, usuario: 'Administrador'
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
                this.verTabla(this.estado_actual);
              }
            });
        }
      })

    /*Swal.fire({
      title: 'Atención',
      text: "¿Deseas cancelar la sugerencia con folio: " + this.sugerencia_actual.folio_sugerencia + '?',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Sí, cancelar'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          type: 'info',
          title: 'Enviando petición',
          text: 'Espera un momento por favor',
          showConfirmButton: false,
          allowOutsideClick: false
        });
        this.http.post(this.servidor.ip + '/buzon_backend/cancelarSugerencia.php', JSON.stringify({
          tkn: this.token, sugerencia: this.sugerencia_actual
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
              this.verTabla(this.estado_actual);
            }
          });
      }
    })*/
  }

  editaprioridad(sugerencia, campo) {
    if (!this.prioridades) {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'No hay prioridades dadas de alta',
        timer: 5000
      });
    }
    else {
      Swal.mixin({
        input: 'select',
        inputOptions: this.prioridades,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo ' + campo + ' es obligatorio'
          }
        }
      }).queue([
        {
          title: 'Modificar ' + campo,
          text: 'Selecciona una prioridad.',
          inputValue: sugerencia['id_prioridad']
        },
      ]).then((result) => {
        if (result.value) {
          sugerencia[campo] = result.value[0];
          this.saveEditable(sugerencia, campo);
        }
      })
    }
  }

  editaArea(sugerencia, campo) {
    if (!this.areas) {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'No hay áreas de asignación dadas de alta',
        timer: 5000
      });
    }
    else {
      Swal.mixin({
        input: 'select',
        inputOptions: this.areas,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo ' + campo + ' es obligatorio'
          }
        }
      }).queue([
        {
          title: 'Modificar ' + campo,
          text: 'Selecciona un área de asignación.',
          inputValue: sugerencia['id_area_asignacion']
        },
      ]).then((result) => {
        if (result.value) {
          sugerencia[campo] = result.value[0];
          this.saveEditable(sugerencia, campo);
        }
      })
    }
  }

  editaEstado(sugerencia, campo) {
    if (!this.estados_select) {
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'No hay estados dados de alta',
        timer: 5000
      });
    }
    else {
      Swal.mixin({
        input: 'select',
        inputOptions: this.estados_select,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo ' + campo + ' es obligatorio'
          }
        }
      }).queue([
        {
          title: 'Modificar ' + campo,
          text: 'Selecciona un estado.',
          inputValue: sugerencia['id_estado']
        },
      ]).then((result) => {
        if (result.value) {
          sugerencia[campo] = result.value[0];
          this.saveEditable(sugerencia, campo);
        }
      })
    }
  }

  saveEditable(sugerencia, campo) {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/editaSugerencia.php', JSON.stringify({
      tkn: this.token, sugerencia: sugerencia, campo: campo
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
          this.verTabla(this.estado_actual);
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
