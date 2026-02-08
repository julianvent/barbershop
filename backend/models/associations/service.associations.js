import { Appointment } from "../appointment.model.js";
import { Establishment } from "../establishment.model.js";
import { Service } from "../service.model.js";
import { EstablishmentService } from "./establishment.service.model.js";
import { ServiceAppointment } from "./service.appointment.model.js";

/*
Establishment <-> Service (many-to-many via establishment_service).
*/
Establishment.belongsToMany(Service, {
  through: EstablishmentService,
  foreignKey: "establishment_id",
  otherKey: "service_id",
  as: "services",
});

Service.belongsToMany(Establishment, {
  through: EstablishmentService,
  foreignKey: "service_id",
  otherKey: "establishment_id",
  as: "establishments",
});

Establishment.hasMany(EstablishmentService, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "establishment_services",
});

EstablishmentService.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "establishment",
});

Service.hasMany(EstablishmentService, {
  foreignKey: "service_id",
  onDelete: "CASCADE",
  as: "establishment_services",
});

EstablishmentService.belongsTo(Service, {
  foreignKey: "service_id",
  onDelete: "CASCADE",
  as: "service",
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
  EstablishmentService,
  ServiceAppointment,
};
