import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { jsPDF } from 'jspdf';
import { FacturasService } from '../../../services/factura/facrtura.service';
import { CitasService } from '../../../services/citas/citas.service';
import { SeguimientoService } from '../../../services/seguimiento/seguimiento.service';
import { Factura } from '../../../model/Factura.model';
import { Cita } from '../../../model/Citas.model';
import { Seguimiento } from '../../../model/Seguimientos.model';

@Component({
  selector: 'app-descargar-factura',
  templateUrl: './factira.component.html',
  styleUrls: ['./factira.component.css']
})
export class DescargarFacturaComponent implements OnInit, OnChanges {
  @Input() idFactura?: number;

  factura: Factura | null = null;
  seguimientos: Seguimiento[] = [];

  loading: boolean = false;

  constructor(
    private facturasService: FacturasService,
    private citaService: CitasService,
    private seguimientoService: SeguimientoService
  ) { }

  ngOnInit() {
    this.cargarDatos();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.cargarDatos();
  }

  private cargarDatos() {
    if (this.idFactura) {
      this.loading = true;
      this.facturasService.getFacturaById(this.idFactura).subscribe(factura => {
        console.log('Factura cargada:', factura);
        this.factura = factura;
        if (factura.cita?.idCita) {
          this.citaService.getById(factura.cita.idCita).subscribe(cita => {
            this.seguimientoService.getSeguimientosByCita(cita.idCita).subscribe(segs => {
              this.seguimientos = Array.isArray(segs) && segs.length ? segs : [];
              this.loading = false;
            });
          });
        } else {
          this.loading = false;
        }
      }, () => { this.loading = false; });
    }
  }

  descargarPDF(): void {
    if (!this.factura) return;
    const doc = new jsPDF();

    // --- Cabecera ---
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34);
    doc.text('FACTURA', 10, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nº FACTURA: ${this.factura.idFactura ?? '-'}`, 140, 20);
    doc.text(`FECHA: ${ this.factura.fechaEmision ? new Date(this.factura.fechaEmision).toLocaleDateString() : '---' } `, 140, 28);

    doc.setDrawColor(34, 139, 34);
    doc.line(10, 35, 200, 35);

    // --- Datos Cliente y Taller ---
    doc.setFontSize(12);
    doc.text('DATOS CLIENTE:', 10, 42);
    doc.text('Nombre:', 10, 48);
    doc.text(
      this.factura.cita.usuarios?.nombre ||
      '---', 35, 48
    );
    doc.text('Mail:', 10, 54);
    doc.text(
      this.factura.cita.usuarios?.email ||
      '---', 35, 54
    );
    doc.text('Teléfono:', 10, 60);
    doc.text(
      this.factura.cita.usuarios?.telefono ||
      '---', 35, 60
    );

    doc.text('DATOS TALLER:', 110, 42);
    doc.text('Nombre:', 110, 48);
    doc.text('Taller Ejemplo', 140, 48);
    doc.text('Mail:', 110, 54);
    doc.text('taller@ejemplo.com', 140, 54);

    // --- Datos de la cita ---
    let y = 70;
    doc.setFontSize(13);
    doc.setTextColor(34, 139, 34);
    doc.text('CITA:', 10, y);
    doc.setTextColor(0, 0, 0);
    y += 6;
    doc.text(`ID: ${ this.factura.cita.idCita ?? '-' } `, 10, y);
    doc.text(`Fecha: ${ this.factura.cita.fechaHora ? new Date(this.factura.cita.fechaHora).toLocaleString() : '---' } `, 60, y);
    y += 6;
    doc.text(`Descripción: ${ this.factura.cita.descripcion || '-' } `, 10, y);
    y += 6;
    doc.text(`Estado: ${ this.factura.cita.estado || '-' } `, 10, y);

    // --- Tabla de Seguimientos ---
    y += 10;
    doc.setFillColor(220, 240, 220);
    doc.rect(10, y, 190, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(34, 139, 34);
    doc.text('Fecha', 14, y + 7);
    doc.text('Descripción', 40, y + 7);
    doc.text('Estado', 120, y + 7);
    doc.text('Imagen', 170, y + 7);

    doc.setTextColor(0, 0, 0);

    let ySeg = y + 15;
    const seguimientos = Array.isArray(this.seguimientos) && this.seguimientos.length
      ? this.seguimientos
      : [{
          descripcion: this.factura.cita.descripcion || 'Servicio taller',
          estado: this.factura.cita.estado || '',
          fechaActualizacion: this.factura.cita.fechaHora || new Date(),
          imagenUrl: ''
        }];

    seguimientos.forEach(seg => {
      doc.text(seg.fechaActualizacion ? new Date(seg.fechaActualizacion).toLocaleDateString() : '-', 14, ySeg);
      doc.text(seg.descripcion || '-', 40, ySeg);
      doc.text(seg.estado || '-', 120, ySeg);
      doc.text(seg.imagenUrl ? 'Sí' : 'No', 170, ySeg);
      ySeg += 8;
    });

    // --- Total y método de pago ---
    ySeg += 5;
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    doc.text(`TOTAL: `, 140, ySeg);
    doc.text(`${ this.factura.montoTotal?.toFixed(2) || '0.00' } €`, 190, ySeg, { align: 'right' });
    doc.setFont('', 'normal');

    ySeg += 15;

    doc.save(`factura_${ this.factura.idFactura ?? '---' }.pdf`);
  }
}