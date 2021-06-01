import { ref, unref, computed, watch, onMounted } from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';

type DropType = 'brush' | 'eraser';

export default function useDrawBoard() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const dropType = ref<DropType>('brush');
  const lineWidth = ref(14);
  const eraserWidth = ref(14);
  const eraserEnabled = ref(false);

  const setCanvasSize = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetWidth * 2;
  }

  const initCanvas = () => {
    const canvas = unref(canvasRef);
    if (canvas) {
      const ctx = canvas.getContext('2d')!;

      let sCoord: number[] = [];
      let isTouchMove = false;

      setCanvasSize(canvas);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const rect = canvas.getBoundingClientRect();
      const radio = canvasWidth / rect.width;

      // style
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // event
      useResizeObserver(canvas, () => {
        setCanvasSize(canvas);
      });

      useEventListener(canvas, 'touchstart', (event: TouchEvent) => {
        const touch = event.touches[0];
        isTouchMove = false;
        sCoord = [touch.pageX - rect.left, touch.pageY - rect.top];
        ctx.beginPath();
        event.preventDefault();
      });

      useEventListener(canvas, 'touchmove', (event: TouchEvent) => {
        if (sCoord.length && lineWidth.value !== 0) {
          const touch = event.touches[0];
          isTouchMove = true;
          const mCoord = [touch.pageX - rect.left, touch.pageY - rect.top];
          ctx.strokeStyle = '#000';
          ctx.lineWidth = unref(eraserEnabled) ? eraserWidth.value : lineWidth.value;
          ctx.lineTo(mCoord[0] * radio, mCoord[1] * radio);
          ctx.stroke();
          event.preventDefault();
        }
      });

      useEventListener(canvas, 'touchend', (event: TouchEvent) => {
        if (sCoord.length) {
          if (!isTouchMove) {
            ctx.moveTo(sCoord[0] * radio, sCoord[1] * radio);
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(sCoord[0] * radio, sCoord[1] * radio, unref(eraserEnabled) ? eraserWidth.value : lineWidth.value / 2, 0, 2 * Math.PI);
            ctx.fill();
          }
          sCoord = [];
          isTouchMove = false;
          event.preventDefault();
        }
      });
    }
  }

  const updateLineWidth = (value: number) => lineWidth.value = value;

  const updateEraserWidth = (value: number) => eraserWidth.value = value;

  const toDataURL = () => canvasRef.value?.toDataURL('image/png', 1);

  const clearCanvas = () => {
    const canvas = unref(canvasRef);
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  watch(dropType, (type) => {
    const canvas = unref(canvasRef);
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      if (type === 'brush') {
        eraserEnabled.value = false;
        ctx.globalCompositeOperation = 'source-over';
      } else {
        eraserEnabled.value = true;
        ctx.globalCompositeOperation = 'destination-out';
      }
    }
  });

  onMounted(() => {
    initCanvas();
  });

  return {
    canvasRef,
    dropType,
    lineWidth,
    eraserWidth,
    updateLineWidth,
    updateEraserWidth,
    toDataURL,
    clearCanvas
  }
}