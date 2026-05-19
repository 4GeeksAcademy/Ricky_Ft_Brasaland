const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://playground.4geeks.com/tracker/api/v1";

export type RecordStatus = "received" | "in_progress" | "selected" | "discarded";
export type RecordStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: RecordStatus;
  stage: RecordStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

export interface CandidateNote {
  id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface CandidatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  experience_years: number;
}

interface ApiValidationErrorItem {
  msg?: string;
}

interface ApiErrorBody {
  detail?: string | ApiValidationErrorItem[];
  message?: string;
}

async function parseJson(response: Response): Promise<unknown | null> {
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

function asApiErrorBody(input: unknown): ApiErrorBody | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  return input as ApiErrorBody;
}

function extractErrorMessage(body: ApiErrorBody | null, fallback: string): string {
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

function normalizeRecordArray(data: unknown): CandidateRecord[] {
  if (Array.isArray(data)) {
    return data as CandidateRecord[];
  }

  if (data && typeof data === "object") {
    const boxed = data as { items?: unknown; results?: unknown; data?: unknown };
    if (Array.isArray(boxed.items)) {
      return boxed.items as CandidateRecord[];
    }

    if (Array.isArray(boxed.results)) {
      return boxed.results as CandidateRecord[];
    }

    if (Array.isArray(boxed.data)) {
      return boxed.data as CandidateRecord[];
    }
  }

  return [];
}

function normalizeNotesArray(data: unknown): CandidateNote[] {
  if (Array.isArray(data)) {
    return data as CandidateNote[];
  }

  if (data && typeof data === "object") {
    const boxed = data as { notes?: unknown; data?: unknown };
    if (Array.isArray(boxed.notes)) {
      return boxed.notes as CandidateNote[];
    }

    if (Array.isArray(boxed.data)) {
      return boxed.data as CandidateNote[];
    }
  }

  return [];
}

export async function fetchRecords(filters: {
  status?: string;
  stage?: string;
} = {}): Promise<CandidateRecord[]> {
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
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch records (${response.status}): ${message}`);
  }

  const data = (await response.json()) as unknown;
  return normalizeRecordArray(data);
}

export async function fetchRecordById(id: string): Promise<CandidateRecord | null> {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch record ${id} (${response.status}): ${message}`);
  }

  return (await response.json()) as CandidateRecord;
}

export async function createRecord(payload: CandidatePayload): Promise<CandidateRecord> {
  const response = await fetch(`${API_BASE}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to create record (${response.status}): ${message}`);
  }

  return (await response.json()) as CandidateRecord;
}

export async function updateRecord(id: string, payload: CandidatePayload): Promise<CandidateRecord> {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to update record ${id} (${response.status}): ${message}`);
  }

  return (await response.json()) as CandidateRecord;
}

export async function patchRecord(
  id: string,
  payload: { status?: string; stage?: string },
): Promise<CandidateRecord> {
  const response = await fetch(`${API_BASE}/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to patch record ${id} (${response.status}): ${message}`);
  }

  return (await response.json()) as CandidateRecord;
}

export async function fetchNotes(id: string): Promise<CandidateNote[]> {
  const response = await fetch(`${API_BASE}/records/${id}/notes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to fetch notes for ${id} (${response.status}): ${message}`);
  }

  const data = (await response.json()) as unknown;
  return normalizeNotesArray(data);
}

export async function addNote(id: string, content: string): Promise<unknown | null> {
  const response = await fetch(`${API_BASE}/records/${id}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to add note to ${id} (${response.status}): ${message}`);
  }

  return parseJson(response);
}

export async function deleteNote(id: string, noteId: string): Promise<null> {
  const response = await fetch(`${API_BASE}/records/${id}/notes/${noteId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const parsed = await parseJson(response);
    const body = asApiErrorBody(parsed);
    const message = extractErrorMessage(body, response.statusText);
    throw new Error(`Failed to delete note ${noteId} (${response.status}): ${message}`);
  }

  return null;
}
