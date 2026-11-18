<script setup lang="ts">
import { computed } from 'nativescript-vue'
import { useRoute, useRouter } from 'vue-router-ns'
import JourneyHeader from '../components/JourneyHeader.vue'
import { stays } from '../data'
import { tripFor } from '../travel-state'
import { openDestination } from '../navigation'
import { money } from '../utils/stays'
const route = useRoute()
const router = useRouter()
const stay = computed(() => stays.find((s) => s.id === String(route.params.id)))
const plan = computed(() => tripFor(String(route.params.id)))
async function edit() {
  await router.pushForResult(`/trips/${route.params.id}/edit`)
}
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page">
    <GridLayout rows="auto, *, auto">
      <JourneyHeader title="Sua viagem" />
      <ScrollView row="1"
        ><StackLayout v-if="stay" padding="0 24 24">
          <Image
            :src="stay.image"
            height="230"
            stretch="aspectFill"
            borderRadius="20"
          />
          <Label
            class="status-tag"
            :text="plan.confirmed ? 'CONFIRMADA NO DEMO' : 'SEU PRÓXIMO DESTINO'"
            marginTop="24"
          />
          <Label
            class="page-title"
            :text="stay.title"
            textWrap="true"
            marginTop="10"
            marginBottom="8"
          />
          <Label class="muted" :text="stay.location" textWrap="true" />
          <GridLayout columns="*, *" class="details-box">
            <StackLayout
              ><Label class="eyebrow" text="QUANDO" /><Label
                :text="plan.dates"
                fontWeight="600"
                marginTop="8"
            /></StackLayout>
            <StackLayout col="1"
              ><Label class="eyebrow" text="QUEM VAI" /><Label
                :text="`${plan.guests} ${plan.guests === 1 ? 'hóspede' : 'hóspedes'}`"
                fontWeight="600"
                marginTop="8"
            /></StackLayout>
          </GridLayout>
          <GridLayout columns="*, auto" class="line-item"
            ><Label text="Detalhes da viagem" fontWeight="600" /><Button
              col="1"
              text="Editar"
              class="text-button"
              height="30"
              accessibilityLabel="Editar viagem"
              @tap="edit"
          /></GridLayout>
          <Label
            v-if="plan.note"
            :text="plan.note"
            textWrap="true"
            class="body-copy"
            marginBottom="16"
          />
          <GridLayout
            columns="48, *"
            class="host-card"
            @tap="openDestination(`/messages/${stay.id}`)"
            accessible="true"
            accessibilityRole="button"
            accessibilityLabel="Conversar com anfitrião"
          >
            <Label class="avatar" :text="stay.initials" /><StackLayout
              col="1"
              marginLeft="14"
              ><Label :text="`Seu anfitrião, ${stay.host}`" fontWeight="600" /><Label
                text="Envie uma mensagem"
                class="muted"
                marginTop="5"
            /></StackLayout>
          </GridLayout>
          <Button
            text="Ver acomodação"
            class="outline-button"
            @tap="router.push(`/stays/${stay.id}`)"
          />
          <Label
            class="prototype-note"
            text="Uma viagem fictícia para explorar o app. Sem cobrança ou reserva real."
            textWrap="true"
          /> </StackLayout
        ><StackLayout v-else class="feed"
          ><Label text="Viagem não encontrada" /></StackLayout
      ></ScrollView>
      <GridLayout
        v-if="stay && !plan.confirmed"
        row="2"
        columns="*, 160"
        class="bottom-actions"
      >
        <StackLayout verticalAlignment="middle"
          ><Label
            :text="money(stay.price * plan.nights)"
            fontSize="19"
            fontWeight="700" /><Label
            :text="`${plan.nights} noites · total`"
            class="muted"
        /></StackLayout>
        <Button
          col="1"
          class="primary"
          text="Revisar reserva"
          marginTop="0"
          @tap="router.push(`/trips/${stay.id}/reserve`)"
        />
      </GridLayout>
    </GridLayout>
  </Page>
</template>
