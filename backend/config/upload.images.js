import multer from "multer";
import fs from "fs";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads', "barbers");
export const APPOINTMENT_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'appointments');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(APPOINTMENT_UPLOAD_DIR)) fs.mkdirSync(APPOINTMENT_UPLOAD_DIR, { recursive: true });

export const PATH = "image";
export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const barberStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

function barberFileFilter(req, file, cb) {
    const nameOk = file.fieldname == PATH;

  if (!mimeOk || !nameOk) return cb(null, false);
  cb(null, true);
}

export const uploadBarberImage = multer({
    storage: barberStorage,
    fileFilter: barberFileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});


const appointmentStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, APPOINTMENT_UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

function appointmentFileFilter(req, file, cb) {
    const nameOk = file.fieldname === PATH;
    const mimeOk = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);

    if (!mimeOk || !nameOk) return cb(null, false);
    cb(null, true);
}

export const uploadAppointmentImage = multer({
    storage: appointmentStorage,
    fileFilter: appointmentFileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});


export function removeImage(filename, DIR = UPLOAD_DIR) {
    const abs = path.join(DIR, filename)
    fs.unlink(abs, (err) => {
        if (err) {
            if (err.code !== 'ENOENT') console.error(err);
        }
    });
}

export function existsImage(filename, DIR = UPLOAD_DIR) {
    const abs = path.join(DIR, filename)
    return fs.existsSync(abs)
}
