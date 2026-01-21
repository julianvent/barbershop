const VALID_FIELDS = ["name", "address", "phone_number"];
const VALID_UPDATE_FIELDS = [...VALID_FIELDS];


export const EstablishmentValidator = {
    validateCreate(establishmentData) {
        if (!establishmentData || typeof establishmentData !== "object") {
            throw new Error("Body is empty or invalid");
        }
        for (const field of VALID_FIELDS) {
            if (!(field in establishmentData)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    },
    validateUpdate(establishmentData) {
        if (!establishmentData || typeof establishmentData !== "object") {
            throw new Error("Body is empty or invalid");
        }
        for (const field of VALID_UPDATE_FIELDS) {
            if (!(field in establishmentData)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    },
};