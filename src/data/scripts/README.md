# 📦 carta-el-pacto

Este proyecto gestiona y enriquece digitalmente la carta de un menú, asociando imágenes automáticamente a los productos listados. Utiliza un script que extrae imágenes desde un volcado HTML, las descarga y las vincula a los productos en formato JSON y Astro, permitiendo una integración fluida con proyectos frontend como Astro.js.

## 📥 Preparación del archivo `carta.json`

Antes de ejecutar el script, asegúrate de tener el archivo `carta.json` con todos los productos de la carta. Este archivo debe tener el siguiente formato:

```json
[{
    "nombre": "string",
    "precio": 0,
    "descripcion": "string",
    "ingredientes": [
      "string"
    ],
    "foto": true,
    "categoria": "string"
}]
```

## 🗂️ Actualización de categorías

Una vez que tengas el archivo `carta.json` listo, también es necesario identificar todas las categorías utilizadas para poder estructurar correctamente la app.

Puedes obtener una lista única de categorías ejecutando el siguiente comando en la terminal:

```bash
cat src/data/carta.json | jq '.[].categoria' -r | sort -u
```

Esto mostrará en la terminal una lista de todas las categorías presentes en la carta. Estas categorías se pueden usar para generar secciones ordenadas y decoradas en la interfaz, mejorando la presentación visual del menú.

### 🎨 Personalización de categorías con emojis

Una vez que tengas la lista de categorías, puedes mejorar su presentación pasando los nombres por una IA como Gemini. Usa el siguiente prompt para obtener un JSON con etiquetas capitalizadas y emojis decorativos asociados:


       Combierte la lista de palabras en un JSON con la siguiente estructura: 
       
       ```json
       {
       "<palabra>": {
           "label": "<texto capitalizado>",
           "emoji": "<seleciona un emoji>"
           }
       }
       ```
       
       - el emoji debe estar relacionado con la palabra por ejemplo si dice "HEINEKEN" deberia tener un emoji de cerveza.
       - No es necesario que todas las palabras tengan emoji

Una vez que obtengas el resultado, guárdalo en el archivo `src/data/categories.json`. Este archivo será utilizado por la app para mostrar las categorías decoradas correctamente.

### 🧠 ¿Cómo generar este archivo?

Puedes utilizar herramientas de inteligencia artificial para generar este archivo desde un PDF de la carta original. 

1. Descarga el PDF de la carta.
2. Usa un modelo de AI como **Gemini 1.5**, **Gemini 1.0 Pro**, **Gemini o4**, u otro modelo avanzado.
3. Utiliza el siguiente prompt para transformar el contenido del PDF al formato esperado:

       Crea un json con todos los elementos de la carta, debe tener el nombre, presion, descripcion, ingredientes, foto (si corresponde), categoria,
   
       Respeta el siguiente formato:
   
       ```json
       [{
           "nombre": "string",
           "precio": 0,
           "descripcion": "string",
           "ingredientes": ["string"],
           "foto": true,
           "categoria": ["string"]
       }]
       ```

## 📜 ¿Qué hace el script `resolve-image.ts`?

Este script automatiza y estandariza el contenido de la carta (`carta.json`) para su uso en un proyecto Astro. Su objetivo no es solo asociar imágenes a productos, sino generar dos archivos clave:

1. **`carta-full.json`**: contiene todos los productos con un formato normalizado, cada uno con un identificador único (`id`) y, si corresponde, una imagen asociada.
2. **`carta-images.astro`**: archivo que importa todas las imágenes de los productos y exporta un objeto `images`, permitiendo su uso directo en componentes Astro o en páginas.

### Archivos de entrada:
- `carta.json`: contiene todos los productos de la carta en formato JSON, incluyendo nombre, precio, descripción, ingredientes, si tiene foto y categoría.
- `snap-page.html`: HTML con imágenes referenciadas por `alt="NOMBRE_DEL_PRODUCTO"`.

### Archivos de salida:
- `carta-full.json`: productos enriquecidos, con estructura estandarizada y datos preparados para renderizar en la interfaz.
- `carta-images.astro`: archivo Astro con importaciones de imágenes, listo para ser utilizado directamente en componentes.

## 📁 Estructura esperada de archivos

carta-el-pacto/
│
├── src/
│   └── data/
│       ├── carta.json
│       ├── dump/
│       │   └── snap-page.html
│       ├── images/           # (se crea automáticamente)
│       ├── scripts/
│       │   └── resolve-image.ts
│       ├── carta-full.json   # (salida del script)
│       └── carta-images.astro # (salida del script)

## 🚀 Instrucciones para ejecutar el script

### 1. Instala las dependencias
Asegúrate de tener [bun](https://bun.sh/) instalado:

```bash
curl -fsSL https://bun.sh/install | bash
```
Instala las dependencias del proyecto:

```bash
bun install
```

### 2. Ejecuta el script de resolución de imágenes

```bash
bun run src/data/scripts/resolve-image.ts
```
Esto hará lo siguiente:
	•	Crea IDs únicos para cada producto.
	•	Busca imágenes en el HTML que coincidan con alt="nombre del producto".
	•	Descarga imágenes si no son las por defecto.
	•	Escribe archivos carta-full.json y carta-images.astro.



🧪 Verifica la salida
	•	Asegúrate de que la carpeta src/data/images/ contiene imágenes con nombres tipo {hash}.png.
	•	Verifica que carta-full.json tenga entradas con claves SHA y campo "image".
	•	Abre carta-images.astro para ver los imports generados.



🛠 Despliegue del proyecto

Este proyecto está pensado para integrarse en un sitio construido con Astro. Si quieres desplegar el sitio completo:

1. Instala Astro

npm create astro@latest

2. Integra el proyecto

Agrega la carpeta src/data y usa carta-full.json y carta-images.astro desde tus componentes Astro.

3. Ejecuta el servidor de desarrollo

npm run dev

O si usas bun:

bun dev



✍️ Ejemplo de uso en Astro

```astro
---
// src/pages/menu.astro
import { images } from '../data/carta-images.astro';
import carta from '../data/carta-full.json';
---

{Object.values(carta).map(item => (
  <div>
    <h2>{item.product.nombre}</h2>
    {item.image && <img src={images[item.id]} alt={item.product.nombre} />}
    <p>{item.product.descripcion}</p>
    <p><strong>${item.product.precio}</strong></p>
  </div>
))}
```


📌 Requisitos
	•	Node.js (preferiblemente vía bun.sh)
	•	Proyecto compatible con Astro
	•	Archivo snap-page.html con imágenes referenciadas por alt coincidente con el nombre del producto.
