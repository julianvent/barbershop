# Barbers API

CRUD operations for barbers plus appointment utilities.

---

## Get All Barbers

Request

- Method: `GET`
- URL: `http://localhost:3000/barbers`
- Query params (optional):
  - `page`: Page number (default `1`)
  - `limit`: Page size (default `5`, max `50`)
  - `sort`: Sort direction by `id` — `ASC` or `DESC` (default `ASC`)

Example

```
GET http://localhost:3000/barbers?page=1&limit=5&sort=ASC
```

Response

```json
{
  "data": [
    {
      "id": 1,
      "barber_name": "Julian",
      "is_active": true,
      "image_path": "monkeyBarber.png"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 21,
    "pages": 1
  }
}
```

---

## Get Barber By ID

Request

- Method: `GET`
- URL: `http://localhost:3000/barbers/{id}`

Response

```json
{
  "id": 1,
  "barber_name": "Julian",
  "is_active": true,
  "image_path": "monkeyBarber.png"
}
```

---

## Create Barber

Request

- Method: `POST`
- URL: `http://localhost:3000/barbers`
- Content-Type: `multipart/form-data`
- Form fields:
  - `barber_name` (required)
  - `image` (file, optional; field name must be `image`)

Minimal form fields example

```json
{
  "barber_name": "Carlos Rodriguez"
}
```

Notes

- Requests must be `multipart/form-data`; otherwise returns `400`.
- Any `image_path` provided in the body is ignored.
- If no image is uploaded, a default avatar is used (e.g., `monkeyBarber.png`).
- `is_active` defaults to `true`.

Response

```json
{
  "id": 1,
  "barber_name": "Carlos Rodriguez",
  "image_path": "barber-1234567890.jpg",
  "is_active": true
}
```

---

## Update Barber

Request

- Method: `PUT`
- URL: `http://localhost:3000/barbers/{id}`
- Content-Type: `multipart/form-data`
- Optional fields:
  - `barber_name`
  - `is_active`
  - `image` (file; field name must be `image`)

Response

```json
{
  "id": 1,
  "barber_name": "Carlos Rodriguez Jr.",
  "image_path": "barber-9876543210.jpg",
  "is_active": false
}
```

Notes

- Requests must be `multipart/form-data`; otherwise returns `400`.
- Uploading a new image deletes the previous uploaded image (if any and not the built-in default).

---

## Delete Barber

Request

- Method: `DELETE`
- URL: `http://localhost:3000/barbers/{id}`

Response

- `204 No Content`

---

## Barber Appointments

Request

- Method: `GET`
- URL: `http://localhost:3000/barbers/{id}/appointments`
- Body (optional filters):

```json
{
  "status": "pending",
  "from": "2025-10-01",
  "to": "2025-10-31",
  "order_appointment": "ASC"
}
```

Notes

- `status` is required: `pending`, `confirmed`, `cancelled`, or `completed`.
- Returns the barber's appointments within the date range.

Response

```json
[
  {
    "id": 1,
    "customer_name": "Alice Smith",
    "customer_phone": "+1-555-123-4567",
    "appointment_datetime": "2025-10-20T10:00:00.000Z",
    "total_duration": 45,
    "status": "pending",
    "barber_id": 1
  }
]
```

Note: If this endpoint is not available in your build, ensure the route `GET /barbers/:id/appointments` is implemented and wired to the appointments service.
