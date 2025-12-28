# Medidor de Decibelios - Instrucciones de Implementación

## Archivos Modificados/Creados

1. **DecibelMeter.tsx** - Nuevo componente para el medidor de decibelios
2. **MediaPanel.tsx** - Componente actualizado que incluye el medidor

## Pasos para Implementar

### Paso 1: Copiar los archivos
Reemplaza los siguientes archivos en tu proyecto:

- Copia `DecibelMeter.tsx` a `src/components/DecibelMeter.tsx`
- Reemplaza `src/components/MediaPanel.tsx` con el nuevo archivo

### Paso 2: Cómo Funciona

El medidor de decibelios se activa/desactiva presionando la tecla **M** en tu teclado.

**Características:**
- ✅ Se sobrepone sobre la imagen en el video-box
- ✅ Fondo negro con 50% de transparencia
- ✅ Número de decibelios en blanco, grande y centrado
- ✅ Muestra "dB" debajo del número
- ✅ Solicita permisos de micrófono automáticamente
- ✅ Se desactiva completamente al presionar M de nuevo

### Paso 3: Controles del Teclado

Tu aplicación ahora tiene los siguientes controles:

| Tecla | Función |
|-------|---------|
| **Enter** | Generar siguiente número de bingo |
| **L** | Activar/desactivar "LÍNIA CANTADA" |
| **Q** | Activar/desactivar "HAN CANTAT QUINA" |
| **M** | Activar/desactivar medidor de decibelios |

### Paso 4: Permisos del Navegador

La primera vez que presiones **M**, el navegador te pedirá permiso para acceder al micrófono:

1. Haz clic en "Permitir" cuando aparezca el mensaje
2. El medidor comenzará a funcionar inmediatamente
3. Si niegas el permiso, aparecerá una alerta explicando el problema

### Paso 5: Visualización

Cuando el medidor está activo:
- Verás una capa negra transparente sobre la imagen
- El número de decibelios se actualiza en tiempo real
- El rango va de 0 a 100 dB (aproximado)
- El medidor detecta el volumen del ambiente captado por el micrófono

## Notas Técnicas

### Cómo se Calculan los Decibelios

El componente utiliza la Web Audio API del navegador para:
1. Capturar el audio del micrófono
2. Analizar las frecuencias en tiempo real
3. Calcular el valor RMS (Root Mean Square)
4. Convertir a una escala de decibelios aproximada (0-100 dB)

### Compatibilidad

El componente es compatible con:
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari (puede requerir HTTPS)
- ⚠️ Requiere HTTPS en producción (excepto localhost)

## Solución de Problemas

### El navegador no me pide permisos
- Asegúrate de estar en HTTPS (o localhost para desarrollo)
- Revisa la configuración de permisos del navegador para el sitio

### No se muestra el medidor
- Presiona la tecla **M** para activarlo
- Verifica que hayas permitido el acceso al micrófono
- Abre la consola del navegador (F12) para ver posibles errores

### Los decibelios no cambian
- Verifica que el micrófono esté funcionando correctamente
- Prueba hacer ruido cerca del micrófono
- Comprueba que el navegador tiene permisos para usar el micrófono

## Personalización

Si quieres ajustar la apariencia del medidor, edita estos estilos en `DecibelMeter.tsx`:

```typescript
// Fondo (actualmente: negro 50% transparente)
className="... bg-black bg-opacity-50 ..."

// Tamaño del número (actualmente: 8xl)
className="text-8xl ..."

// Tamaño del texto "dB" (actualmente: 3xl)
className="text-3xl ..."
```

## ¿Necesitas Ayuda?

Si tienes problemas o dudas, verifica:
1. Que los archivos estén en las ubicaciones correctas
2. Que el navegador tenga permisos de micrófono
3. Que estés usando HTTPS (en producción)
