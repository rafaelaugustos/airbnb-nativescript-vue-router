<script setup lang="ts">
import { ref } from 'nativescript-vue'
import { useRouter, useRoute } from 'vue-router-ns'
import { signIn, traveler } from '../travel-state'
import { openDestination } from '../navigation'
withDefaults(defineProps<{ reason?: string }>(), {
  reason: 'Que bom ter você por aqui',
})
const router = useRouter()
const route = useRoute()
const name = ref(traveler.value)
const busy = ref(false)
async function enter() {
  if (busy.value) return
  busy.value = true
  signIn(name.value)
  const next = route.query.next
  await router.back({ result: true })
  if (typeof next === 'string' && /^\/(trips|messages)\//.test(next))
    await openDestination(next)
  busy.value = false
}
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page">
    <ScrollView>
      <StackLayout padding="28">
        <Button
          class="icon close-button"
          text="&#xe5cd;"
          horizontalAlignment="left"
          accessibilityLabel="Cancelar login"
          @tap="router.back()"
        />
        <Label class="icon login-mark" text="&#xeb3f;" />
        <Label class="eyebrow" text="UM NOVO LUGAR PARA CHAMAR DE SEU" />
        <Label class="page-title" :text="reason" textWrap="true" />
        <Label
          class="body-copy"
          text="Entre para organizar seus planos, conversar com anfitriões e continuar de onde parou."
          textWrap="true"
        />
        <Label
          text="Como podemos chamar você?"
          fontWeight="600"
          marginTop="30"
          marginBottom="10"
        />
        <TextField
          v-model="name"
          class="form-field"
          hint="Seu nome"
          maxLength="40"
          accessibilityLabel="Seu nome"
          returnKeyType="done"
          @returnPress="enter"
        />
        <Button
          class="primary"
          text="Entrar e continuar"
          :isEnabled="!busy"
          @tap="enter"
        />
        <Label
          class="prototype-note"
          text="Conta de demonstração neste aparelho. Não pedimos senha e nenhuma reserva real será feita."
          textWrap="true"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
