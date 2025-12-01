
export function generateImageUrl(req, relativePath) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/${relativePath}`.replace(/\\/g, "/")
;
}
