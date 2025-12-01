import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const PATH = 'image';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

function fileFilter(req, file, cb) {
    const nameOk = file.fieldname == PATH;

    const mimeOk = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);

    if (!mimeOk || !nameOk) return cb(null, false);
    cb(null, true);
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 , files: 1},
});


export function removeImage(filename){
    const abs = path.join(UPLOAD_DIR, filename)
    fs.unlink(abs, (err) => {
    if (err) {
        if (err.code !== 'ENOENT') console.error(err);
    }
    });
}

export function existsImage(filename){
    const abs = path.join(UPLOAD_DIR, filename)
    return fs.existsSync(abs)
}