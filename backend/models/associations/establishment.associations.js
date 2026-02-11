import {Account} from "../account.model.js";
import {Establishment} from "../establishment.model.js";
import {Schedule} from "../schedule.model.js";
import {Appointment} from "../appointment.model.js";

/*
Means that a One-To-Many relationship exists between Account and Establishment, 
with the foreign key being defined in the target model (Establishment).
*/
Account.hasMany(Establishment, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
  as: "establishments",
});
/*
Means that a One-To-One relationship exists between Establishment and Account,
 with the foreign key being defined in the source model (Establishment).
*/
Establishment.belongsTo(Account, {
  foreignKey: "account_id",
  onDelete: "CASCADE",
  as: "account",
});

Establishment.hasMany(Schedule, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "schedules",
});

Schedule.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  onDelete: "CASCADE",
  as: "establishment",
});

Account.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  onDelete: "SET NULL",
  as: "establishment",
});

Appointment.belongsTo(Establishment, {
  foreignKey: "establishment_id",
  onDelete: "SET NULL",
  as: "establishment",
});

Establishment.hasMany(Appointment, {
  foreignKey: "establishment_id",
  onDelete: "SET NULL",
  as: "appointments",
});

export { Account, Establishment, Schedule, Appointment };
