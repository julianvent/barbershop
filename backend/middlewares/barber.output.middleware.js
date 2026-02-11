
const VALID_ROLES = ["admin", "receptionist"];

export function barberOutput() {
    return function(req, res, next) {
        const originalJson = res.json.bind(res);
        res.json = (body) => {

            try {
                const role = req.user?.role;
                if (body?.data && Array.isArray(body.data)) {

                    if (!VALID_ROLES.includes(role)) {
                        body.data = body.data.map(item => BarberPublicDTO(item));
                    }

                } else if (body && typeof body === "object" && !VALID_ROLES.includes(role)) {
                    body = BarberPublicDTO(body);
                }

                return originalJson(body);
            } catch (error) {
                console.log(2)
                console.error("DTO middleware error:", error);
                return originalJson(body);
            }
        };

        next();
    };
}

export function BarberPublicDTO(barber) {
    return {
        id: barber.id,
        barber_name: barber.barber_name,
        is_active: barber.is_active,
        image_path: barber.image_path
    };
}
