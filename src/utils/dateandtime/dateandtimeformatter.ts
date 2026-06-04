// ..\src\utils\dateandtime\dateandtimeformatter.ts


export function formatAppointmentDate(date: string, time: string) {
  return `${date}T${time}:00+08:00`;
}
