# Inventario de ropa y accesorios

Aplicación web desarrollada con Angular y Firebase para la práctica 02.2.
Permite administrar un inventario de ropa y accesorios. Los datos se guardan
en Cloud Firestore y se conservan al recargar la página.

**Aplicación en Vercel:** https://crud-swart-nu.vercel.app/ 

## Funcionalidades

- **Crear:** registrar un producto desde el formulario.
- **Leer:** consultar los productos de Firestore y mostrarlos en una tabla.
- **Actualizar:** editar un producto y guardar los cambios con el mismo ID.
- **Eliminar:** borrar un producto después de confirmar. Si se cancela, el producto permanece en la tabla.

El formulario exige un nombre y una categoría, un precio numérico mayor o igual
a cero y un stock entero mayor o igual a cero.

## Modelo del producto

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Identificador del documento en Firestore. |
| `nombre` | `string` | Nombre del producto. |
| `categoria` | `string` | Categoría del producto, por ejemplo Ropa o Accesorios. |
| `precio` | `number` | Precio en dólares. |
| `stock` | `number` | Cantidad de unidades disponibles. |

Los documentos se guardan en la colección `productos`. El servicio
`ProductoService` realiza las operaciones con Firestore.

## Configuración de Firebase

1. Crea o selecciona un proyecto en Firebase Console.
2. Registra una aplicación web y habilita Cloud Firestore.
3. Copia el objeto `firebaseConfig` de tu aplicación web en
   `src/app/firebase.config.ts`.
4. Configura las reglas de Firestore para permitir las operaciones de la práctica
   sobre la colección `productos` durante la revisión.

## Instalación y ejecución local

Abre la carpeta que contiene `package.json` y `angular.json`, y ejecuta:

```bash
npm install
npx ng serve
```

Abre [http://localhost:4200](http://localhost:4200).

Para generar la compilación de producción:

```bash
npm run build
```

## Cómo comprobar el CRUD

1. Crea `Cinturón negro de prueba`, categoría `Accesorios`, precio `12.50` y stock `8`. Recarga y comprueba que aparece en la tabla.
2. Edita el stock a `10`. Recarga y comprueba que el cambio se conserva.
3. Pulsa **Eliminar** y cancela. Comprueba que el producto sigue en la tabla.
4. Vuelve a pulsar **Eliminar**, confirma y recarga. El producto debe desaparecer.