# Service Workflow Tests

File: `backend/tests/service/service.test.js`

## Covered Scenarios
- **List services** : confirms query parameters flow from `GET /services` to `ServiceRepository.list` and the JSON response matches the mocked result.
- **Get by name** : verifies success and not-found outcomes for `GET /services/:name`, including status codes and body payloads.
- **Create service** : checks that input normalization, duplicate detection, and repository persistence all run during `POST /services`.
- **Update service** : validates the branch that renames a service while guarding against name conflicts, ensuring the repository receives the correct data.
- **Delete service** : covers both successful and failing calls to `DELETE /services/:name`, propagating the repository outcome to HTTP responses.

Just like the schedule suite, these tests mount the real router/controller/service stack and stub only the repository methods, giving confidence that the workflow wiring behaves as expected without real database operations.
