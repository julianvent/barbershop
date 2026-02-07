import { Establishment } from "../establishment.model.js";
import { Barber } from "../barber.model.js";
import { Appointment } from "../appointment.model.js";

/*
Means that a One-To-Many relationship exists between Establishment and Barber,
with the foreign key being defined in the target model (Barber).
*/
Establishment.hasMany(Barber, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "barbers",
});

/*
Means that a Many-To-One relationship exists between Barber and Establishment,
with the foreign key being defined in the source model (Barber).
*/
Barber.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "establishment",
});

/*
Means that a One-To-Many relationship exists between Barber and Appointment,
with the foreign key being defined in the target model (Appointment).
*/
Barber.hasMany(Appointment, {
  foreignKey: "barber_id",
  onDelete: "SET NULL",
  as: "appointments",
});

/*
Means that a Many-To-One relationship exists between Appointment and Barber,
with the foreign key being defined in the source model (Appointment).
*/
Appointment.belongsTo(Barber, {
  foreignKey: "barber_id",
  onDelete: "SET NULL",
  as: "barber",
});

export { Establishment, Barber, Appointment };
