<template>
  <van-field label="操作">
    <template #input>
      <van-radio-group v-model="dropType" direction="horizontal">
        <van-radio name="brush">画笔</van-radio>
        <van-radio name="eraser">橡皮擦</van-radio>
      </van-radio-group>
    </template>
  </van-field>
  <van-field label="画笔宽度">
    <template #input>
      <van-slider v-model="lineWidth" />
    </template>
  </van-field>
  <van-field label="橡皮擦宽度">
    <template #input>
      <van-slider v-model="eraserWidth" />
    </template>
  </van-field>
  <div class="cavnas-container">
    <canvas ref="canvasRef" width="710" height="710"></canvas>
  </div>
  <div>
    <van-button style="margin: 10px; 10px;" @click="clearCanvas">重画</van-button>
    <van-button @click="handletoDataURL">导出图片</van-button>
  </div>
  <div>
    <van-button style="margin: 10px; 10px;" @click="updateLineWidth(24)">更新画笔宽度</van-button>
    <van-button @click="updateEraserWidth(24)">更新橡皮擦宽度</van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RadioGroup, Radio, Slider, Field, Button, Notify } from 'vant';
import useDrawBoard from '@/composables/useDrawBoard';

export default defineComponent({
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Slider.name]: Slider,
    [Field.name]: Field,
    [Button.name]: Button
  },
  setup() {
    const {
      canvasRef,
      dropType,
      lineWidth,
      eraserWidth,
      clearCanvas,
      toDataURL,
      updateLineWidth,
      updateEraserWidth
    } = useDrawBoard();

    const handletoDataURL = () => {
      Notify({
        type: 'primary',
        message: '请在控制台查看打印结果'
      });
      console.log(toDataURL());
    }

    return {
      canvasRef,
      dropType,
      lineWidth,
      eraserWidth,
      clearCanvas,
      updateLineWidth,
      updateEraserWidth,
      handletoDataURL
    }
  }
})
</script>

<style>
.cavnas-container {
  position: relative;
  padding: 10px;
}

canvas {
  width: 100%;
}
</style>