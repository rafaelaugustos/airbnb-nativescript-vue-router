<script setup lang="ts">
import { ref } from 'nativescript-vue'
import { Dialogs } from '@nativescript/core'
import { NavigationFailureType, useRouter } from 'vue-router-ns'
import { router as appRouter } from '../router'
import {
  session,
  signOut,
  traveler,
  preparationEnabled,
  confirmedTrips,
} from '../travel-state'
import { selectedTab } from '../store'
const router = useRouter()
const busy = ref(false)
async function exit() {
  if (busy.value) return
  busy.value = true
  try {
    for (const frame of ['trips', 'messages']) {
      const failure = await appRouter.backToRoot({ frame, animated: false })
      if (failure && failure.type !== NavigationFailureType.duplicated) return
    }
    signOut()
    appRouter.clearPreloads()
  } catch {
    await Dialogs.alert({
      title: 'Não foi possível sair',
      message: 'Conclua a edição da viagem e tente novamente.',
      okButtonText: 'Entendi',
    })
  } finally {
    selectedTab.value = 'profile'
    busy.value = false
  }
}
function togglePreparation(value: boolean) {
  preparationEnabled.value = value
  if (!value) appRouter.clearPreloads()
}
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page"
    ><ScrollView
      ><StackLayout class="feed">
        <Label class="page-title" text="Perfil" />
        <StackLayout class="profile-card">
          <Label
            class="avatar profile-avatar"
            :text="session ? traveler.slice(0, 2).toUpperCase() : 'Oi'"
          />
          <Label
            :text="session ? traveler : 'Seu próximo destino espera'"
            fontSize="25"
            fontWeight="700"
            textAlignment="center"
            textWrap="true"
            marginTop="18"
          />
          <Label
            :text="
              session
                ? `${confirmedTrips.length} ${confirmedTrips.length === 1 ? 'viagem' : 'viagens'} no demo · Viajante`
                : 'Entre para guardar seus planos de viagem.'
            "
            class="muted"
            textAlignment="center"
            textWrap="true"
            marginTop="10"
          />
          <Button
            v-if="!session"
            text="Entrar no demo"
            class="primary"
            @tap="router.pushForResult('/login')"
          />
        </StackLayout>
        <Label class="section-heading" text="Do seu jeito" marginTop="28" />
        <GridLayout columns="*, auto" class="line-item"
          ><StackLayout marginRight="16"
            ><Label text="Preparar acomodações" fontWeight="600" /><Label
              class="muted"
              fontSize="12"
              text="Antecipar código e catálogo ao tocar nos cards."
              textWrap="true"
              marginTop="6" /></StackLayout
          ><Switch
            col="1"
            :checked="preparationEnabled"
            @checkedChange="togglePreparation($event.object.checked)"
            accessibilityLabel="Preparar acomodações"
            color="#ff385c"
        /></GridLayout>
        <Button
          text="Ver registro de navegação"
          class="outline-button"
          @tap="router.push('/profile/diagnostics')"
        />
        <Label
          class="prototype-note"
          text="Ferramenta do demo: inspecione o histórico de eventos sem alterar sua navegação."
          textWrap="true"
        />
        <Button
          v-if="session"
          text="Sair da conta de demonstração"
          class="text-button"
          marginTop="24"
          :isEnabled="!busy"
          @tap="exit"
        />
        <Label
          class="prototype-note"
          :text="'Airbnb NS · vue-router-ns 0.1.0\nProjeto independente com acomodações fictícias.'"
          textAlignment="center"
          textWrap="true"
          marginTop="32"
        /> </StackLayout></ScrollView
  ></Page>
</template>
