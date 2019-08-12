import { Component, OnInit, HostListener } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-sugerencias',
  templateUrl: './admin-sugerencias.component.html',
  styleUrls: ['./admin-sugerencias.component.css']
})
export class AdminSugerenciasComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  token: string;
  servidor = new Servidor();
  tamano_pantalla: any;

  sugerencias: any = [];
  estado_actual: any;
  sugerencia_actual: any;
  estados_select: any = {};
  estados: any = [];
  sugerencia: any = {};

  ver_panel: boolean;
  ver_tabla: boolean;
  ver_detalles: boolean;

  filtro: string;

  modelo: any = {};

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.autenticado = false;
    this.tamano_pantalla = window.innerWidth;
    this.obtenUsuarioActual();
    this.obtenEstados();
    //this.obtenSugerencias();
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
      if (user.rol != 'area') {
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

  obtenSugerencias() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenSugerenciasArea.php', JSON.stringify({
      tkn: this.token, id_area: this.usuario_actual.id_usuario, estado: this.estado_actual, filtros: this.modelo
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
  }

  ver_documento(ruta) {
    //window.open(this.servidor.nombre + '/apps/sicdoc/files/' + documento.RUTA,
    window.open(this.servidor.ip + '/buzon_backend/verArchivo.php?file=' + ruta,
      "resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,titlebar=no");
  }

  obtenEstadosSelect() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenEstadosSelectArea.php', JSON.stringify({
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

  obtenEstados() {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenCuentaEstadosSugerenciasArea.php', JSON.stringify({
      tkn: this.token, area_asignacion: this.usuario_actual.id_usuario
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

  editaEstado(sugerencia, campo) {
    this.sugerencia.id_sugerencia = sugerencia.id_sugerencia;
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
            return 'El ' + campo + ' es obligatorio'
          }
        }
      }).queue([
        {
          title: 'Cambiar  ' + campo,
          text: 'Selecciona el nuevo estado.',
        },
      ]).then((result) => {
        if (result.value) {
          this.sugerencia.nombre_estado = this.estados_select[result.value[0]];
          this.sugerencia[campo] = result.value[0];
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
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            inputValidator: (value) => {
              if (!value) {
                return 'El campo es obligatorio'
              }
            }
          }).queue([
            {
              title: "Escribe tus comentarios",
              text: "Describe brevemente las acciones llevadas a cabo o el motivo del cambio de estado",
            },
          ]).then((result) => {
            if (result.value) {
              this.sugerencia['comentario'] = result.value[0];
              Swal.fire({
                type: 'info',
                title: 'Enviando petición',
                text: 'Espera un momento por favor',
                showConfirmButton: false,
                allowOutsideClick: false
              });
              this.http.post(this.servidor.ip + '/buzon_backend/cambiarEstadoSugerencia.php', JSON.stringify({
                tkn: this.token, sugerencia: this.sugerencia, usuario: 'Titular del área de asignación'
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
        }
      })
    }
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

  verTabla(estado) {
    this.estado_actual = estado;
    this.sugerencia_actual = null;
    this.obtenSugerencias();
    this.ver_panel = false;
    this.ver_tabla = true;
    this.ver_detalles = false;
  }

  verDetalles(sugerencia) {
    this.obtenEstadosSelect();
    this.sugerencia_actual = sugerencia;
    this.ver_panel = false;
    this.ver_tabla = false;
    this.ver_detalles = true;
  }

}
