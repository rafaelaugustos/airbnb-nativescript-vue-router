<script setup lang="ts">
import { computed } from 'nativescript-vue'
import type { EventData, View } from '@nativescript/core'
import { useBackHistoryMenu, useRouter } from 'vue-router-ns'
import { stays } from '../data'
defineProps<{ title: string }>()
const router = useRouter()
const canGoBack = computed(() => (router.history.value?.entries.length ?? 0) > 1)
const history = useBackHistoryMenu({
  title: 'Voltar para',
  cancelTitle: 'Continuar aqui',
  label: ({ route }) => {
    if (route.path.endsWith('/edit')) return 'Editar viagem'
    if (route.path.endsWith('/reserve')) return 'Revisar reserva'
    if (route.path === '/trips') return 'Minhas viagens'
    if (route.path === '/messages') return 'Mensagens'
    if (route.path === '/profile') return 'Perfil'
    if (route.path === '/') return 'Explorar'
    return stays.find((stay) => stay.id === route.params.id)?.title ?? 'Acomodação'
  },
})
function showHistory(event: EventData) {
  history.show(event.object as View)
}
</script>
<template>
  <GridLayout columns="44, *, 44" class="journey-header">
    <Button
      v-if="canGoBack"
      class="icon close-button"
      text="&#xe5c4;"
      accessibilityLabel="Voltar"
      @tap="!history.active.value && router.back()"
      @longPress="showHistory"
    />
    <Label
      col="1"
      :text="title"
      class="header-title"
      textAlignment="center"
      verticalAlignment="middle"
    />
    <Button
      v-if="canGoBack"
      col="2"
      class="icon close-button"
      text="&#xe889;"
      accessibilityLabel="Histórico da navegação"
      @tap="showHistory"
    />
  </GridLayout>
</template>
