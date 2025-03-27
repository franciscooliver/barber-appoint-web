// You can use date-fns or native Date methods as needed
export const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}


export const formatTime = (dateStr: string | Date): string => { 
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export const calculateMinutes = (timeValue: string | number): number => {
  return typeof timeValue === 'number' ? timeValue : parseInt(timeValue, 10)
}

export const formatDuration = (timeValue: string | number): string => {
  const minutes = typeof timeValue === 'number' ? timeValue : parseInt(timeValue, 10)
  if (minutes % 60 === 0) {
    return `${minutes / 60}h`
  } else {
    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60
    return hours ? `${hours}h${remaining}min` : `${remaining}min`
  }
}
