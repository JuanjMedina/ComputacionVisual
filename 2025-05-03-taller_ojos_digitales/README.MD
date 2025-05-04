# 🧪 Taller Ojos Digitales: Filtros de Imagen Interactivos

## 📅 Fecha

`2025-05-03` – Fecha de realización

---

## 🎯 Objetivo del Taller

Entender los fundamentos de la percepción visual artificial mediante imágenes en escala de grises, filtros y detección básica de bordes. Se trabajará con OpenCV para explorar cómo los computadores interpretan imágenes visuales básicas.


---

## 🧠 Conceptos Aprendidos

Lista los principales conceptos aplicados:

- [x] Transformaciones geométricas (uso implícito en OpenCV, manejo de kernels)
- [x] Segmentación de imágenes
- [x] Shaders y efectos visuales (simulación mediante filtros de convolución)
- [ ] Entrenamiento de modelos IA
- [ ] Comunicación por gestos o voz
- [x] Otro: Lectura/escritura de imágenes, manejo de webcam, interfaces gráficas básicas con OpenCV (trackbars), operaciones de convolución.

---

## 🔧 Herramientas y Entornos

Especifica los entornos usados:

- Python (`opencv-python`, `numpy`)

---

## 📁 Estructura del Proyecto

```
2025-05-03_taller_ojos_digitales/
├── python/                 # Código fuente principal (main.py)
├── images/                 # Imágenes de entrada
├── result/                 # Directorio para guardar capturas o GIFs (¡GENERAR AQUÍ!)
├── README.md
```

---

## 🧪 Implementación

Explica el proceso:

### 🔹 Etapas realizadas

1.  **Preparación:** Se carga una lista de imágenes desde el directorio `images/` o se inicializa la captura de la webcam.
2.  **Interfaz y Controles:** Se crea una ventana de OpenCV (`Carousel`) con trackbars para seleccionar la imagen (o modo webcam), el tipo de filtro y el tamaño del kernel.
3.  **Aplicación de Filtro:** Según la selección en los trackbars, la imagen (o frame de webcam) se convierte a escala de grises y se le aplica el filtro elegido (Blur, Sharpen, Sobel X/Y, Laplacian) usando la función `apply_filter`. El tamaño del kernel también es ajustable.
4.  **Visualización:** La imagen resultante (con el filtro aplicado) se muestra en la ventana `Carousel`, junto con texto superpuesto que indica la imagen/modo actual, el filtro y el tamaño del kernel. La visualización se actualiza continuamente mediante la función `update`.
5.  **Interacción:** El usuario puede manipular los trackbars para cambiar los parámetros en tiempo real. El bucle principal espera la tecla ESC para salir y liberar recursos.

### 🔹 Código relevante

Este fragmento muestra la función principal que aplica los diferentes filtros según el índice seleccionado y el tamaño del kernel:

```python
import cv2
import numpy as np

# ... (otras partes del código)

def apply_filter(gray, filt_idx, ksize):
    if filt_idx == 0: # Grayscale (no filter)
        return gray
    elif filt_idx == 1: # Blur
        return cv2.blur(gray, (ksize, ksize))
    elif filt_idx == 2: # Sharpen
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        return cv2.filter2D(gray, -1, kernel)
    elif filt_idx == 3: # Sobel X
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
        return cv2.convertScaleAbs(sobelx)
    elif filt_idx == 4: # Sobel Y
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)
        return cv2.convertScaleAbs(sobely)
    elif filt_idx == 5: # Laplacian
        lap = cv2.Laplacian(gray, cv2.CV_64F, ksize=ksize)
        return cv2.convertScaleAbs(lap)

# ... (resto del código main y update)
```

---

## 📊 Resultados Visuales

![Demostración de Ojos Digitales](./result/ojos_digitales%20.gif)

---

## 🧩 Prompts Usados


* Muéstrame cómo cargar una imagen en OpenCV, convertirla a escala de grises y visualizarla con matplotlib. También quiero que el código funcione en Google Colab
  
* Explícame cómo aplicar filtros de desenfoque (blur) y enfoque (sharpen) con OpenCV y Numpy sobre una imagen en escala de grises. Quiero ver el resultado comparando la imagen original, la desenfocada y la mejorada
* Dame un ejemplo en Python donde se apliquen filtros de Sobel en X y Y, así como el filtro Laplaciano, para detectar bordes en una imagen. Quiero comparar los tres resultados visualmente usando subplots con matplotlib.
---

## 💬 Reflexión Final

Con este taller reforcé mi comprensión sobre cómo funciona la visión artificial y cómo los computadores procesan imágenes en escala de grises. Aprendí a utilizar OpenCV para aplicar filtros como el blur y sharpen, así como a detectar bordes usando Sobel y Laplaciano. Además, entendí mejor cómo se combinan los arrays (kernels) con las imágenes para resaltar ciertas características visuales, como los contornos.
