

export function property(...allowedRoles){
    return function(req, res, next){
        try{

            const userRole = req.user.role;

            if (userRole === "admin") {
                    return next();
            }

            const userId = req.user.sub;
            const paramId = Number(req.params.id);

            if(userId !== paramId && !allowedRoles.includes(userRole)){
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                })
            }
            return next();
        } catch(error){
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}