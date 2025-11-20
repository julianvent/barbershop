export function setTimeToDate(date, timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds || 0);
  newDate.setMilliseconds(0);
  return newDate;
}
