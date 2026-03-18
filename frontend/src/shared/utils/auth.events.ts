export type AuthEvent = 'UNAUTHORIZED'

type Listener = (event: AuthEvent) => void

const listeners: Listener[] = []

export const authEventEmitter = {
  subscribe(listener: Listener) {
    listeners.push(listener)

    // cleanup function
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx !== -1) {
        listeners.splice(idx, 1)
      }
    }
  },

  emit(event: AuthEvent) {
    listeners.forEach((listener) => listener(event))
  }
}
