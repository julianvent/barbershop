export const signInRoute = "/signin";

export const appointmentsRoute = "/admin/appointments";
export const edit = "/${id}/update";
export const see = "/${id}";
export const newAppointmentRoute = appointmentsRoute + "/new";
export const seeAppointments = appointmentsRoute + see;
export const editAppointments = appointmentsRoute + edit;

export const servicesRoute = "/admin/services";
export const newServiceRoute = servicesRoute + "/new";
export const newBundleRoute = servicesRoute + "/bundles/new";
export const seeService = servicesRoute + see;
export const editService = servicesRoute + edit;

export const staffRoute = "/admin/staff";
export const newStaffRoute = staffRoute + "/new";
export const editStaffRoute = staffRoute + edit;
export const seeStaffRoute = staffRoute + see;

export const makeAppointmentRoute = "/appointments";

export const establishmentRoute = "/admin/establishment";
export const newEstablishment = establishmentRoute + "/new";
export const seeEstablishment = establishmentRoute + see;
export const editEstablishment = establishmentRoute + edit;