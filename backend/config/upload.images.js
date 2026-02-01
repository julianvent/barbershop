import multer from "multer";
import fs from "fs";
import path from "path";

export const PATH = "image";
export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 1;

export const BARBER_UPLOAD_DIR = path.join(process.cwd(), "uploads", "barbers");
export const APPOINTMENT_UPLOAD_DIR = path.join(
  process.cwd(),
  "uploads",
  "appointments",
);
export const ESTABLISHMENT_UPLOAD_DIR = path.join(
  process.cwd(),
  "uploads",
  "establishments",
);

// Ensure upload directories exist
[BARBER_UPLOAD_DIR, APPOINTMENT_UPLOAD_DIR, ESTABLISHMENT_UPLOAD_DIR].forEach(
  (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  },
);

// Factory functions
function createStorage(uploadDir) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      // Avoid filename collisions by prefixing with timestamp
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  });
}

export function normalizeImagePath(filename, uploadDir) {
  if (!filename) return null;
  if (filename.startsWith("/") || filename.includes("/")) return filename;
  const relativePath = path.relative(process.cwd(), path.join(uploadDir, filename));
  return `/${relativePath.replace(/\\/g, '/')}`;
}

function createFileFilter() {
  return (req, file, cb) => {
    const nameOk = file.fieldname === PATH;
    const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);

    if (!mimeOk || !nameOk) return cb(null, false);
    cb(null, true);
  };
}

function createUploader(uploadDir) {
  return multer({
    storage: createStorage(uploadDir),
    fileFilter: createFileFilter(),
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  });
}

// Multer instances
export const uploadBarberImage = createUploader(BARBER_UPLOAD_DIR);
export const uploadAppointmentImage = createUploader(APPOINTMENT_UPLOAD_DIR);
export const uploadEstablishmentImage = createUploader(
  ESTABLISHMENT_UPLOAD_DIR,
);

export function removeImage(filename, DIR) {
  if (!filename) return;
  const abs =
    filename.includes("/") || filename.includes("\\")
      ? path.join(process.cwd(), filename)
      : path.join(DIR, filename);
  fs.unlink(abs, (err) => {
    if (err) {
      if (err.code !== "ENOENT") console.error(err);
    }
  });
}

export function existsImage(filename, DIR) {
  if (!filename) return false;
  const abs =
    filename.includes("/") || filename.includes("\\")
      ? path.join(process.cwd(), filename)
      : path.join(DIR, filename);
  return fs.existsSync(abs);
}
