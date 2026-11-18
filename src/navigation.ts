import { Dialogs } from '@nativescript/core'
import { ref } from 'nativescript-vue'
import { notificationIntent, type NavigationIntent } from 'vue-router-ns'
import { router } from './router'
import { selectedTab } from './store'
import { session, sessionIdentity, invitationRead } from './travel-state'

export const openingDestination = ref(false)
let delivery = 0
export async function openDestination(path: string, source = 'app') {
  if (openingDestination.value) return
  openingDestination.value = true
  try {
    const frame = path.startsWith('/messages') ? 'messages' : 'trips'
    const request: NavigationIntent = {
      version: 1,
      source,
      destination: { route: path },
      target: { frame },
      delivery: { scope: 'airbnb-demo', id: `${Date.now()}-${++delivery}` },
      options: { withParents: true },
    }
    const input =
      source === 'notification'
        ? notificationIntent(
            { version: 1, destination: request.destination },
            {
              target: request.target,
              delivery: request.delivery,
              options: request.options,
            },
          )
        : request
    if ('status' in input) throw new Error('Não foi possível abrir este convite.')
    let result
    if (!session.value) {
      const pending = router.suspendIntent(input, {
        scope: sessionIdentity,
        authorize: () => session.value,
        maxAge: 300_000,
      })
      if (pending.status !== 'suspended')
        throw new Error('Este convite não está mais disponível.')
      try {
        const signedIn = await router.pushForResult<boolean>('/login', {
          frame: selectedTab.value,
          props: {
            reason: path.startsWith('/messages')
              ? 'Converse com seu anfitrião'
              : 'Sua viagem está esperando por você',
          },
        })
        if (!signedIn || !session.value) return
        result = await pending.resume()
      } finally {
        pending.cancel()
      }
    } else result = await router.openIntent(input)
    if (result.status === 'ignored')
      throw new Error('Abra o convite novamente para continuar.')
    if (!result.failure && source === 'notification') invitationRead.value = true
  } catch (error) {
    await Dialogs.alert({
      title: 'Não foi possível continuar',
      message: error instanceof Error ? error.message : 'Tente novamente.',
      okButtonText: 'Entendi',
    })
  } finally {
    openingDestination.value = false
  }
}
