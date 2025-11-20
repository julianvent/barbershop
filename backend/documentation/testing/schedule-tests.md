# Schedule Workflow Tests

File: `backend/tests/schedule/schedule.test.js`

## Covered Scenarios
- **List schedules** : exercises `GET /schedules`, ensuring the controller returns whatever the repository mock provides.
- **Create schedule** : posts a valid body and verifies that validation passes and the repository receives the payload exactly once.
- **Reject invalid schedule** : submits an invalid day of week to show that validation fails before hitting the repository.
- **Update schedule** : validates the `PUT /schedules/:day_of_week` flow and checks that the repository is invoked with the path parameter and incoming body.

Each scenario goes through the real Express router, controller, service, and validator layers with the repository mocked, so the tests assert the entire workflow without touching the database.
