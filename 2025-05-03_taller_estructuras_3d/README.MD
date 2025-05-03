# 🧪 Taller Estructuras 3D

## 📅 Fecha

`2025-05-03` – Fecha de realización del taller

---

## 🎯 Objetivo del Taller

Comprender las estructuras gráficas básicas que forman los modelos 3D (mallas poligonales) y visualizar su estructura en distintas plataformas. Se explorará la diferencia entre vértice, arista y cara, así como el contenido de formatos de archivo estándar de malla como `.OBJ`, `.STL` y `.GLTF`.

---

## 🧠 Conceptos Aprendidos

Lista de principales conceptos aplicados:

- [x] Estructura de una malla 3D (vértices, aristas, caras)
- [x] Formatos de archivo de modelos 3D (`.OBJ`, `.STL`, `.GLTF`)
- [x] Visualización de mallas en diferentes modos (Wireframe, Points, Solid)
- [x] Entornos de desarrollo multiplataforma (React Three Fiber, Python)
- [x] Extracción de información estructural de modelos 3D

---

## 🔧 Herramientas y Entornos

- **Python 3.x**

  - Librerías: `trimesh`, `vedo`, `numpy`, `matplotlib`
  - Entorno: Jupyter Notebook

- **React + TypeScript**
  - `@react-three/fiber`: Framework para Three.js en React
  - `@react-three/drei`: Utilidades para React Three Fiber
  - `three.js`: Biblioteca principal para gráficos 3D en la web
  - `leva`: Controles UI para ajustar parámetros

---

## 📁 Estructura del Proyecto

```
2025-05-03_taller_estructuras_3d/
├── python/              # Implementación Python
│   ├── visual_model.ipynb   # Jupyter notebook con visualización
│   ├── barril_rotacion.gif  # Animación exportada
│   └── Barrel_OBJ.obj       # Modelo 3D
├── threejs/             # Implementación React
│   ├── src/             # Código fuente
│   │   ├── App.tsx      # Componente principal
│   │   └── ...          # Otros archivos
│   ├── public/          # Archivos públicos
│   │   └── models/      # Modelos 3D
│   └── ...              # Configuración del proyecto
├── datos/               # Modelos compartidos
│   └── Barrel_OBJ.obj   # Modelo principal usado
└── README.MD            # Este archivo
```

---

## 🧪 Implementación

### 🔹 Python (trimesh + vedo)

En la implementación en Python, se utilizó un Jupyter Notebook (`visual_model.ipynb`) para:

1. Cargar el modelo 3D (`Barrel_OBJ.obj`) usando la biblioteca `trimesh`.
2. Extraer y visualizar componentes estructurales del modelo:
   - Vértices como puntos
   - Aristas como líneas
   - Caras como superficies coloreadas
3. Generar una animación de rotación del modelo y exportarla como GIF.

La visualización en `vedo` permitió explorar las diferentes representaciones del modelo y analizar su estructura.

### 🔹 React + Three.js

La implementación web utiliza React con TypeScript y la biblioteca Three.js a través de React Three Fiber:

1. Carga el modelo 3D utilizando `OBJLoader` de Three.js.
2. Implementa diferentes modos de visualización (sólido, wireframe, puntos) mediante la librería `leva` para los controles UI.
3. Calcula y muestra estadísticas del modelo (número de vértices, aristas y caras).
4. Ofrece controles interactivos para manipular la cámara con `OrbitControls`.

Características clave:

- Visualización en tiempo real del modelo 3D
- Alternancia entre diferentes modos de visualización
- Estadísticas detalladas sobre la estructura del modelo
- Controles de cámara interactivos para explorar el modelo desde diferentes ángulos

---

## 📊 Resultados Visuales

### Python - Visualización y Animación

La implementación en Python generó una visualización estática del modelo mostrando sus componentes estructurales, así como una animación de rotación:

![barril_rotacion](./python/barril_rotacion.gif)

### React Three Fiber - Visualización Interactiva

La implementación web permitió una exploración interactiva del modelo con diferentes modos de visualización y estadísticas en tiempo real:

![visualizacion_interactiva](./threejs/resultado/Animation.gif)

---

## 🧩 Prompts Usados

```text
"Quiero que me ayudes a crear un taller de transformaciones geométricas en 3D usando Python y React. El taller debe ser interactivo y visualizar los resultados en tiempo real."

"Quiero que me generes una animacion de un barril rotando en 3D"
```

---

## 💬 Reflexión Final

El taller permitió consolidar conceptos fundamentales sobre la estructura de modelos 3D, especialmente el manejo de vértices, aristas y caras que componen las mallas poligonales. Fue particularmente interesante explorar cómo diferentes formatos de archivo (.OBJ, .STL, .GLTF) almacenan esta información de manera distinta.