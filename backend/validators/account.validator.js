const validRoles = ["admin", "barbero", "recepcionista"];
const allowedFields = [ "nombre_completo", "contrasena", "rol", "correo_electronico" ];
const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";
const loginFields = ["correo_electronico", "contrasena"];

export const AccountValidator = {
  validateCreate(account) {
    if (!account || typeof account !== "object") {
      throw new Error("Body vacío o inválido");
    }
    for (const field of allowedFields) {
      if (!(field in account)) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (field === "rol" && !validRoles.includes(account.rol)) {
        throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
      }
    }
  },

  validateUpdate(account) {
    if (!account || typeof account !== "object") {
      throw new Error("Body vacío o inválido");
    }

    for (const field of allowedFields) {
      if (field === "rol" && !validRoles.includes(account.rol)) {
        throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
      }
    }

    if ("nombre_completo" in account && !isNonEmptyString(account.nombre_completo)) {
      throw new Error("nombre_completo no puede estar vacío");
    }

    if ("contrasena" in account && !isNonEmptyString(account.contrasena)) {
        throw new Error("La contraseña no puede estar vacía");

      }

    if ("rol" in account && !validRoles.includes(account.rol)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }

  },
    validateLogin(correo_electronico, contrasena){
    if(!contrasena) throw new Error("Missing required field: contrasena");
    if(!correo_electronico) throw new Error("Missing required field: correo_electronico");

    if (!isNonEmptyString(correo_electronico)) {
      throw new Error("El correo_electronico no puede estar vacío");

    }
    if (!isNonEmptyString(contrasena)) {
      throw new Error("La contraseña no puede estar vacía");

    }
  }

};
