import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import type { DatosProducto, Producto } from './producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly productos = collection(db, 'productos');

  async listar(): Promise<Producto[]> {
    const resultado = await getDocs(this.productos);

    return resultado.docs.map((documento) => ({
      ...(documento.data() as DatosProducto),
      id: documento.id,
    }));
  }

  crear(datos: DatosProducto) {
    return addDoc(this.productos, { ...datos });
  }

  actualizar(id: string, datos: DatosProducto) {
    return updateDoc(doc(this.productos, id), { ...datos });
  }

  eliminar(id: string) {
    return deleteDoc(doc(this.productos, id));
  }
}