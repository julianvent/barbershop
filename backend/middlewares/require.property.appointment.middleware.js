import { verifyTokenAppointment } from "../services/jwt.service.js";

export function propertyAppointment(req, res, next){
    try{
         const userRole = req.user?.role;

        if (userRole === "admin" || userRole === "receptionist") {
            return next();
        }

        const token = req.query.auth

        if(!token) {
            return res.status(401).json({
                message: "No link provided"
            })
        }
        const decoded = verifyTokenAppointment(token);

        const tokenAppointmentId = decoded.appointmentId;
        const paramAppointmentId = Number(req.params.id);
        if (tokenAppointmentId !== paramAppointmentId) {
            return res.status(403).json({
                message: "This link is not valid for this appointment"
            });
        }

        return next();
    } catch(error){
        return res.status(401).json({
            message: "Invalid or expired link"
        });
    }
}