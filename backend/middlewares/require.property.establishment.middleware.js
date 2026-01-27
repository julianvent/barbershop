import { Establishment } from "../models/index.js";

export function isEstablishmentOwner(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userRole = req.user.role;
      const userId = req.user.sub;
      const establishmentId = req.params.id;

      if (userRole === "admin") {
        return next();
      }

      const establishment = await Establishment.findByPk(establishmentId);

      if (!establishment) {
        return res.status(404).json({ message: "Establishment not found" });
      }

      const isOwner = Number(establishment.account_id) === Number(userId);
      const hasRole = allowedRoles.includes(userRole);

      if (!isOwner && !hasRole) {
        return res.status(403).json({
          message: "Access denied: You are not the owner of this establishment",
        });
      }

      return next();
    } catch (error) {
      console.error("Ownership Middleware Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
