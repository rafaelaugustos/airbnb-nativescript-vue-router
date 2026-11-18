<script setup lang="ts">
import { computed } from 'nativescript-vue'
import { stays } from '../data'
import { confirmedTrips, invitationRead } from '../travel-state'
import { openDestination, openingDestination } from '../navigation'
const hosts = computed(() =>
  [...new Set(['serra', ...confirmedTrips.value.map((p) => p.stayId)])].map((id) =>
    stays.find((s) => s.id === id)!,
  ),
)
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page"
    ><ScrollView
      ><StackLayout class="feed">
        <Label class="page-title" text="Mensagens" />
        <Label
          class="body-copy"
          text="Toda boa viagem começa com uma conversa."
          textWrap="true"
          marginBottom="24"
        />
        <StackLayout class="invitation-card">
          <GridLayout columns="32, *"
            ><Label class="icon" text="&#xe7f4;" color="#ff385c" fontSize="24" /><Label
              col="1"
              :text="invitationRead ? 'SEU CONVITE' : 'UM CONVITE PARA VOCÊ'"
              class="eyebrow"
              verticalAlignment="middle"
          /></GridLayout>
          <Label
            text="A serra está chamando"
            class="section-heading"
            marginTop="16"
            textWrap="true"
          />
          <Label
            text="Marina separou um chalé com vista para sua próxima pausa. Abra o convite e planeje os detalhes."
            class="body-copy"
            textWrap="true"
            marginTop="12"
          />
          <Button
            class="primary"
            text="Abrir convite"
            :isEnabled="!openingDestination"
            @tap="openDestination('/trips/serra', 'notification')"
          />
        </StackLayout>
        <Label
          class="section-heading"
          text="Seus anfitriões"
          marginTop="30"
          marginBottom="12"
        />
        <GridLayout
          v-for="host in hosts"
          :key="host.id"
          columns="56, *"
          class="message-row"
          @tap="openDestination(`/messages/${host.id}`)"
          accessible="true"
          accessibilityRole="button"
          :accessibilityLabel="`Conversar com ${host.host}`"
        >
          <Label
            :text="host.initials"
            class="avatar"
            width="52"
            height="52"
            fontSize="18"
          />
          <StackLayout col="1" marginLeft="16"
            ><Label :text="host.host" fontWeight="700" /><Label
              :text="host.location"
              class="muted"
              fontSize="12"
              marginTop="4" /><Label
              text="Separei algumas dicas para sua chegada…"
              class="muted"
              fontSize="13"
              marginTop="7"
          /></StackLayout>
        </GridLayout>
        <Label
          class="prototype-note"
          text="Convite e conversas de demonstração. As mensagens não são enviadas a pessoas reais."
          textWrap="true"
        /> </StackLayout></ScrollView
  ></Page>
</template>
