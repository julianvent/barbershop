# Schedules API

Define weekly availability windows for the shop.

---

## Get All Schedules

Request

- Method: `GET`
- URL: `http://localhost:3000/schedules`

Response

```json
[
  {
    "day_of_week": "Monday",
    "start_time": "09:00:00",
    "end_time": "18:00:00",
    "is_active": true
  }
]
```

---

## Get Schedule By Day

Request

- Method: `GET`
- URL: `http://localhost:3000/schedules/{day_of_week}`

Example

```
GET http://localhost:3000/schedules/Monday
```

Notes

- `day_of_week` can be: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`.

Response

```json
{
  "day_of_week": "Monday",
  "start_time": "09:00:00",
  "end_time": "18:00:00",
  "is_active": true
}
```

---

## Create Schedule

Request

- Method: `POST`
- URL: `http://localhost:3000/schedules`
- Body (JSON):

```json
{
  "day_of_week": "Monday",
  "start_time": "09:00:00",
  "end_time": "18:00:00",
  "is_active": true
}
```

Notes

- Each day can only have one schedule. Duplicate days will be rejected.

Response

```json
{
  "day_of_week": "Monday",
  "start_time": "09:00:00",
  "end_time": "18:00:00",
  "is_active": true
}
```

---

## Update Schedule

Request

- Method: `PUT`
- URL: `http://localhost:3000/schedules/{day_of_week}`
- Body (JSON):

```json
{
  "start_time": "10:00:00",
  "end_time": "19:00:00",
  "is_active": false
}
```

Notes

- The `day_of_week` in the URL is used; omit it from the body.
- All fields in the body are optional.

Response

```json
{
  "day_of_week": "Monday",
  "start_time": "10:00:00",
  "end_time": "19:00:00",
  "is_active": false
}
```

---

## Bulk Create

Request

- Method: `POST`
- URL: `http://localhost:3000/schedules/bulk`
- Body (JSON):

```json
[
  {
    "day_of_week": "Monday",
    "start_time": "09:00:00",
    "end_time": "18:00:00",
    "is_active": true
  },
  {
    "day_of_week": "Wednesday",
    "start_time": "09:00:00",
    "end_time": "18:00:00",
    "is_active": true
  }
]
```

Response

- Array of created schedule objects.

---

## Bulk Update

Request

- Method: `PUT`
- URL: `http://localhost:3000/schedules/bulk`
- Body (JSON):

```json
[
  {
    "day_of_week": "Monday",
    "start_time": "10:00:00",
    "end_time": "19:00:00"
  },
  {
    "day_of_week": "Friday",
    "start_time": "08:00:00",
    "end_time": "16:00:00"
  }
]
```

Response

- Array of updated schedule objects.

---

## Additional Notes

- Times use `HH:MM:SS` format.
- `is_active` indicates whether the shop is open for that day.
