"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { CandidatePayload, CandidateRecord, RecordStage, RecordStatus } from "../../lib/api";
import { createRecord, fetchRecords } from "../../lib/api";

type FilterState = {
  status: "" | RecordStatus;
  stage: "" | RecordStage;
};

type FetchStatus = "loading" | "success" | "error";

type CreateFormState = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
};

type CreateFormErrors = Partial<Record<keyof CreateFormState, string>>;

const STATUS_VALUES: Array<FilterState["status"]> = [
  "",
  "received",
  "in_progress",
  "selected",
  "discarded",
];

const STAGE_VALUES: Array<FilterState["stage"]> = [
  "",
  "pending",
  "review",
  "personal_interview",
  "technical_interview",
  "offer_presented",
];

function titleCase(value: string): string {
  return String(value || "")
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEmptyCreateForm(): CreateFormState {
  return {
    full_name: "",
    email: "",
    phone: "",
    position: "",
    linkedin_url: "",
    cv_url: "",
    experience_years: "",
  };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateRequiredCandidateFields(payload: CreateFormState): CreateFormErrors {
  const errors: CreateFormErrors = {};

  if (!payload.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!payload.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(payload.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.phone.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!payload.position.trim()) {
    errors.position = "Position is required.";
  }

  const experience = Number(payload.experience_years);
  if (!Number.isFinite(experience) || experience < 0) {
    errors.experience_years = "Experience years must be 0 or more.";
  }

  return errors;
}

function CanditesListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [records, setRecords] = useState<CandidateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [fetchSuccessMessage, setFetchSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [createForm, setCreateForm] = useState<CreateFormState>(getEmptyCreateForm());
  const [createErrors, setCreateErrors] = useState<CreateFormErrors>({});
  const [createSaving, setCreateSaving] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createMessageType, setCreateMessageType] = useState<"info" | "success" | "error">("info");

  const status = (searchParams.get("status") as FilterState["status"]) || "";
  const stage = (searchParams.get("stage") as FilterState["stage"]) || "";

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setFetchStatus("loading");
    setFetchSuccessMessage("");
    setErrorMessage("");

    try {
      const data = await fetchRecords({ status, stage });
      setRecords(data);
      setFetchStatus("success");
      setFetchSuccessMessage(`Candidates loaded: ${data.length}`);
    } catch (error) {
      setFetchStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  }, [status, stage]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  function updateFilter(key: keyof FilterState, value: FilterState[typeof key]) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function updateCreateField(field: keyof CreateFormState, value: string) {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setCreateErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  async function handleCreateCandidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateMessage("");

    const validationErrors = validateRequiredCandidateFields(createForm);
    setCreateErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setCreateMessage("Please complete required fields before submitting.");
      setCreateMessageType("error");
      return;
    }

    setCreateSaving(true);

    try {
      const payload: CandidatePayload = {
        full_name: createForm.full_name.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim(),
        position: createForm.position.trim(),
        linkedin_url: createForm.linkedin_url.trim() || null,
        cv_url: createForm.cv_url.trim() || null,
        experience_years: Number(createForm.experience_years),
      };

      await createRecord(payload);
      setCreateForm(getEmptyCreateForm());
      setCreateErrors({});
      setCreateMessage("Candidate registered successfully.");
      setCreateMessageType("success");
      await loadRecords();
    } catch (error) {
      setCreateMessage(error instanceof Error ? error.message : "Failed to register candidate.");
      setCreateMessageType("error");
    } finally {
      setCreateSaving(false);
    }
  }

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return records;
    }

    return records.filter((record) => {
      const fullName = String(record.full_name || "").toLowerCase();
      const email = String(record.email || "").toLowerCase();
      return fullName.includes(normalizedSearch) || email.includes(normalizedSearch);
    });
  }, [records, searchText]);

  return (
    <>
      <section className="panel">
        <h1>Register New Candidate</h1>
        <p className="meta">Submit via POST /records.</p>

        <form onSubmit={handleCreateCandidate} style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
            <label>
              <span className="meta">Full name *</span>
              <input
                value={createForm.full_name}
                onChange={(event) => updateCreateField("full_name", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
              {createErrors.full_name ? <span className="meta" style={{ color: "#b91c1c" }}>{createErrors.full_name}</span> : null}
            </label>

            <label>
              <span className="meta">Email *</span>
              <input
                type="email"
                value={createForm.email}
                onChange={(event) => updateCreateField("email", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
              {createErrors.email ? <span className="meta" style={{ color: "#b91c1c" }}>{createErrors.email}</span> : null}
            </label>
          </div>

          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
            <label>
              <span className="meta">Phone *</span>
              <input
                value={createForm.phone}
                onChange={(event) => updateCreateField("phone", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
              {createErrors.phone ? <span className="meta" style={{ color: "#b91c1c" }}>{createErrors.phone}</span> : null}
            </label>

            <label>
              <span className="meta">Position *</span>
              <input
                value={createForm.position}
                onChange={(event) => updateCreateField("position", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
              {createErrors.position ? <span className="meta" style={{ color: "#b91c1c" }}>{createErrors.position}</span> : null}
            </label>
          </div>

          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
            <label>
              <span className="meta">LinkedIn URL</span>
              <input
                value={createForm.linkedin_url}
                onChange={(event) => updateCreateField("linkedin_url", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
            </label>

            <label>
              <span className="meta">CV URL</span>
              <input
                value={createForm.cv_url}
                onChange={(event) => updateCreateField("cv_url", event.target.value)}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              />
            </label>
          </div>

          <label style={{ maxWidth: "220px" }}>
            <span className="meta">Years of experience *</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={createForm.experience_years}
              onChange={(event) => updateCreateField("experience_years", event.target.value)}
              style={{ width: "100%", marginTop: "4px", padding: "7px" }}
            />
            {createErrors.experience_years ? (
              <span className="meta" style={{ color: "#b91c1c" }}>{createErrors.experience_years}</span>
            ) : null}
          </label>

          <div>
            <button type="submit" disabled={createSaving} style={{ padding: "8px 12px", fontWeight: 700 }}>
              {createSaving ? "Submitting..." : "Register candidate"}
            </button>
          </div>

          {createMessage ? (
            <p className="meta" style={{ color: createMessageType === "error" ? "#b91c1c" : "#0f766e" }}>
              {createMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section className="panel" style={{ marginTop: "14px" }}>
        <h1>Candidates List</h1>
        <p className="meta">Fetched from GET /records.</p>

        <div style={{ display: "grid", gap: "10px", margin: "14px 0 4px" }}>
          <label>
            <span className="meta">Search by full name or email</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Type a name or email"
              style={{ width: "100%", marginTop: "4px", padding: "7px" }}
            />
          </label>

          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(120px, 220px))" }}>
            <label>
              <span className="meta">Filter by status</span>
              <select
                value={status}
                onChange={(event) => updateFilter("status", event.target.value as FilterState["status"])}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              >
                {STATUS_VALUES.map((value) => (
                  <option key={value || "all-status"} value={value}>
                    {value ? titleCase(value) : "All status"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="meta">Filter by stage</span>
              <select
                value={stage}
                onChange={(event) => updateFilter("stage", event.target.value as FilterState["stage"])}
                style={{ width: "100%", marginTop: "4px", padding: "7px" }}
              >
                {STAGE_VALUES.map((value) => (
                  <option key={value || "all-stage"} value={value}>
                    {value ? titleCase(value) : "All stage"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {fetchStatus === "error" && errorMessage ? (
          <p className="meta" style={{ color: "#b91c1c" }}>
            {errorMessage}
          </p>
        ) : null}

        {fetchStatus === "loading" ? <p className="meta">Loading candidates...</p> : null}

        {fetchStatus === "success" && fetchSuccessMessage ? (
          <p className="meta" style={{ color: "#0f766e" }}>
            {fetchSuccessMessage}
          </p>
        ) : null}

        {!loading && fetchStatus === "success" && filteredRecords.length === 0 ? (
          <p className="meta">No candidates found.</p>
        ) : null}

        {!loading && fetchStatus === "success" && filteredRecords.length > 0 ? (
          <ul className="list">
            {filteredRecords.map((record) => (
              <li key={record.id}>
                <Link className="row" href={`/candidates/${record.id}`}>
                  <div>
                    <strong>Full name:</strong> {record.full_name}
                  </div>
                  <div className="meta">
                    <strong>Position applied for:</strong> {record.position}
                  </div>
                  <div className="meta">
                    <strong>Current status:</strong> {titleCase(record.status)}
                  </div>
                  <div className="meta">
                    <strong>Current stage:</strong> {titleCase(record.stage)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </>
  );
}

export default function CanditesListPage() {
  return (
    <main>
      <Suspense
        fallback={
          <section className="panel">
            <p className="meta">Loading filters...</p>
          </section>
        }
      >
        <CanditesListContent />
      </Suspense>
    </main>
  );
}
