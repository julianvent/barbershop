import { Appointment } from "../appointment.model.js";
import { Establishment } from "../establishment.model.js";
import { Service } from "../service.model.js";
import { ServiceAppointment } from "./service.appointment.model.js";

/*
Service <-> Establishment (one-to-many).
Each service belongs to one establishment.
*/
Service.belongsTo(Establishment, {
  foreignKey: "Establishment_id",
  onDelete: "SET NULL",
  as: "Establishment",
});

Establishment.hasMany(Service, {
  foreignKey: "Establishment_id",
  onDelete: "SET NULL",
  as: "services",
});

/*
Appointment <-> Service (many-to-many via service_appointment).
Direct relationship for high availability.
*/
Appointment.belongsToMany(Service, {
  through: ServiceAppointment,
  foreignKey: "appointment_id",
  otherKey: "service_id",
  as: "services",
});

Service.belongsToMany(Appointment, {
  through: ServiceAppointment,
  foreignKey: "service_id",
  otherKey: "appointment_id",
  as: "appointments",
});

Appointment.hasMany(ServiceAppointment, {
  foreignKey: "appointment_id",
  onDelete: "CASCADE",
  as: "service_appointments",
});

ServiceAppointment.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  onDelete: "CASCADE",
  as: "appointment",
});

Service.hasMany(ServiceAppointment, {
  foreignKey: "service_id",
  onDelete: "CASCADE",
  as: "service_appointments",
});

ServiceAppointment.belongsTo(Service, {
  foreignKey: "service_id",
  onDelete: "CASCADE",
  as: "service",
});

export {
  Appointment,
  Establishment,
  Service,
  ServiceAppointment,
};
