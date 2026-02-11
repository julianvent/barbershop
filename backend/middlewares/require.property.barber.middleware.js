import { Barber } from "../models/index.js";

export function isBarberInEstablishment(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userRole = req.user.role;
      const userEstablishmentId = req.user.establishment_id;
      const barberId = req.params.id;

      if (userRole === "admin") {
        return next();
      }

      const barber = await Barber.findByPk(barberId);

      if (!barber) {
        return res.status(404).json({ message: "Barber not found" });
      }

      const belongsToEstablishment = Number(barber.establishment_id) === Number(userEstablishmentId);
      const hasRole = allowedRoles.includes(userRole);

      if (!belongsToEstablishment && !hasRole) {
        return res.status(403).json({
          message: "Access denied: This barber does not belong to your establishment",
        });
      }

      // Additional check: if role is required but establishment doesn't match
      if (hasRole && !belongsToEstablishment) {
        return res.status(403).json({
          message: "Access denied: This barber does not belong to your establishment",
        });
      }

      return next();
    } catch (error) {
      console.error("Barber Property Middleware Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
