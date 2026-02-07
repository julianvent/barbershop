/**
 * Central association loader
 *
 * This file imports all association files to ensure they are loaded
 * in the correct order. This prevents circular dependency issues.
 *
 * IMPORTANT: Import this file AFTER all models are defined but BEFORE
 * using any models with their associations.
 */

// Import all association files
import "./associations/establishment.associations.js";
import "./associations/barber.associations.js";

// Re-export all models for convenience
export { Account } from "./account.model.js";
export { Establishment } from "./establishment.model.js";
export { Schedule } from "./schedule.model.js";
export { Service } from "./service.model.js";
export { Appointment } from "./appointment.model.js";
export { Barber } from "./barber.model.js";
export { ServiceAppointment } from "./associations/service.appointment.model.js";
