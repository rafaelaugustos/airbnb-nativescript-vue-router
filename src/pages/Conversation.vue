<script setup lang="ts">
import { computed, ref } from 'nativescript-vue'
import { usePageState, useRoute, useRouter } from 'vue-router-ns'
import { stays } from '../data'
import { messages, sendMessage } from '../travel-state'
import JourneyHeader from '../components/JourneyHeader.vue'
const route = useRoute()
const router = useRouter()
const stay = computed(() => stays.find((s) => s.id === String(route.params.id)))
const replies = computed(() => messages.value[String(route.params.id)] ?? [])
const draft = ref('')
usePageState('message-draft', {
  save: () => ({ text: draft.value }),
  restore: (value) => {
    if (typeof value.text === 'string') draft.value = value.text.slice(0, 500)
  },
})
function send() {
  sendMessage(String(route.params.id), draft.value)
  draft.value = ''
}
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page"
    ><GridLayout rows="auto, *, auto">
      <JourneyHeader :title="stay?.host ?? 'Conversa'" />
      <ScrollView row="1"
        ><StackLayout class="feed" v-if="stay">
          <GridLayout
            columns="64, *"
            class="mini-stay"
            @tap="router.push(`/stays/${stay.id}`)"
            accessible="true"
            accessibilityRole="button"
            accessibilityLabel="Ver acomodação da conversa"
            ><Image
              :src="stay.image"
              width="64"
              height="64"
              stretch="aspectFill"
              borderRadius="12" /><StackLayout
              col="1"
              marginLeft="14"
              verticalAlignment="middle"
              ><Label :text="stay.title" fontWeight="600" textWrap="true" /><Label
                text="Ver acomodação →"
                class="muted"
                fontSize="12"
                marginTop="6" /></StackLayout
          ></GridLayout>
          <Label
            text="HOJE"
            class="eyebrow"
            textAlignment="center"
            marginTop="30"
            marginBottom="24"
          />
          <Label
            class="chat-bubble incoming"
            :text="`Oi! Sou ${stay.host}. Vai ser um prazer receber você por aqui. 🌿`"
            textWrap="true"
          />
          <Label
            class="chat-bubble incoming"
            text="O check-in começa às 15h. Posso deixar dicas de passeios e um café fresquinho para sua chegada!"
            textWrap="true"
          />
          <Label
            v-for="(reply, index) in replies"
            :key="index"
            class="chat-bubble outgoing"
            :text="reply"
            textWrap="true"
          />
          <Label
            class="prototype-note"
            text="Conversa local de demonstração."
            textAlignment="center"
          /> </StackLayout
      ></ScrollView>
      <GridLayout row="2" columns="*, 70" class="bottom-actions"
        ><TextField
          v-model="draft"
          class="message-input"
          hint="Escreva uma mensagem…"
          maxLength="500"
          accessibilityLabel="Escreva uma mensagem"
          returnKeyType="send"
          @returnPress="send" /><Button
          col="1"
          text="Enviar"
          color="#ff385c"
          fontWeight="700"
          :isEnabled="!!draft.trim()"
          @tap="send"
      /></GridLayout> </GridLayout
  ></Page>
</template>
