import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from "../templates/servidor";
import { Usuario } from "../templates/usuario";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  usuario_actual = new Usuario();
  autenticado: boolean;
  servidor = new Servidor();
  token: string;
  filtros: any = [];
  modelo: any = {};
  tamano_pantalla: any;
  ver_grafico: boolean;
  ver_filtro: boolean;
  ver_dimension: boolean;
  ver_descarga : boolean;
  dimensiones: any = [];
  tipos_graficos: any = [];
  dimensiones_filtro = [];
  dimension_seleccion: any;

  PieChart: any = [];
  BarChart: any = [];

  titulo_export : any = [];

  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    this.dimensiones = [
      {//ya hay color
        'valor': 'area_asignacion',
        'texto': 'Área de asignación'
      },
      {//ya hay color
        'valor': 'estado',
        'texto': 'Estado'
      },
      {//ya hay color
        'valor': 'nivel_educativo',
        'texto': 'Nivel Educativo'
      },
      {//ya hay color
        'valor': 'prioridad',
        'texto': 'Prioridad'
      },
      {//ya hay color
        'valor': 'relacion_instituto',
        'texto': 'Relación con el Instituto'
      },
      {//ya hay color
        'valor': 'tipo_sugerencia',
        'texto': 'Tipo de Sugerencia'
      },
      {//ya hay color
        'valor': 'tipo_usuario',
        'texto': 'Tipo de usuario'
      }
    ];
    this.tipos_graficos = [
      { 'valor': 'bar', 'texto': 'Barras' }, { 'valor': 'pie', 'texto': 'Pastel' }
    ];
    this.modelo.tipo = 'bar';
    this.dimensiones_filtro = this.dimensiones.slice();
    this.autenticado = false;
    this.ver_grafico = false;
    this.ver_filtro = false;
    this.ver_descarga = false;
    this.ver_dimension = false;
    this.tamano_pantalla = window.innerWidth;
    this.obtenUsuarioActual();
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
      if (user.rol != 'admin' && user.area_asignacion != 'Dirección') {
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

  /*eligeTipo(event) {
    this.ver_dimension = true;
    if (this.modelo.dimension) {
      this.dibujaGrafico(event, 'dimension');
    }
  }*/

  eligeTipo2(valor) {
    this.modelo.tipo = valor
    this.ver_dimension = true;
    if (this.modelo.dimension) {
      this.dibujaGrafico(event, 'dimension');
    }
  }

  filtraFecha(event, accion) {
    if (this.modelo.fecha_f && this.modelo.fecha_i) {
      this.dibujaGrafico(event, 'filtro_f');
      //console.log(this.modelo.fecha_f);
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

  limpia(event, accion){
    this.modelo.fecha_i = null;
    this.modelo.fecha_f = null;
    this.dibujaGrafico(event, accion);
  }

  dibujaGrafico(event, accion) {
    if (accion == 'dimension') {
      this.dimension_seleccion = event.target.selectedIndex;
      /**Si cambia el requerimiento y quieren que no se eliminen los filtros al cambiar el tipo de gráfico, solo hay que comentar
       * estas líneas
      */
      this.modelo.agrupamiento = null;
      this.modelo.filtro = null;
      this.modelo.fecha_i = null;
      this.modelo.fecha_f = null;
      this.ver_filtro = false;
      this.dimensiones_filtro = this.dimensiones.slice();
      this.dimensiones_filtro.splice(this.dimension_seleccion, 1);
      /** */
    }
    else if (accion == 'limpia') {
      this.modelo.agrupamiento = null;
      this.modelo.filtro = null;
      this.ver_filtro = false;
      this.dimensiones_filtro = this.dimensiones.slice();
      this.dimensiones_filtro.splice(this.dimension_seleccion, 1);
    }

    var element = document.getElementById('pie-chart');
    element.parentNode.removeChild(element);

    var p = document.getElementById('grafico');
    var newElement = document.createElement('canvas');
    newElement.setAttribute('id', 'pie-chart');
    newElement.innerHTML = '';
    p.appendChild(newElement);

    this.http.post(this.servidor.ip + '/buzon_backend/datosGrafico.php', JSON.stringify({
      tkn: this.token, datos: this.modelo
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
            var element = document.getElementById('pie-chart');
            element.parentNode.removeChild(element);

            var p = document.getElementById('grafico');
            var newElement = document.createElement('span');
            newElement.setAttribute('id', 'pie-chart');
            newElement.setAttribute('class', 'alert alert-danger');
            newElement.setAttribute('role', 'alert');
            newElement.innerHTML = 'No hay datos que graficar';
            this.ver_descarga = false;
            p.appendChild(newElement);
            
            this.modelo.agrupamiento = null;
            this.modelo.filtro = null;
            this.ver_filtro = false;
          }
          else {
            this.ver_grafico = true;
            this.ver_descarga = true;
            if (this.modelo.tipo == 'pie') {
              var mantener_aspecto;
              var font_size;
              var radio;
              var posicion;
              if (this.tamano_pantalla < 576) {
                mantener_aspecto = false;
                font_size = 12;
                posicion = 'top';
                radio = 0.75;
              }
              else {
                mantener_aspecto = true;//true
                font_size = 16;
                radio = 2.5;
                posicion = 'left';
              }
              if (this.modelo.filtro) {
                var filtrado = this.dimensiones_filtro.filter(
                  campo => campo.valor == this.modelo.agrupamiento
                );
                var titulo = ['Total de sugerencias: ' + res['total'], 'Filtro: ' + filtrado[0].texto +
                  ', Valor: ' + this.modelo.filtro];
              }
              else {
                var titulo = ['Total de sugerencias: ' + res['total']];
              }
              if (this.modelo.fecha_f && this.modelo.fecha_i) {
                titulo.push('Filtro por fechas: de ' + this.modelo.fecha_i + ' a ' + this.modelo.fecha_f);
              }
              this.titulo_export[0] = titulo;
              var datos = res['valor'];
              this.PieChart = new Chart('pie-chart', {
                type: 'pie',
                data: {
                  labels: res['clave'],
                  datasets: [{
                    backgroundColor: res['colores'],
                    data: datos
                  }]
                },
                options: {
                  title: {
                    display: true,
                    text: titulo,
                    fontSize: 18,
                    position: 'bottom'
                  },
                  responsive: true,
                  aspectRatio: radio,
                  maintainAspectRatio: mantener_aspecto,
                  legend: {
                    position: posicion,
                    labels: {
                      fontSize: font_size
                    }
                  },
                  plugins: {
                    datalabels: {
                      formatter: (value, ctx) => {
                        return value;
                      },
                      color: 'black',
                      font: {
                        size: font_size,
                        weight: 'bold'
                      }
                    }
                  }
                }
              });
              this.PieChart.update();
            }
            else {
              var mantener_aspecto;
              var font_size;
              var radio;
              var posicion;
              if (this.tamano_pantalla < 576) {
                mantener_aspecto = false;
                font_size = 12;
                posicion = 'top';
                radio = 0.75;
              }
              else {
                mantener_aspecto = true;//true
                font_size = 16;
                radio = 2.5;
                posicion = 'top';
              }

              if (this.modelo.filtro) {
                var filtrado = this.dimensiones_filtro.filter(
                  campo => campo.valor == this.modelo.agrupamiento
                );
                var lab = 'Total de sugerencias: ' + res['total'] + ', Filtro: ' + filtrado[0].texto +
                  ', Valor: ' + this.modelo.filtro;
              }
              else {
                var lab = 'Total de sugerencias: ' + res['total'];
              }
              if (this.modelo.fecha_f && this.modelo.fecha_i) {
                lab = lab + '. Filtro por fechas: de ' + this.modelo.fecha_i + ' a ' + this.modelo.fecha_f;
              }
              this.titulo_export[0] = lab;
              var datos = res['valor'];
              this.BarChart = new Chart('pie-chart', {
                type: 'bar',
                data: {
                  labels: res['clave'],
                  datasets: [{
                    backgroundColor: res['colores'],
                    data: datos,
                    label: lab
                  }]
                },
                options: {
                  responsive: true,
                  aspectRatio: radio,
                  maintainAspectRatio: mantener_aspecto,
                  legend: {
                    position: posicion,
                    labels: {
                      fontSize: font_size
                    }
                  },
                  plugins: {
                    datalabels: {
                      formatter: (value, ctx) => {
                        return value;
                      },
                      color: 'black',
                      font: {
                        size: font_size,
                        weight: 'bold'
                      }
                    }
                  },
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              });
              this.BarChart.update();
            }
          }
        }
      });
  }

  filtrar(event) {
    this.http.post(this.servidor.ip + '/buzon_backend/obtenDatosFiltro.php', JSON.stringify({
      tkn: this.token, datos: this.modelo
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
            this.filtros = null;
          }
          else {
            this.ver_filtro = true;
            this.filtros = res;
          }
        }
      });
  }

  exportar() {
    var total_x = 612;
    var total_y = 792;
    var canvas = <HTMLCanvasElement>document.getElementById('pie-chart');
    var imagen = canvas.toDataURL("image/png", 1.0);
    /**
     * 1 parametro es orientación:
     * 'p': portrait (vertical), 'l': landscape (horizontal)
     * 2 parametro es unidad de medida:
     * pt, mm, cm, in, px, pc, em, ex
     * 3 parametro es aarreglo de ancho y largo
    */
    var cadena = 'Departamento de Evaluación y Gestión de la Calidad';
    var pdf = new jsPDF('p', 'pt', [total_x, total_y]);
    var textWidth = pdf.getStringUnitWidth(cadena) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
    pdf.text(cadena, textOffset, 30);
    pdf.setFontSize(10);
    pdf.text('Gráfico de sugerencias recibidas en el Buzón de Sugerencias', 10, 90);
    pdf.text(this.titulo_export[0], 10, 110);
    pdf.text('Mostrando dimensión: '+this.modelo.dimension, 10, 130);
    if (this.tamano_pantalla > 575) {
      var x = 592;
      var y = (canvas.height * x) / canvas.width;
      var origen_x = 10;
      var origen_y = 200;
    }
    else {
      var y = 392;
      var x = (canvas.width * y) / canvas.height;
      var origen_x = (total_x - x) / 2;
      var origen_y = 200;
    }
    pdf.addImage(imagen, 'PNG', origen_x, origen_y, x, y);
    pdf.save("grafico.pdf");
  }

}
