<script setup lang="ts">
import { computed, ref } from 'nativescript-vue'
import { useRouter } from 'vue-router-ns'
const props = withDefaults(defineProps<{ count?: number; maximum?: number }>(), {
  count: 1,
  maximum: 6,
})
const maximum = computed(() => Math.max(1, Math.min(16, Math.floor(props.maximum))))
const count = ref(Math.max(1, Math.min(maximum.value, Math.floor(props.count))))
const router = useRouter()
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page">
    <GridLayout rows="auto, *, auto" padding="24">
      <StackLayout>
        <Button
          text="&#xe5cd;"
          class="icon close-button"
          horizontalAlignment="left"
          accessibilityLabel="Cancelar hóspedes"
          @tap="router.back()"
        />
        <Label class="page-title" text="Quem vai com você?" textWrap="true" />
        <Label
          class="body-copy"
          :text="`Esta acomodação recebe até ${maximum} hóspedes.`"
          textWrap="true"
        />
      </StackLayout>
      <GridLayout
        row="1"
        columns="*, 44, 50, 44"
        height="48"
        verticalAlignment="middle"
        marginTop="16"
        marginBottom="16"
      >
        <Label text="Hóspedes" fontSize="18" verticalAlignment="middle" />
        <Button
          col="1"
          text="−"
          class="counter-button"
          :isEnabled="count > 1"
          accessibilityLabel="Diminuir hóspedes"
          @tap="count--"
        />
        <Label
          col="2"
          :text="String(count)"
          textAlignment="center"
          verticalAlignment="middle"
          fontSize="20"
          accessibilityLabel="Quantidade de hóspedes"
        />
        <Button
          col="3"
          text="+"
          class="counter-button"
          :isEnabled="count < maximum"
          accessibilityLabel="Aumentar hóspedes"
          @tap="count++"
        />
      </GridLayout>
      <Button
        row="2"
        class="primary"
        text="Salvar hóspedes"
        marginTop="12"
        @tap="router.back({ result: count })"
      />
    </GridLayout>
  </Page>
</template>
