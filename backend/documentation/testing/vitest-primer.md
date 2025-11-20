# Vitest Testing Primer

## Test Runner Structure
- **`describe()`** groups related tests. In this project we wrap service and schedule specs inside `describe("... routes workflow", () => { ... })` to share setup logic.
- **`test()` / `it()`** define an individual scenario. Each `test` executes the Express router through our `requestApp` helper and finishes by asserting HTTP status codes, response bodies and repository interactions.
- **`beforeEach()`** runs before every test inside the same `describe`. We reset each mocked function so prior calls do not leak into the next scenario.
- **`expect()`** provides fluent assertions (e.g., `expect(response.status).toBe(200)`), sourced from Vitest's built-in `@vitest/expect` package.

## Mocking with `vi`
Vitest's `vi` namespace is similar to Jest's `jest` object and powers mock behavior.

- **`vi.fn()`** creates a spy/mock function. We build repository stand-ins such as `const serviceRepoMock = { list: vi.fn(), ... }`; these track arguments and support resolved values.
- **`vi.mock(modulePath, factory)`** tells Vitest to replace imports of that module with our custom factory return. Example:
  ```js
  vi.mock("../../repositories/service.repository.js", () => ({
    ServiceRepository: serviceRepoMock,
  }));
  ```
  When the router imports `ServiceRepository`, it receives the mock object instead of the real implementation, letting us assert how the service layer interacts with the repository without touching the database.
- **`mockResolvedValue()` / `mockResolvedValueOnce()`** configure async return values. We simulate successful queries (`mockResolvedValue(rows)`) or error cases (`mockResolvedValueOnce(null)`).
- **`mockReset()`** clears call history and behavior. In `beforeEach` we call `Object.values(serviceRepoMock).forEach(fn => fn.mockReset())` so each test starts clean.

## Running the Suite
- `npm test` or `vitest run` executes the entire suite once.
- `npm run test:watch` starts Vitest in watch mode, re-running specs on file changes.

## Request Helper
To keep workflow tests close to real usage we built `tests/helpers/request.js`. It boots the Express app, sends an HTTP request using the built-in Fetch API, parses the response, and shuts down the server. Because only the repository layer is mocked, the request traverses router ? controller ? service ? validator, mirroring production wiring.

Use this file as a quick reference when adding new Vitest specs or mocks elsewhere in the codebase.
