import cv2
import numpy as np
import matplotlib.pyplot as plt

# 1. Cargar la imagen en escala de grises
img = cv2.imread('imagen.jpg', cv2.IMREAD_GRAYSCALE)
if img is None:
    raise FileNotFoundError("No se encontró 'imagen.jpg' en el directorio actual.")

# 2. Implementar convolución 2D manual
def convolve2d_manual(image, kernel):
    kh, kw = kernel.shape
    pad_h = kh // 2
    pad_w = kw // 2
    # Padding de la imagen
    padded = np.pad(image, ((pad_h, pad_h), (pad_w, pad_w)), mode='reflect')
    output = np.zeros_like(image, dtype=np.float32)
    # Convolución manual
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            region = padded[i:i+kh, j:j+kw]
            output[i, j] = np.sum(region * kernel)
    # Normalizar si es necesario
    output = np.clip(output, 0, 255)
    return output.astype(np.uint8)

# 3. Definir kernels personalizados
# Enfocar (Sharpen)
kernel_sharpen = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]], dtype=np.float32)

# Suavizado (Blur)
kernel_blur = np.ones((3,3), dtype=np.float32) / 9.0

# Detección de esquinas (Sobel cruzado)
kernel_sobel_x = np.array([[-1, 0, 1],
                           [-2, 0, 2],
                           [-1, 0, 1]], dtype=np.float32)
kernel_sobel_y = np.array([[-1, -2, -1],
                           [0,  0,  0],
                           [1,  2,  1]], dtype=np.float32)
# Esquinas: suma de magnitudes de derivadas cruzadas
def corner_response(image):
    gx = convolve2d_manual(image, kernel_sobel_x)
    gy = convolve2d_manual(image, kernel_sobel_y)
    # Producto cruzado para esquinas
    response = np.abs(gx) * np.abs(gy)
    response = np.clip(response, 0, 255)
    return response.astype(np.uint8)

# 4. Aplicar convolución manual
img_sharpen_manual = convolve2d_manual(img, kernel_sharpen)
img_blur_manual = convolve2d_manual(img, kernel_blur)
img_corner_manual = corner_response(img)

# 5. Aplicar filtros con OpenCV para comparar
img_sharpen_cv = cv2.filter2D(img, -1, kernel_sharpen)
img_blur_cv = cv2.filter2D(img, -1, kernel_blur)
# Para esquinas, combinamos sobel x e y
sobelx_cv = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
sobely_cv = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
img_corner_cv = np.abs(sobelx_cv) * np.abs(sobely_cv)
img_corner_cv = np.clip(img_corner_cv, 0, 255).astype(np.uint8)

# 6. Mostrar resultados en paralelo
titles = [
    'Original',
    'Sharpen Manual', 'Sharpen OpenCV',
    'Blur Manual', 'Blur OpenCV',
    'Esquinas Manual', 'Esquinas OpenCV'
]
images = [
    img,
    img_sharpen_manual, img_sharpen_cv,
    img_blur_manual, img_blur_cv,
    img_corner_manual, img_corner_cv
]

plt.figure(figsize=(14, 8))
for i in range(len(images)):
    plt.subplot(2, 4, i+1)
    plt.imshow(images[i], cmap='gray')
    plt.title(titles[i], fontsize=10)
    plt.axis('off')
plt.tight_layout()
plt.show()

# BONUS: Interfaz interactiva con sliders para modificar el kernel de enfoque
def nothing(x):
    pass

cv2.namedWindow('Sharpen Interactive')
# Crear trackbars para el kernel central y los vecinos
cv2.createTrackbar('Centro', 'Sharpen Interactive', 5, 10, nothing)
cv2.createTrackbar('Lados', 'Sharpen Interactive', 1, 10, nothing)

while True:
    centro = cv2.getTrackbarPos('Centro', 'Sharpen Interactive')
    lados = cv2.getTrackbarPos('Lados', 'Sharpen Interactive')
    # Evitar cero en lados
    lados = max(1, lados)
    # Definir kernel dinámico
    kernel_dynamic = np.array([[0, -lados, 0],
                               [-lados, centro, -lados],
                               [0, -lados, 0]], dtype=np.float32)
    img_sharpen_dynamic = convolve2d_manual(img, kernel_dynamic)
    cv2.imshow('Sharpen Interactive', img_sharpen_dynamic)
    key = cv2.waitKey(1) & 0xFF
    if key == 27:  # ESC para salir
        break

cv2.destroyAllWindows()
