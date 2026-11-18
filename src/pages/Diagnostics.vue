<script setup lang="ts">
import { computed, ref, shallowRef } from 'nativescript-vue'
import { Utils } from '@nativescript/core'
import { router } from '../router'
import JourneyHeader from '../components/JourneyHeader.vue'
const capture = shallowRef(router.diagnostics?.recording())
const index = ref(0)
const copied = ref(false)
const records = computed(() => capture.value?.records ?? [])
const current = computed(() => records.value[index.value])
const detail = computed(() => {
  const record = current.value
  if (!record) return 'Navegue pelo app e atualize a captura.'
  if (record.kind === 'event')
    return `${record.event.operation ?? record.event.phase} · ${record.event.status}\n${record.event.route ?? 'Evento de navegação'}\n${record.event.outcome ?? ''}`
  if (record.kind === 'gap') return `Lacuna na captura: ${record.reason}`
  return JSON.stringify(record.snapshot, null, 2)
})
function refresh() {
  router.diagnostics?.checkpoint()
  capture.value = router.diagnostics?.recording()
  index.value = Math.max(0, records.value.length - 1)
  copied.value = false
}
function copy() {
  Utils.copyToClipboard(JSON.stringify(capture.value, null, 2))
  copied.value = true
}
refresh()
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page"
    ><GridLayout rows="auto, *, auto">
      <JourneyHeader title="Registro de navegação" />
      <ScrollView row="1"
        ><StackLayout class="feed" paddingTop="8">
          <Label class="status-tag" text="FERRAMENTA DO DEMO · EXPERIMENTAL" />
          <Label class="page-title" text="Veja o caminho percorrido" textWrap="true" />
          <Label
            class="body-copy"
            text="Esta é uma captura dos eventos observados. Avançar aqui não navega no app nem executa suas ações outra vez."
            textWrap="true"
          />
          <GridLayout columns="*, *" class="details-box"
            ><StackLayout
              ><Label
                :text="String(records.length)"
                fontSize="28"
                fontWeight="700" /><Label
                text="registros capturados"
                class="muted"
                fontSize="12" /></StackLayout
            ><StackLayout col="1"
              ><Label
                :text="`${Math.round((capture?.retainedBytes ?? 0) / 1024)} KB`"
                fontSize="28"
                fontWeight="700" /><Label
                text="buffer limitado"
                class="muted"
                fontSize="12" /></StackLayout
          ></GridLayout>
          <Label
            :text="`${index + 1} / ${records.length} · ${current?.kind ?? 'vazio'}`"
            fontWeight="600"
            marginBottom="12"
          />
          <TextView
            :text="detail"
            editable="false"
            height="260"
            class="record-detail"
            accessibilityLabel="Detalhes do registro"
          />
          <GridLayout columns="*, *" marginTop="12"
            ><Button
              text="← Anterior"
              class="outline-button"
              marginRight="6"
              :isEnabled="index > 0"
              @tap="index--" /><Button
              col="1"
              text="Próximo →"
              class="outline-button"
              marginLeft="6"
              :isEnabled="index < records.length - 1"
              @tap="index++"
          /></GridLayout>
          <Label
            :text="`${capture?.droppedRecords ?? 0} registros removidos pelo limite. Parâmetros, mensagens e dados pessoais não entram na captura.`"
            class="prototype-note"
            textWrap="true"
          />
          <Button
            :text="copied ? 'JSON copiado ✓' : 'Copiar JSON para o visualizador'"
            class="text-button"
            @tap="copy"
          /> </StackLayout
      ></ScrollView>
      <StackLayout row="2" class="bottom-actions"
        ><Button text="Atualizar captura" class="primary" marginTop="0" @tap="refresh"
      /></StackLayout> </GridLayout
  ></Page>
</template>
