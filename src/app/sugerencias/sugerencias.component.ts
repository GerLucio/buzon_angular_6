import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {
  modelo: any = {};
  archivo: File = null;
  tipos_sugerencia: any = [];
  tipos_usuario: any = [];
  relaciones: any = [];
  niveles_educativos: any = [];
  unidades_academicas: any = [];
  unidades_academicas_filtro: any = [];
  nivel_seleccion: boolean;
  servidor = new Servidor();
  datos_personales: boolean;
  token: string;
  captcha_valido: boolean;
  envia: boolean = false;
  grecaptcha: any;
  key : string = "6LdnbqoUAAAAAEZM-oDvTcDkJaCjMCT6AA4BtT8X";

  @ViewChild('inputArchivo')
  inputArchivo: ElementRef;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.nivel_seleccion = false;
    this.datos_personales = false;
    this.captcha_valido = false;
    this.obtenTiposSugerencias();
    this.obtenTiposUsuarios();
    this.obtenRelaciones();
    this.obtenNivelesEducativos();
    this.obtenUnidades();
    this.muestraFlotante();
    window['getResponceCapcha'] = this.getResponceCapcha.bind(this);
  }

  ngOnDestroy() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showCloseButton: true,
      confirmButtonText: 'Entra aquí para dar seguimiento',
    });

    Toast.fire({
      title: '¿Ya mandaste tu sugerencia?',
      type: 'info'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/seguimiento']);
      }
    })
    Toast.close();
  }

  muestraFlotante() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showCloseButton: true,
      confirmButtonText: 'Entra aquí para dar seguimiento',
    });

    Toast.fire({
      title: '¿Ya mandaste tu sugerencia?',
      type: 'info'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/seguimiento']);
      }
    })
  }

  resetInputFile() {
    this.inputArchivo.nativeElement.value = "";
    this.archivo = null;
  }

  onFileSelected(event) {
    event.target.classList.add('is-valid');
    this.archivo = <File>event.target.files[0];
    if (this.archivo.size > 5000000) {
      this.resetInputFile();
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: 'El tamaño máximo de archivo son 5MB',
        timer: 5000
      });
      setTimeout(() => { this.muestraFlotante(); }, 5001);
    }
  }

  selecciona() {
    document.getElementById('inputArchivo').click();
  }

  obtenTiposSugerencias() {
    this.http.post(this.servidor.ip + '/buzon_backend/_obtenTiposSugerencias.php', JSON.stringify({
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
          setTimeout(() => { this.muestraFlotante(); }, 5001);
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
            this.tipos_sugerencia = null;
          }
          else {
            this.tipos_sugerencia = res;
          }
        }
      });
  }

  obtenTiposUsuarios() {
    this.http.post(this.servidor.ip + '/buzon_backend/_obtenTiposUsuarios.php', JSON.stringify({
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
          setTimeout(() => { this.muestraFlotante(); }, 5001);
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
            this.tipos_usuario = null;
          }
          else {
            this.tipos_usuario = res;
          }
        }
      });
  }

  obtenRelaciones() {
    this.http.post(this.servidor.ip + '/buzon_backend/_obtenRelaciones.php', JSON.stringify({
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
          setTimeout(() => { this.muestraFlotante(); }, 5001);
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
            this.relaciones = null;
          }
          else {
            this.relaciones = res;
          }
        }
      });
  }

  obtenNivelesEducativos() {
    this.http.post(this.servidor.ip + '/buzon_backend/_obtenNivelesEducativos.php', JSON.stringify({
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
          setTimeout(() => { this.muestraFlotante(); }, 5001);
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

  obtenUnidades() {
    this.http.post(this.servidor.ip + '/buzon_backend/_obtenUnidades.php', JSON.stringify({
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
          setTimeout(() => { this.muestraFlotante(); }, 5001);
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
          this.unidades_academicas_filtro = this.unidades_academicas;
        }
      });
  }

  filtraUnidad(event) {
    this.nivel_seleccion = true;
    this.unidades_academicas_filtro = this.unidades_academicas.filter(
      unidad => unidad.nivel_educativo == event.target.value
    );
    this.modelo.unidad = null;
  }

  enviarSugerencia() {
    if (this.modelo.usuario) {
      if (this.modelo.usuario == 1) {
        if (this.modelo.tipo && this.modelo.sugerencia && this.captcha_valido) {
          this.envia = true;
        }
        else {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: "Debes llenar todos los campos obligatorios",
            timer: 5000
          });
          this.envia = false;
        }
      }
      else {
        if (this.modelo.tipo && this.modelo.sugerencia && this.captcha_valido && this.modelo.relacion && this.modelo.nivel && this.modelo.unidad) {
          this.envia = true;
        }
        else {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: "Debes llenar todos los campos obligatorios",
            timer: 5000
          });
          this.envia = false;
        }
      }
    }
    else{
      Swal.fire({
        type: 'error',
        title: 'ERROR',
        text: "Debes llenar todos los campos obligatorios",
        timer: 5000
      });
      this.envia = false;
    }
    if (this.envia) {
      var nombre_archivo = null;
      if (this.archivo) {
        const data = new FormData();
        data.append('archivo', this.archivo, this.archivo.name);
        this.http.post(this.servidor.ip + '/buzon_backend/subirArchivo.php', data)
          .subscribe(res => {
            if (res['Error']) {
              Swal.fire({
                type: 'error',
                title: 'ERROR',
                text: res['Error'],
                timer: 5000
              });
              setTimeout(() => { this.muestraFlotante(); }, 5001);
              //nombre_archivo = null;
            }
            else if (res['Exito']) {
              this.altaSugerencia(res['nombre_generado']);
            }
          });
      }
      else {
        this.altaSugerencia(null);
      }
    }
  }

  getResponceCapcha(captchaResponse: string) {
    this.resolved(captchaResponse);
  }

  resolved(captchaResponse: string) {
    this.modelo.token_captcha = captchaResponse;
    this.http.post(this.servidor.ip + '/buzon_backend/validaCaptcha.php', JSON.stringify({
      token_captcha: this.modelo.token_captcha
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          this.captcha_valido = false;
        }
        else {
          this.captcha_valido = true;
        }
      });
  }

  altaSugerencia(nombre_archivo) {
    var inicial = '';
    Swal.fire({
      type: 'info',
      title: 'Enviando petición',
      text: 'Espera un momento por favor',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    for (let tipo of this.tipos_sugerencia) {
      if (tipo['id_tipo'] == this.modelo.tipo) {
        inicial = tipo['tipo_sugerencia'].substring(0, 1);
      }
    }
    this.http.post(this.servidor.ip + '/buzon_backend/altaSugerencia.php', JSON.stringify({
      sugerencia: this.modelo, nombre_archivo: nombre_archivo, inicial: inicial
    }), {
      }).subscribe(res => {
        if (res['Error']) {
          Swal.fire({
            type: 'error',
            title: 'ERROR',
            text: res['Error'],
            timer: 5000
          });
          setTimeout(() => { this.muestraFlotante(); }, 5001);
        }
        else {
          Swal.fire({
            type: 'success',
            title: 'ÉXITO',
            allowOutsideClick: false,
            html: 'Comentario generado con el folio: <b>' + res['Exito'] + '</b><p>Guarda tu folio para dar seguimiento.</p>'
          }).then((result) => {
            if (result.value) {
              this.muestraFlotante();
            }
          });
          this.modelo = {};
          this.resetInputFile();
          this.datos_personales = false;
          this.captcha_valido = false;
          
        }
      });
  }

}
