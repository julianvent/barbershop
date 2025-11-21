
export function requireRole(...allowedRoles){
    return function(req, res, next){
        try {
            if(!req.user) {
                return res.status(401).json({
                    message: "Not authenticated"
                });
            }
            const userRole = req.user.role;

            if (userRole === "admin") {
                return next();
            }

            if(!allowedRoles.includes(userRole)){
                return res.status(403).json({
                    message: "Access denied: insufficient role"
                });
            }
            return next();

        } catch (error) {
            return res.status(500).json({
                message: "Server error"
            });
        }
    }
}
