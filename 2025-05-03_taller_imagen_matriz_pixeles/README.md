🧪 De Pixels a Coordenadas

📅 Fecha
2025-05-03 – Fecha de realización

🎯 Objetivo del Taller
Describe brevemente el objetivo del taller: ¿qué se pretende explorar, aplicar o construir?

🧠 Conceptos Aprendidos

- Representación de imágenes digitales como matrices numéricas multidimensionales.
- Manipulación de regiones específicas de la imagen mediante slicing de matrices.
- Separación y visualización de canales de color (RGB y HSV).
- Cálculo y visualización de histogramas de intensidad para análisis de brillo y color.
- Ajuste manual y automático de brillo y contraste utilizando ecuaciones y funciones de OpenCV.
  Creación de interfaces básicas con sliders interactivos usando cv2.createTrackbar() para modificar parámetros en tiempo real.

🔧 Herramientas y Entornos
Especifica los entornos usados:

- Python (opencv-python, numpy, matplotlib)
- Jupyter / Google Colab (Inferido por el archivo .ipynb)

📁 Estructura del Proyecto

`2025-05-03_taller_imagen_matriz_pixeles/`
├── `images/` # Imágenes de entrada utilizadas
├── `python/` # Notebook o scripts de Python
├── `result/` # Resultados generados (GIF)
└── `README.md` # Este archivo

🧪 Implementación

🔹 Etapas realizadas

1.  **Carga y Preparación:** Carga de una imagen desde archivo usando `cv2.imread` y conversión del espacio de color BGR a RGB.
2.  **Análisis de Canales:** Separación y visualización de los canales R, G, B y H, S, V individualmente. Se muestran tanto en escala de grises como con representaciones coloreadas/mejoradas.
3.  **Manipulación de Regiones (Slicing):**
    - Se colorea un área rectangular específica de azul.
    - Se copia una subregión (esquina superior izquierda) y se pega en otra ubicación (cerca de la esquina inferior derecha).
4.  **Análisis de Histograma:** Cálculo y visualización de los histogramas de intensidad para los canales RGB combinados y para la versión en escala de grises de la imagen.
5.  **Ajuste Interactivo:** Creación de una ventana de OpenCV con trackbars (sliders) para modificar dinámicamente los parámetros alfa (contraste) y beta (brillo) de la imagen usando `cv2.convertScaleAbs`. La imagen se actualiza en tiempo real según la posición de los sliders.
6.  **Visualización:** Uso de `matplotlib.pyplot` para mostrar imágenes estáticas y `cv2.imshow` para la ventana interactiva.

🔹 Código relevante

```python
# --- Bonus: Interactive Brightness and Contrast Adjustment with cv2.createTrackbar ---
# Global image for callback function
img_to_show = orig_bgr.copy()

def update_brightness_contrast(val):
    """Callback to update the image based on trackbars."""
    global img_to_show
    brightness = cv2.getTrackbarPos('Brightness', 'Brightness/Contrast Adjustment') - 100
    contrast = cv2.getTrackbarPos('Contrast', 'Brightness/Contrast Adjustment') / 10.0
    if contrast == 0: contrast = 0.1 # Avoid division by zero or invalid scale

    # Apply adjustment using cv2.convertScaleAbs
    adjusted_img = cv2.convertScaleAbs(orig_bgr.copy(), alpha=contrast, beta=brightness)
    img_to_show = adjusted_img
    cv2.imshow('Brightness/Contrast Adjustment', img_to_show)

# Create window and trackbars
cv2.namedWindow('Brightness/Contrast Adjustment')
cv2.createTrackbar('Brightness', 'Brightness/Contrast Adjustment', 100, 200, update_brightness_contrast) # Range 0-200 -> beta -100 to 100
cv2.createTrackbar('Contrast', 'Brightness/Contrast Adjustment', 10, 30, update_brightness_contrast) # Range 1-30 -> alpha 0.1 to 3.0

update_brightness_contrast(0) # Initial display

while True:
    # ... (wait key logic) ...
    if key == 27: break # ESC key

cv2.destroyAllWindows()
```

📊 Resultados Visuales

\_
![Ajuste Interactivo](./result/matrix_pixels.gif)

🧩 Prompts Usados

- Visualiza por separado los canales RGB y HSV de una imagen usando OpenCV.
- Aplica un cambio de color a una región rectangular específica de la imagen usando slicing en NumPy.
- Genera un histograma de brillo de una imagen en escala de grises con matplotlib.
- Crea sliders interactivos en OpenCV para modificar brillo y contraste de una imagen en tiempo real.
- Ayudame a dejar los comentarios mas significativos en el codigo y traducelos al ingles.

💬 Reflexión Final

- Este taller me permitió comprender en profundidad cómo una imagen digital no es más que una matriz de números, donde cada píxel tiene valores específicos que podemos manipular directamente. Reforcé el uso de NumPy para operar sobre regiones específicas y cómo OpenCV facilita la visualización y transformación de imágenes en tiempo real. Me pareció particularmente valioso ver cómo operaciones simples como slicing pueden producir cambios visuales importantes sin necesidad de algoritmos complejos.

****