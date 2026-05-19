const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://playground.4geeks.com/tracker/api/v1";

async function parseJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractErrorMessage(body, fallback) {
  if (!body) {
    return fallback;
  }

  if (typeof body.detail === "string") {
    return body.detail;
  }

  if (Array.isArray(body.detail)) {
    return body.detail.map((item) => item?.msg || JSON.stringify(item)).join("; ");
  }

  if (typeof body.message === "string") {
    return body.message;
  }

  return fallback;
}

export async function fetchRecords(filters = {}) {
  const query = new URLSearchParams();
  query.set("limit", "100");

  if (filters.status) {
    query.set("status", filters.status);
  }

  if (filters.stage) {
    query.set("stage", filters.stage);
  }

  const response = await fetch(`${API_BASE}/records?${query.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch records (${response.status}): ${message}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export async function fetchRecordById(id) {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch record ${id} (${response.status}): ${message}`);
  }

  return response.json();
}

export async function createRecord(payload) {
  const response = await fetch(`${API_BASE}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to create record (${response.status}): ${message}`);
  }

  return response.json();
}

export async function updateRecord(id, payload) {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to update record ${id} (${response.status}): ${message}`);
  }

  return response.json();
}

export async function patchRecord(id, payload) {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to patch record ${id} (${response.status}): ${message}`);
  }

  return response.json();
}

export async function fetchNotes(id) {
  const response = await fetch(`${API_BASE}/records/${id}/notes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch notes for ${id} (${response.status}): ${message}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.notes)) {
    return data.notes;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export async function addNote(id, content) {
  const response = await fetch(`${API_BASE}/records/${id}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to add note to ${id} (${response.status}): ${message}`);
  }

  return parseJson(response);
}

export async function deleteNote(id, noteId) {
  const response = await fetch(`${API_BASE}/records/${id}/notes/${noteId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const body = await parseJson(response);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to delete note ${noteId} (${response.status}): ${message}`);
  }

  return null;
}
