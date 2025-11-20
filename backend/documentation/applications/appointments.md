# Appointments API

Create and manage bookings tied to barbers and services.

## Create appointment

`POST http://localhost:3000/appointments`

```json
{
  "customer_name": "Alice Smith",
  "customer_phone": "+1-555-123-4567",
  "appointment_datetime": "2025-10-20T10:00:00",
  "total_duration": 45,
  "status": "pending",
  "barber_id": 1,
  "services_ids": [1, 2]
}
```

`status` accepts `pending`, `confirmed`, `cancelled`, or `completed`.

**Response**

```json
{
  "id": 1,
  "customer_name": "Alice Smith",
  "customer_phone": "+1-555-123-4567",
  "appointment_datetime": "2025-10-20T10:00:00.000Z",
  "total_duration": 45,
  "status": "pending",
  "barber_id": 1,
  "services": [
    { "id": 1, "name": "mullet buzz cut" },
    { "id": 2, "name": "buzz cut fade" }
  ]
}
```

## List appointments

`GET http://localhost:3000/appointments`

Query params: `barber_id`, `status_appointment`, `from`, `to`, `sort` (`ASC`/`DESC`),
`page`, and `limit`.

```json
{
  "appointments": [
    {
      "id": 2,
      "customer_name": "Lava Ollas",
      "customer_phone": "12345678",
      "customer_email": null,
      "appointment_datetime": "2025-11-19T00:00:00.000Z",
      "total_duration": 30,
      "status": "pending",
      "barber_id": 3,
      "barber": {
        "name": "Kevin F",
        "barber_id": 3
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 5,
    "pages": 1
  }
}
```

Example: `GET /appointments?page=1&limit=10&from=2025-11-19&barber_id=3`.

## Retrieve appointment

`GET http://localhost:3000/appointments/{id}`

```json
{
  "id": 1,
  "customer_name": "Alice Smith",
  "customer_phone": "+1-555-123-4567",
  "customer_email": null,
  "appointment_datetime": "2025-12-10T16:00:00.000Z",
  "total_duration": 30,
  "status": "pending",
  "services": [
    { "id": 1, "name": "Classic cut" }
  ],
  "barber": {
    "id": 1,
    "barber_name": "Julian"
  }
}
```

## Update appointment

`PUT http://localhost:3000/appointments/{id}`

```json
{
  "status": "confirmed",
  "appointment_datetime": "2025-10-20T14:00:00"
}
```

All fields optional; omit unchanged values.

## Delete appointment

`DELETE http://localhost:3000/appointments/{id}` → `204 No Content`

## Availability

`GET http://localhost:3000/appointments/availability`

Optional params: `barber_id`, `from` (defaults to today and all barbers).

```json
{
  "date": "2025-11-19T06:00:00.000Z",
  "barbers": [
    {
      "barberId": "2",
      "slots": ["09:00", "09:15", "09:30", "..."]
    }
  ]
}
```
