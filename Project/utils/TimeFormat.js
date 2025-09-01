
const TimeFormat = () => {
    const now = new Date()
    const getHour = now.getHours()
    const getMint = String(now.getMinutes()).padStart(2, "0")
    const ampm = getHour >=12 ? 'PM' : "AM"
    const Hour = getHour % 12 || 12
    const DateFormat = `${Hour}:${getMint} ${ampm}`
    return DateFormat
}

export default TimeFormat