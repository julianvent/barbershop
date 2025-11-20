# Quotes API

Endpoints around inspirational quotes shown throughout the application.

---

## Get Random Quote

Request

- Method: `GET`
- URL: `http://localhost:3000/quotes`

Response

- A single random quote (passthrough from The Quotes Hub API).

Example

```json
{
  "id": 12345,
  "text": "The only limit to our realization of tomorrow is our doubts of today.",
  "author": "Franklin D. Roosevelt",
  "author_id": "franklin-d-roosevelt",
  "tags": ["inspirational", "motivation"]
}
```

---

## Get Random Quote From Random Tag

Request

- Method: `GET`
- URL: `http://localhost:3000/quotes/random-tag`

Notes

- The tag is chosen randomly by the server; no query parameter is required.

Response

- A single random quote from a randomly selected tag.

Example

```json
{
  "id": 67890,
  "text": "In the middle of difficulty lies opportunity.",
  "author": "Albert Einstein",
  "author_id": "albert-einstein",
  "tags": ["opportunity", "wisdom"]
}
```

---

## Additional Notes

- Responses are direct from The Quotes Hub; fields may vary slightly.
- On upstream failures, the API responds with a generic error and appropriate status code.
