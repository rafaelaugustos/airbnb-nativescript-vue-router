import { computed, inject, provide, type InjectionKey } from 'nativescript-vue'
import { usePageActions, type PageActions } from 'vue-router-ns'
import { stays } from '../data'
import { saved, toggleSaved } from '../store'

const stayActionsKey: InjectionKey<PageActions> = Symbol('stay-actions')

/** Register during page setup, before cards mount or the route loader resolves. */
export function provideStayActions() {
  const actions = usePageActions(
    stays.map((stay) => ({
      id: stay.id,
      title: () =>
        saved.value.includes(stay.id)
          ? 'Remover dos favoritos'
          : 'Salvar nos favoritos',
      image: () => (saved.value.includes(stay.id) ? 'heart.slash' : 'heart'),
      run: () => toggleSaved(stay.id),
    })),
  )
  provide(stayActionsKey, actions)
}

export function useStayActions(stayId: () => string) {
  const actions = inject(stayActionsKey)
  if (!actions) throw new Error('The routed page must provide stay actions')
  const isSaved = computed(() => saved.value.includes(stayId()))
  const favorite = computed(() => actions.get(stayId())!)
  return { actions, favorite, isSaved }
}
