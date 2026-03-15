import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export type SocketUserType = 'CUSTOMER' | 'STAFF'

export const createSocket = (token: string, userType: SocketUserType) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL, {
      auth: { token, userType },
      withCredentials: true
    })
  }

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}
