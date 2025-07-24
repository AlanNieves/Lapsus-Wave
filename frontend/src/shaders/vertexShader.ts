const vertexShader = `
// vertexShader.glsl
varying vec2 vertexUV;
varying vec3 vertexNormal;

varying float x;
varying float y;
varying float z;
varying vec3 vUv;
varying float amplitude;

uniform float u_time;
uniform float u_amplitude;
uniform float[64] u_data_arr;

void main() {
  vUv = position;
  vertexUV = uv;
  vertexNormal = normal;

  amplitude = u_amplitude;

  float xi = abs(position.x);
  float yi = abs(position.y);

  // Convertimos a índices de arreglo
  float fx = floor(clamp(xi, 0.0, 63.0));
  float fy = floor(clamp(yi, 0.0, 63.0));
  int indexX = int(fx);
  int indexY = int(fy);

  // Obtenemos datos de frecuencia
  float audioX = u_data_arr[indexX];
  float audioY = u_data_arr[indexY];

  // Normalizamos y combinamos
  float intensity = (audioX + audioY) / 512.0; // 255 + 255 = 510 máx

  // Modulación con seno para ondulación
  z = sin(u_time + position.x * 0.3 + position.y * 0.3) * intensity * amplitude;

  x = position.x;
  y = position.y;

  // Deformación
  vec3 newPosition = vec3(position.x, position.y, z);
  
  // Tamaño variable para puntos (si usas Points)
  gl_PointSize = clamp(pow(z * 10.0, 2.0), 2.0, 7.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}


`;
export default vertexShader;