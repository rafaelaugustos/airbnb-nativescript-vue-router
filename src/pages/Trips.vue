<script setup lang="ts">
import { computed } from 'nativescript-vue'
import { stays } from '../data'
import { confirmedTrips, session, traveler } from '../travel-state'
import { openDestination, openingDestination } from '../navigation'
const upcoming = computed(() =>
  confirmedTrips.value.map((plan) => ({
    plan,
    stay: stays.find((s) => s.id === plan.stayId)!,
  })),
)
const invitation = stays.find((s) => s.id === 'serra')!
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page">
    <ScrollView
      ><StackLayout class="feed">
        <Label class="page-title" text="Viagens" />
        <Label
          class="body-copy"
          :text="
            session
              ? `${traveler}, sua próxima história começa aqui.`
              : 'Encontre seu próximo lugar no mundo.'
          "
          textWrap="true"
          marginBottom="24"
        />
        <StackLayout
          v-for="item in upcoming"
          :key="item.plan.stayId"
          class="journey-card"
          @tap="openDestination(`/trips/${item.plan.stayId}`)"
          accessible="true"
          :accessibilityLabel="`Ver viagem ${item.stay.title}`"
          accessibilityRole="button"
        >
          <Image :src="item.stay.image" height="190" stretch="aspectFill" />
          <StackLayout padding="20">
            <Label class="status-tag" text="CONFIRMADA NO DEMO" />
            <Label class="section-heading" :text="item.stay.location" textWrap="true" />
            <Label
              class="muted"
              :text="`${item.plan.dates} · ${item.plan.guests} ${item.plan.guests === 1 ? 'hóspede' : 'hóspedes'}`"
              marginTop="10"
            />
          </StackLayout>
        </StackLayout>
        <StackLayout v-if="!upcoming.length" class="journey-card">
          <Image :src="invitation.image" height="230" stretch="aspectFill" />
          <StackLayout padding="22">
            <Label class="eyebrow" text="SUA PRÓXIMA PAUSA" />
            <Label
              class="section-heading"
              text="Um refúgio nas montanhas"
              textWrap="true"
              marginTop="10"
            />
            <Label
              class="body-copy"
              text="Dias tranquilos, café com vista e um chalé só para você."
              textWrap="true"
              marginTop="12"
            />
            <Button
              class="primary"
              text="Planejar minha viagem"
              :isEnabled="!openingDestination"
              @tap="openDestination('/trips/serra', 'invitation')"
            />
          </StackLayout>
        </StackLayout>
        <Label
          class="prototype-note"
          text="Suas viagens de demonstração ficam salvas neste aparelho."
          textWrap="true"
        /> </StackLayout
    ></ScrollView>
  </Page>
</template>
