import { Component, OnInit, HostListener } from '@angular/core';
import { Usuario } from "../templates/usuario";
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  token: string;
  servidor = new Servidor();
  tamano_pantalla: any;

  estados: any = [];
  sugerencias: any = [];
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
      if(user.area_asignacion != 'Dirección'){
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

}
