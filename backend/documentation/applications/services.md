# Services API

Represents the offerings that can be booked inside an appointment.

---

## Create Service

Request

- Method: `POST`
- URL: `http://localhost:3000/services`
- Body (JSON):

```json
{
  "name": "Classic cut",
  "description": "Traditional scissor and clipper cut with a clean finish.",
  "price": 150.0,
  "duration": 30,
  "type": "Haircut"
}
```

Notes

- All fields are required.
- `status` defaults to `active`.

Response

```json
{
  "id": 1,
  "name": "Classic cut",
  "description": "Traditional scissor and clipper cut with a clean finish.",
  "price": 150,
  "duration": 30,
  "type": "Haircut",
  "status": "active"
}
```

---

## Get All Services

Request

- Method: `GET`
- URL: `http://localhost:3000/services`
- Query params (all optional):
  - `page`: Page number (e.g., `1`)
  - `limit`: Page size (e.g., `5`)
  - `q`: Search term (applies to name/description)
  - `sort`: One of `name`, `price`, `duration`, `type`, `id`
  - `dir`: Sort direction `ASC` or `DESC`

Example

```
GET http://localhost:3000/services?page=1&limit=5&q=cut&sort=price&dir=DESC
```

Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Classic cut",
      "description": "Traditional scissor and clipper cut with a clean finish.",
      "price": 150,
      "duration": 30,
      "type": "Haircut",
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
  }
}
```

---

## Get Service By Name

Request

- Method: `GET`
- URL: `http://localhost:3000/services/{name}`

Example

```
GET http://localhost:3000/services/Classic%20cut
```

Response

```json
{
  "id": 1,
  "name": "Classic cut",
  "description": "Traditional scissor and clipper cut with a clean finish.",
  "price": 150,
  "duration": 30,
  "type": "Haircut",
  "status": "active"
}
```

---

## Update Service

Request

- Method: `PUT`
- URL: `http://localhost:3000/services/{name}`
- Body (JSON):

```json
{
  "price": 180.0,
  "duration": 40,
  "status": "active"
}
```

Notes

- All fields are optional; include only those to update.

Response

- Returns the updated service object.

---

## Delete (Deactivate) Service

Request

- Method: `DELETE`
- URL: `http://localhost:3000/services/{name}`

Notes

- Does not permanently delete; sets `status` to `inactive`.

Response

- `204 No Content`

---

## Additional Notes

- `name` must be unique across all services.
- `price` must be greater than `0`.
- `duration` is expressed in minutes.
- `status` can be `active` or `inactive`.
- Query parameters can be combined for search, filtering, and pagination.
- Sortable fields: `name`, `price`, `duration`, `type`, `id`.
