export async function requestApp(app, { method = "GET", path = "/", query, body } = {}) {
  const server = await new Promise((resolve) => {
    const listener = app.listen(() => resolve(listener));
  });

  try {
    const url = new URL(`http://127.0.0.1:${server.address().port}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const options = { method, headers: {} };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
      options.headers["content-type"] = "application/json";
    }

    const response = await fetch(url, options);
    const text = await response.text();

    let parsed = undefined;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    return { status: response.status, body: parsed };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}
