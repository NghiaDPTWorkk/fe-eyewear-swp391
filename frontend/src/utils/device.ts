const getOrCreateDeviceId = () => {
  const storageKey = 'x_device_id'
  let deviceid = localStorage.getItem(storageKey)

  if (!deviceid) {
    deviceid = window.crypto.randomUUID()
    localStorage.setItem(storageKey, deviceid)
  }
  return deviceid
}

export { getOrCreateDeviceId }
