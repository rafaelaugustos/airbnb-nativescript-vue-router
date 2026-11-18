<script setup lang="ts">
import { computed, ref } from 'nativescript-vue'
import { Dialogs } from '@nativescript/core'
import { onBeforeRouteLeave, usePageState, useRoute, useRouter } from 'vue-router-ns'
import JourneyHeader from '../components/JourneyHeader.vue'
import { stays } from '../data'
import { dateOptions, saveTrip, tripFor, type TripPlan } from '../travel-state'
import { money } from '../utils/stays'
const route = useRoute()
const router = useRouter()
const stay = computed(() => stays.find((s) => s.id === String(route.params.id)))
const reserving = route.path.endsWith('/reserve')
const original = tripFor(String(route.params.id))
const draft = ref<TripPlan>({ ...original })
const saved = ref(false)
const saving = ref(false)
const dirty = computed(
  () => !saved.value && JSON.stringify(draft.value) !== JSON.stringify(original),
)
usePageState('trip-draft', {
  save: () => ({ ...draft.value }),
  restore(value) {
    if (
      value.stayId === original.stayId &&
      dateOptions.some((d) => d.label === value.dates && d.nights === value.nights) &&
      Number.isInteger(value.guests) &&
      value.guests >= 1 &&
      value.guests <= (stay.value?.guests ?? 1) &&
      typeof value.note === 'string' &&
      value.note.length <= 500
    )
      draft.value = { ...original, ...value, confirmed: original.confirmed }
  },
})
onBeforeRouteLeave(async (to) => {
  if (to.path === '/guests' || !dirty.value) return
  return await Dialogs.confirm({
    title: 'Descartar alterações?',
    message: 'Você ainda não salvou os detalhes da viagem.',
    okButtonText: 'Descartar',
    cancelButtonText: 'Continuar editando',
  })
})
async function guests() {
  const count = await router.pushForResult<number>('/guests', {
    props: { count: draft.value.guests, maximum: stay.value?.guests ?? 1 },
    modal: {
      ios: { detents: ['medium', 'large'], grabber: true },
      android: { sheet: { state: 'expanded', skipCollapsed: true } },
    },
  })
  if (typeof count === 'number') draft.value = { ...draft.value, guests: count }
}
async function save() {
  if (saving.value || !stay.value) return
  saving.value = true
  try {
    const result = { ...draft.value, confirmed: reserving || original.confirmed }
    saveTrip(result)
    saved.value = true
    await router.back({ result })
  } catch (e) {
    await Dialogs.alert({
      title: 'Revise sua viagem',
      message: e instanceof Error ? e.message : 'Tente novamente.',
      okButtonText: 'Entendi',
    })
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <Page actionBarHidden="true" class="airbnb-page">
    <GridLayout rows="auto, *, auto">
      <JourneyHeader :title="reserving ? 'Revisar reserva' : 'Editar viagem'" />
      <ScrollView row="1"
        ><StackLayout class="feed" paddingTop="8" v-if="stay">
          <GridLayout columns="88, *" class="mini-stay"
            ><Image
              :src="stay.image"
              width="88"
              height="88"
              stretch="aspectFill"
              borderRadius="14" /><StackLayout
              col="1"
              marginLeft="16"
              verticalAlignment="middle"
              ><Label :text="stay.title" fontWeight="600" textWrap="true" /><Label
                :text="`★ ${stay.rating} · ${stay.location}`"
                fontSize="12"
                class="muted"
                textWrap="true"
                marginTop="8" /></StackLayout
          ></GridLayout>
          <Label
            class="section-heading"
            text="Do seu jeito"
            marginTop="28"
            marginBottom="16"
          />
          <Label class="eyebrow" text="ESCOLHA AS DATAS" />
          <Button
            v-for="option in dateOptions"
            :key="option.label"
            :text="`${draft.dates === option.label ? '✓  ' : ''}${option.label} · ${option.nights} noites`"
            :class="
              draft.dates === option.label ? 'date-choice selected' : 'date-choice'
            "
            @tap="draft = { ...draft, dates: option.label, nights: option.nights }"
          />
          <GridLayout columns="*, auto" class="line-item" marginTop="16"
            ><StackLayout
              ><Label text="Hóspedes" fontWeight="600" /><Label
                :text="`${draft.guests} ${draft.guests === 1 ? 'hóspede' : 'hóspedes'}`"
                class="muted"
                marginTop="5" /></StackLayout
            ><Button
              col="1"
              text="Alterar"
              class="text-button"
              accessibilityLabel="Alterar hóspedes"
              @tap="guests"
          /></GridLayout>
          <Label
            text="Uma mensagem para o anfitrião"
            fontWeight="600"
            marginTop="18"
            marginBottom="10"
          />
          <TextView
            v-model="draft.note"
            class="form-field"
            height="100"
            hint="Conte um pouco sobre sua chegada…"
            maxLength="500"
            accessibilityLabel="Mensagem para o anfitrião"
            returnKeyType="done"
            @returnPress="$event.object.dismissSoftInput()"
          />
          <GridLayout columns="*, auto" class="line-item" marginTop="14"
            ><Label :text="`${money(stay.price)} × ${draft.nights} noites`" /><Label
              col="1"
              :text="money(stay.price * draft.nights)"
              fontWeight="700"
          /></GridLayout>
          <Label
            v-if="reserving"
            class="prototype-note"
            text="Reserva de demonstração. Nenhum pagamento será solicitado ou realizado."
            textWrap="true"
          /> </StackLayout
      ></ScrollView>
      <StackLayout row="2" class="bottom-actions"
        ><Button
          class="primary"
          :text="reserving ? 'Confirmar reserva demo' : 'Salvar alterações'"
          marginTop="0"
          :isEnabled="!saving && !!stay"
          @tap="save"
      /></StackLayout>
    </GridLayout>
  </Page>
</template>
