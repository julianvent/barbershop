# Accounts API

Manage users for admins, barbers, and receptionists.

## Login

`POST http://localhost:3000/accounts/login`

**Body**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response**

```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "role": "receptionist"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

## Create account

`POST http://localhost:3000/accounts`

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "receptionist"
}
```

`role` supports `admin`, `barber`, or `receptionist`.

## Retrieve account

`GET http://localhost:3000/accounts/{accountId}`

Returns the account profile for the supplied identifier.

## Update account

`PUT http://localhost:3000/accounts/{id}`

```json
{
  "full_name": "John Smith",
  "email": "john.smith@example.com",
  "password": "newPassword456",
  "role": "barber"
}
```

All fields are optional; include only those that should change.

**Response**

```json
{
  "email": "john.smith@example.com",
  "full_name": "John Smith",
  "role": "barber"
}
```

## Delete account

`DELETE http://localhost:3000/accounts/{id}`

Responds with `204 No Content` on success.
