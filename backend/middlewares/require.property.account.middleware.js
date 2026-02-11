import { Account } from "../models/index.js";

export function isAccountInEstablishment(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userRole = req.user.role;
      const userEstablishmentId = req.user.establishment_id;
      const userId = req.user.sub;
      const accountId = req.params.id;

      if (userRole === "admin") {
        return next();
      }

      if (Number(userId) === Number(accountId)) {
        return next();
      }

      const account = await Account.findByPk(accountId);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const belongsToEstablishment = Number(account.establishment_id) === Number(userEstablishmentId);
      const hasRole = allowedRoles.includes(userRole);

      if (!belongsToEstablishment && !hasRole) {
        return res.status(403).json({
          message: "Access denied: This account does not belong to your establishment",
        });
      }

      // Additional check: if role is required but establishment doesn't match
      if (hasRole && !belongsToEstablishment) {
        return res.status(403).json({
          message: "Access denied: This account does not belong to your establishment",
        });
      }

      return next();
    } catch (error) {
      console.error("Account Property Middleware Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
