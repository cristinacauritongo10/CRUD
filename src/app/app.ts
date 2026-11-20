import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { Producto } from './productos/producto';
import { ProductoService } from './productos/producto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly servicio = inject(ProductoService);

  readonly productos = signal<Producto[]>([]);
  readonly editandoId = signal<string | null>(null);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly errorLista = signal('');
  readonly errorOperacion = signal('');
  readonly mensaje = signal('');

  readonly formulario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    categoria: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      (campo) => Number.isFinite(campo.value) ? null : { numero: true },
    ]),
    stock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      (campo) => Number.isSafeInteger(campo.value) ? null : { entero: true },
    ]),
  });

  ngOnInit() {
    void this.cargarProductos();
  }

  private async cargarProductos() {
    this.cargando.set(true);
    this.errorLista.set('');

    try {
      this.productos.set(await this.servicio.listar());
    } catch (error) {
      console.error(error);
      this.errorLista.set('No se pudieron cargar los productos.');
    } finally {
      this.cargando.set(false);
    }
  }

  editar(producto: Producto) {
    this.editandoId.set(producto.id);
    this.errorOperacion.set('');
    this.mensaje.set('');
    this.formulario.reset({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  }

  cancelarEdicion() {
    this.editandoId.set(null);
    this.formulario.reset();
    this.errorOperacion.set('');
  }

  async guardar() {
    if (this.guardando()) return;

    this.errorOperacion.set('');
    this.mensaje.set('');
    this.formulario.markAllAsTouched();

    const { nombre, categoria, precio, stock } = this.formulario.getRawValue();
    if (this.formulario.invalid || precio === null || stock === null) return;

    const datos = { nombre: nombre.trim(), categoria: categoria.trim(), precio, stock };
    const id = this.editandoId();
    this.guardando.set(true);

    try {
      if (id === null) {
        await this.servicio.crear(datos);
        this.mensaje.set('Producto creado.');
      } else {
        await this.servicio.actualizar(id, datos);
        this.mensaje.set('Producto actualizado.');
      }

      this.cancelarEdicion();
      await this.cargarProductos();
    } catch (error) {
      console.error(error);
      this.errorOperacion.set('No se pudo guardar el producto. Revisa la conexión y los permisos.');
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(producto: Producto) {
    if (this.guardando() || !window.confirm(`¿Eliminar «${producto.nombre}»?`)) {
      return;
    }

    this.errorOperacion.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    try {
      await this.servicio.eliminar(producto.id);
      if (this.editandoId() === producto.id) this.cancelarEdicion();
      this.mensaje.set('Producto eliminado.');
      await this.cargarProductos();
    } catch (error) {
      console.error(error);
      this.errorOperacion.set('No se pudo eliminar el producto. Revisa la conexión y los permisos.');
    } finally {
      this.guardando.set(false);
    }
  }
}