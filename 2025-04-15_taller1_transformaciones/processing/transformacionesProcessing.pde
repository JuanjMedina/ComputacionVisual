// Processing Sketch: Cubo animado con transformaciones
void setup() {
  size(600, 600, P3D);  // Ventana 3D de 600x600 píxeles
}

void draw() {
  background(50);  // Fondo gris oscuro
  lights();        // Iluminación básica para visualizar el volumen 3D
  
  // Centrar el origen de coordenadas
  translate(width / 2, height / 2, 0);
  
  // Aislar transformaciones para el cubo
  pushMatrix();
  
  // Calcular tiempo y valores para las transformaciones
  float tiempoSegundos = millis() / 1000.0;
  
  // Traslación ondulada en eje X
  float amplitudOnda = 100.0;
  float frecuenciaOnda = 1.5;
  translate(amplitudOnda * sin(tiempoSegundos * frecuenciaOnda), 0, 0);
  
  // Rotación continua sobre ejes Y y X
  float velocidadRotacion = 0.01;
  rotateY(frameCount * velocidadRotacion);
  rotateX(frameCount * velocidadRotacion * 0.7);
  
  // Escalado cíclico entre 50% y 150%
  float frecuenciaEscala = 0.8;
  float factorEscala = (cos(tiempoSegundos * frecuenciaEscala) + 1) * 0.5 + 0.5;
  scale(factorEscala);
  
  // Dibujar el cubo
  fill(100, 150, 250);
  stroke(255);
  strokeWeight(1);
  box(80);
  
  // Restaurar sistema de coordenadas original
  popMatrix();
}