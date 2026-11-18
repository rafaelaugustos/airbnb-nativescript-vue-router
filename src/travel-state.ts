import { ApplicationSettings } from '@nativescript/core'
import { computed, ref, watch } from 'nativescript-vue'
import { stays } from './data'

export interface TripPlan {
  stayId: string
  dates: string
  nights: number
  guests: number
  note: string
  confirmed: boolean
}
export const dateOptions = [
  { label: '4–9 de dez.', nights: 5 },
  { label: '11–14 de dez.', nights: 3 },
  { label: '18–23 de dez.', nights: 5 },
] as const
const plansKey = 'airbnb.trips.v1'
function readPlans(): Record<string, TripPlan> {
  try {
    const value = JSON.parse(ApplicationSettings.getString(plansKey, '{}'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(
      Object.entries(value).filter(([id, item]) => {
        const p = item as TripPlan
        const stay = stays.find((stay) => stay.id === id)
        return (
          stay &&
          p?.stayId === id &&
          dateOptions.some((d) => d.label === p.dates && d.nights === p.nights) &&
          Number.isInteger(p.guests) &&
          p.guests >= 1 &&
          p.guests <= stay.guests &&
          typeof p.note === 'string' &&
          p.note.length <= 500 &&
          typeof p.confirmed === 'boolean'
        )
      }),
    ) as Record<string, TripPlan>
  } catch {
    return {}
  }
}
export const plans = ref(readPlans())
watch(plans, (value) => ApplicationSettings.setString(plansKey, JSON.stringify(value)))
export function tripFor(id: string): TripPlan {
  return (
    plans.value[id] ?? {
      stayId: id,
      dates: dateOptions[0].label,
      nights: 5,
      guests: 1,
      note: '',
      confirmed: false,
    }
  )
}
export function saveTrip(plan: TripPlan) {
  const stay = stays.find((stay) => stay.id === plan.stayId)
  if (
    !stay ||
    !dateOptions.some((d) => d.label === plan.dates && d.nights === plan.nights) ||
    !Number.isInteger(plan.guests) ||
    plan.guests < 1 ||
    plan.guests > stay.guests
  )
    throw new Error('Revise os detalhes da viagem.')
  plans.value = {
    ...plans.value,
    [plan.stayId]: { ...plan, note: plan.note.trim().slice(0, 500) },
  }
}
export const confirmedTrips = computed(() =>
  Object.values(plans.value).filter((plan) => plan.confirmed),
)
export const session = ref(
  ApplicationSettings.getBoolean('airbnb.demo.signed-in', false),
)
export const traveler = ref(
  ApplicationSettings.getString('airbnb.demo.name', 'Rafa').slice(0, 40),
)
let identity: object = {}
export const sessionIdentity = () => identity
export function signIn(name: string) {
  traveler.value = name.trim().slice(0, 40) || 'Viajante'
  session.value = true
  ApplicationSettings.setString('airbnb.demo.name', traveler.value)
  ApplicationSettings.setBoolean('airbnb.demo.signed-in', true)
}
export function signOut() {
  session.value = false
  identity = {}
  ApplicationSettings.remove('airbnb.demo.signed-in')
}
export const preparationEnabled = ref(
  ApplicationSettings.getBoolean('airbnb.preparation', true),
)
watch(preparationEnabled, (value) =>
  ApplicationSettings.setBoolean('airbnb.preparation', value),
)
const messagesKey = 'airbnb.messages.v1'
function readMessages(): Record<string, string[]> {
  try {
    const value = JSON.parse(ApplicationSettings.getString(messagesKey, '{}'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([id, items]) =>
            stays.some((stay) => stay.id === id) &&
            Array.isArray(items) &&
            items.length <= 30 &&
            items.every((item) => typeof item === 'string' && item.length <= 500),
        )
        .slice(-12),
    ) as Record<string, string[]>
  } catch {
    return {}
  }
}
export const messages = ref(readMessages())
watch(
  messages,
  (value) => ApplicationSettings.setString(messagesKey, JSON.stringify(value)),
  { flush: 'sync' },
)
export function sendMessage(id: string, message: string) {
  const text = message.trim().slice(0, 500)
  if (!text || !stays.some((stay) => stay.id === id)) return
  messages.value = Object.fromEntries(
    [
      ...Object.entries(messages.value).filter(([key]) => key !== id),
      [id, [...(messages.value[id] ?? []), text].slice(-30)],
    ].slice(-12),
  )
}
export const invitationRead = ref(false)
