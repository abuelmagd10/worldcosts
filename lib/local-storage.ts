// Funciones para manejar localStorage y sessionStorage

// Verificar si localStorage está disponible
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false
    const testKey = "__test__"
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

// Verificar si sessionStorage está disponible
export function isSessionStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false
    const testKey = "__test__"
    window.sessionStorage.setItem(testKey, testKey)
    window.sessionStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

// Guardar datos en localStorage
export function saveToLocalStorage(key: string, value: any): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}

// Obtener datos de localStorage
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (!isLocalStorageAvailable()) return defaultValue
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error("Error getting from localStorage:", error)
    return defaultValue
  }
}

// Guardar datos en sessionStorage
export function saveToSessionStorage(key: string, value: any): boolean {
  try {
    if (!isSessionStorageAvailable()) return false
    window.sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("Error saving to sessionStorage:", error)
    return false
  }
}

// Obtener datos de sessionStorage
export function getFromSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    if (!isSessionStorageAvailable()) return defaultValue
    const item = window.sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error("Error getting from sessionStorage:", error)
    return defaultValue
  }
}
