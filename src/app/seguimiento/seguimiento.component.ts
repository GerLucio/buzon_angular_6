import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  modelo: any = {};
  servidor = new Servidor();
  historial_sugerencia: any = [];
  sugerencia: any = {};

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.historial_sugerencia = null;
  }

  buscaFolio() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/buscaFolio.php', JSON.stringify({
      sugerencia: this.modelo
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
          this.historial_sugerencia = null;
        }
        else {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: 'Folio encontrado'
          });
          this.historial_sugerencia = res['historial'];
          this.sugerencia = res['sugerencia'];
        }
      });
  }

  regresar(){
    this.router.navigate(['/sugerencias']);
  }

  termina() {
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    this.http.post(this.servidor.ip + '/buzon_backend/cambiarEstadoSugerenciaUsuario.php', JSON.stringify({
      sugerencia: this.sugerencia, usuario: 'Usuario', accion: 'Terminada'
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
        else {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            text: res['Exito'],
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/sugerencias']);
            }
          });
        }
      });
  }

  canaliza() {
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
      confirmButtonText: 'Enviar',
      inputValidator: (value) => {
        if (!value) {
          return 'El campo es obligatorio'
        }
      }
    }).queue([
      {
        title: "Escribe un motivo",
        text: "Escribe la razón por la cuál consideras que tu sugerencia no fue atendida de manera satisfactoria",
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
        this.http.post(this.servidor.ip + '/buzon_backend/cambiarEstadoSugerenciaUsuario.php', JSON.stringify({
          sugerencia: this.sugerencia, usuario: 'Usuario', accion: 'Canalizada'
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
            else {
              Swal.fire({
                type: 'success',
                title: 'ÉXITO',
                text: res['Exito'],
                allowOutsideClick: false
              }).then((result) => {
                if (result.value) {
                  this.router.navigate(['/sugerencias']);
                }
              });
            }
          });
      }
    })

  }

}
