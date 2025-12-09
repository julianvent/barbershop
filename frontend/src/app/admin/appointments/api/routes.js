export const getAppointmentsApiRoute = "/api/appointments/";
export const updateAppointmentApiRoute = "/api/appointments/";
export const createAppointmentApiRoute = "/api/appointments/";
export const getAvailabilityApiRoute = "/api/appointments/availability";
export const completeAppointmentApiRoute = "/api/appointments/${id}/complete";

export const cancelAppointmentApiRoute = (id) =>
  `/api/appointments/${id}/cancel`;
