import cv2
import numpy as np
import os

# Path to images directory (relative to this script)
script_dir = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.abspath(os.path.join(script_dir, '..', 'images'))

# Supported image extensions
valid_exts = ('.png', '.jpg', '.jpeg', '.bmp', '.tiff')
# Gather and sort image filenames
images = sorted([f for f in os.listdir(image_dir) if f.lower().endswith(valid_exts)])

if not images:
    print(f"No images found in {image_dir}")
    exit(1)

# Filter names for display
filter_names = ['Grayscale', 'Blur', 'Sharpen', 'Sobel X', 'Sobel Y', 'Laplacian']
# Global webcam capture
cap = None

def apply_filter(gray, filt_idx, ksize):
    if filt_idx == 0:
        return gray
    elif filt_idx == 1:
        return cv2.blur(gray, (ksize, ksize))
    elif filt_idx == 2:
        # Sharpening kernel
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        return cv2.filter2D(gray, -1, kernel)
    elif filt_idx == 3:
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
        return cv2.convertScaleAbs(sobelx)
    elif filt_idx == 4:
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)
        return cv2.convertScaleAbs(sobely)
    elif filt_idx == 5:
        lap = cv2.Laplacian(gray, cv2.CV_64F, ksize=ksize)
        return cv2.convertScaleAbs(lap)

# Callback for trackbars
def update(_=None):
    # Check webcam mode
    webcam_mode = cv2.getTrackbarPos('Webcam', 'Carousel') == 1
    if webcam_mode:
        ret, color = cap.read()
        if not ret:
            return
    else:
        img_idx = cv2.getTrackbarPos('Image', 'Carousel')
        path = os.path.join(image_dir, images[img_idx])
        color = cv2.imread(path)
    # Get filter and kernel settings
    filt_idx = cv2.getTrackbarPos('Filter', 'Carousel')
    ksize = cv2.getTrackbarPos('Kernel', 'Carousel')
    # Ensure odd and >=1
    ksize = max(1, ksize)
    if ksize % 2 == 0:
        ksize += 1

    gray = cv2.cvtColor(color, cv2.COLOR_BGR2GRAY)

    # Apply selected filter
    output = apply_filter(gray, filt_idx, ksize)

    # Convert to BGR for overlaying text
    display = cv2.cvtColor(output, cv2.COLOR_GRAY2BGR)
    # Overlay image name and filter info
    if not webcam_mode:
        cv2.putText(display, f"Image: {images[img_idx]}", (10, 25), cv2.FONT_HERSHEY_SIMPLEX,
                    0.7, (0, 255, 0), 2)
    cv2.putText(display, f"Filter: {filter_names[filt_idx]}", (10, 55), cv2.FONT_HERSHEY_SIMPLEX,
                0.7, (0, 255, 0), 2)
    cv2.putText(display, f"Kernel: {ksize}", (10, 85), cv2.FONT_HERSHEY_SIMPLEX,
                0.7, (0, 255, 0), 2)
    # Overlay mode
    mode_text = 'Webcam' if webcam_mode else 'Image'
    cv2.putText(display, f"Mode: {mode_text}", (10, 115), cv2.FONT_HERSHEY_SIMPLEX,
                0.7, (0, 255, 0), 2)

    cv2.imshow('Carousel', display)


def main():
    cv2.namedWindow('Carousel', cv2.WINDOW_NORMAL)
    # Initialize webcam capture
    global cap
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Warning: Cannot open webcam. Webcam mode disabled.")
    # Create webcam mode trackbar
    cv2.createTrackbar('Webcam', 'Carousel', 0, 1, update)
    # Create trackbars
    cv2.createTrackbar('Image', 'Carousel', 0, len(images) - 1, update)
    cv2.createTrackbar('Filter', 'Carousel', 0, len(filter_names) - 1, update)
    cv2.createTrackbar('Kernel', 'Carousel', 1, 31, update)

    # Initial display
    update()
    print("Use the sliders to change image, filter, and kernel size. Press ESC to exit.")

    # Event loop
    while True:
        # continuously update display (handles webcam frames)
        update()
        key = cv2.waitKey(30) & 0xFF
        if key == 27:  # ESC key
            break

    # Release resources
    if cap and cap.isOpened():
        cap.release()

    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
