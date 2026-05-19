"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  CandidateNote,
  CandidatePayload,
  CandidateRecord,
  RecordStage,
  RecordStatus,
} from "../../../lib/api";
import {
  addNote,
  deleteNote,
  fetchNotes,
  fetchRecordById,
  patchRecord,
  updateRecord,
} from "../../../lib/api";

type FetchStatus = "loading" | "success" | "error";

type CandidateFormState = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
};

type CandidateFormErrors = Partial<Record<keyof CandidateFormState, string>>;

const STATUS_VALUES: RecordStatus[] = ["received", "in_progress", "selected", "discarded"];
const STAGE_VALUES: RecordStage[] = [
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

function formatDate(value: string | undefined): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateRequiredCandidateFields(payload: CandidateFormState): CandidateFormErrors {
  const errors: CandidateFormErrors = {};

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

function toFormState(candidateData: CandidateRecord): CandidateFormState {
  return {
    full_name: candidateData.full_name || "",
    email: candidateData.email || "",
    phone: candidateData.phone || "",
    position: candidateData.position || "",
    linkedin_url: candidateData.linkedin_url || "",
    cv_url: candidateData.cv_url || "",
    experience_years: String(candidateData.experience_years ?? ""),
  };
}

export default function CanditeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");

  const [candidate, setCandidate] = useState<CandidateRecord | null>(null);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [fetchSuccessMessage, setFetchSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [statusDraft, setStatusDraft] = useState<RecordStatus>("received");
  const [stageDraft, setStageDraft] = useState<RecordStage>("pending");
  const [editForm, setEditForm] = useState<CandidateFormState>({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    linkedin_url: "",
    cv_url: "",
    experience_years: "",
  });
  const [editErrors, setEditErrors] = useState<CandidateFormErrors>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingStage, setSavingStage] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState("");

  async function loadCandidateAndNotes(recordId: string) {
    setLoading(true);
    setFetchStatus("loading");
    setFetchSuccessMessage("");
    setErrorMessage("");

    try {
      const [candidateData, notesData] = await Promise.all([
        fetchRecordById(recordId),
        fetchNotes(recordId),
      ]);

      if (!candidateData) {
        setFetchStatus("error");
        setErrorMessage("Candidate not found.");
        setCandidate(null);
        setNotes([]);
        return;
      }

      setCandidate(candidateData);
      setStatusDraft(candidateData.status || "received");
      setStageDraft(candidateData.stage || "pending");
      setEditForm(toFormState(candidateData));
      setEditErrors({});
      setNotes(notesData);
      setFetchStatus("success");
      setFetchSuccessMessage("Candidate and notes loaded successfully.");
    } catch (error) {
      setFetchStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch candidate details.");
      setCandidate(null);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    void loadCandidateAndNotes(id);
  }, [id]);

  async function handlePatchStatus() {
    if (!id || !statusDraft) {
      return;
    }

    setSavingStatus(true);
    setInfoMessage("");
    setErrorMessage("");

    try {
      const updated = await patchRecord(id, { status: statusDraft });
      setCandidate(updated);
      setStatusDraft(updated.status || statusDraft);
      setStageDraft(updated.stage || stageDraft);
      setInfoMessage("Status updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handlePatchStage() {
    if (!id || !stageDraft) {
      return;
    }

    setSavingStage(true);
    setInfoMessage("");
    setErrorMessage("");

    try {
      const updated = await patchRecord(id, { stage: stageDraft });
      setCandidate(updated);
      setStatusDraft(updated.status || statusDraft);
      setStageDraft(updated.stage || stageDraft);
      setInfoMessage("Stage updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update stage.");
    } finally {
      setSavingStage(false);
    }
  }

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = noteContent.trim();
    if (!content || !id) {
      return;
    }

    setSavingNote(true);
    setInfoMessage("");
    setErrorMessage("");

    try {
      await addNote(id, content);
      setNoteContent("");

      const [candidateData, notesData] = await Promise.all([
        fetchRecordById(id),
        fetchNotes(id),
      ]);

      if (candidateData) {
        setCandidate(candidateData);
        setStatusDraft(candidateData.status || statusDraft);
        setStageDraft(candidateData.stage || stageDraft);
      }

      setNotes(notesData);
      setInfoMessage("Note added successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add note.");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!id || !noteId) {
      return;
    }

    setDeletingNoteId(noteId);
    setInfoMessage("");
    setErrorMessage("");

    try {
      await deleteNote(id, noteId);

      const [candidateData, notesData] = await Promise.all([
        fetchRecordById(id),
        fetchNotes(id),
      ]);

      if (candidateData) {
        setCandidate(candidateData);
        setStatusDraft(candidateData.status || statusDraft);
        setStageDraft(candidateData.stage || stageDraft);
      }

      setNotes(notesData);
      setInfoMessage("Note deleted successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete note.");
    } finally {
      setDeletingNoteId("");
    }
  }

  function updateEditField(field: keyof CandidateFormState, value: string) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setEditErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id) {
      return;
    }

    setInfoMessage("");
    setErrorMessage("");

    const validationErrors = validateRequiredCandidateFields(editForm);
    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("Please complete required fields before submitting.");
      return;
    }

    setSavingEdit(true);

    try {
      const payload: CandidatePayload = {
        full_name: editForm.full_name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        position: editForm.position.trim(),
        linkedin_url: editForm.linkedin_url.trim() || null,
        cv_url: editForm.cv_url.trim() || null,
        experience_years: Number(editForm.experience_years),
      };

      const updated = await updateRecord(id, payload);
      setCandidate(updated);
      setStatusDraft(updated.status || statusDraft);
      setStageDraft(updated.stage || stageDraft);
      setEditForm(toFormState(updated));
      setInfoMessage("Candidate updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update candidate.");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <main>
      <section className="panel">
        <Link className="back" href="/candites">
          Back to candidates list
        </Link>

        <h1>Candidate detail</h1>

        {fetchStatus === "loading" ? <p className="meta">Loading candidate data...</p> : null}

        {fetchStatus === "error" && errorMessage ? (
          <p className="meta" style={{ color: "#b91c1c" }}>
            {errorMessage}
          </p>
        ) : null}

        {fetchStatus === "success" && fetchSuccessMessage ? (
          <p className="meta" style={{ color: "#0f766e" }}>
            {fetchSuccessMessage}
          </p>
        ) : null}

        {fetchStatus === "success" && infoMessage ? (
          <p className="meta" style={{ color: "#0f766e" }}>
            {infoMessage}
          </p>
        ) : null}

        {!loading && fetchStatus === "success" && candidate ? (
          <>
            <h2 style={{ marginTop: "14px", marginBottom: "10px" }}>{candidate.full_name}</h2>

            <div className="grid" style={{ marginBottom: "16px" }}>
              <div>
                <div className="label">Name</div>
                <div className="value">{candidate.full_name}</div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">{candidate.email}</div>
              </div>
              <div>
                <div className="label">Phone</div>
                <div className="value">{candidate.phone}</div>
              </div>
              <div>
                <div className="label">Position Applied For</div>
                <div className="value">{candidate.position}</div>
              </div>
              <div>
                <div className="label">LinkedIn</div>
                <div className="value">{candidate.linkedin_url || "-"}</div>
              </div>
              <div>
                <div className="label">CV Link</div>
                <div className="value">{candidate.cv_url || "-"}</div>
              </div>
              <div>
                <div className="label">Years of Experience</div>
                <div className="value">{candidate.experience_years}</div>
              </div>
              <div>
                <div className="label">Current Status</div>
                <div className="value">{titleCase(candidate.status)}</div>
              </div>
              <div>
                <div className="label">Current Stage</div>
                <div className="value">{titleCase(candidate.stage)}</div>
              </div>
              <div>
                <div className="label">Application Date</div>
                <div className="value">{formatDate(candidate.applied_at)}</div>
              </div>
            </div>

            <div className="grid" style={{ marginBottom: "16px", gap: "10px" }}>
              <div className="label">Edit candidate data</div>
              <form onSubmit={handleEditSubmit} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
                  <label>
                    <span className="meta">Full name *</span>
                    <input
                      value={editForm.full_name}
                      onChange={(event) => updateEditField("full_name", event.target.value)}
                      style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                    />
                    {editErrors.full_name ? <span className="meta" style={{ color: "#b91c1c" }}>{editErrors.full_name}</span> : null}
                  </label>

                  <label>
                    <span className="meta">Email *</span>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(event) => updateEditField("email", event.target.value)}
                      style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                    />
                    {editErrors.email ? <span className="meta" style={{ color: "#b91c1c" }}>{editErrors.email}</span> : null}
                  </label>
                </div>

                <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
                  <label>
                    <span className="meta">Phone *</span>
                    <input
                      value={editForm.phone}
                      onChange={(event) => updateEditField("phone", event.target.value)}
                      style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                    />
                    {editErrors.phone ? <span className="meta" style={{ color: "#b91c1c" }}>{editErrors.phone}</span> : null}
                  </label>

                  <label>
                    <span className="meta">Position *</span>
                    <input
                      value={editForm.position}
                      onChange={(event) => updateEditField("position", event.target.value)}
                      style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                    />
                    {editErrors.position ? <span className="meta" style={{ color: "#b91c1c" }}>{editErrors.position}</span> : null}
                  </label>
                </div>

                <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "repeat(2, minmax(160px, 1fr))" }}>
                  <label>
                    <span className="meta">LinkedIn URL</span>
                    <input
                      value={editForm.linkedin_url}
                      onChange={(event) => updateEditField("linkedin_url", event.target.value)}
                      style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                    />
                  </label>

                  <label>
                    <span className="meta">CV URL</span>
                    <input
                      value={editForm.cv_url}
                      onChange={(event) => updateEditField("cv_url", event.target.value)}
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
                    value={editForm.experience_years}
                    onChange={(event) => updateEditField("experience_years", event.target.value)}
                    style={{ width: "100%", marginTop: "4px", padding: "7px" }}
                  />
                  {editErrors.experience_years ? (
                    <span className="meta" style={{ color: "#b91c1c" }}>{editErrors.experience_years}</span>
                  ) : null}
                </label>

                <div>
                  <button type="submit" disabled={savingEdit} style={{ padding: "8px 12px", fontWeight: 700 }}>
                    {savingEdit ? "Saving..." : "Save candidate changes"}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid" style={{ marginBottom: "16px", gap: "12px" }}>
              <div>
                <div className="label">Update status</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value as RecordStatus)}
                    style={{ minWidth: "220px", padding: "8px" }}
                  >
                    {STATUS_VALUES.map((status) => (
                      <option key={status} value={status}>
                        {titleCase(status)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handlePatchStatus}
                    disabled={savingStatus || !statusDraft}
                    style={{ padding: "8px 12px", fontWeight: 700 }}
                  >
                    {savingStatus ? "Saving..." : "Save status"}
                  </button>
                </div>
              </div>

              <div>
                <div className="label">Update stage</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                  <select
                    value={stageDraft}
                    onChange={(event) => setStageDraft(event.target.value as RecordStage)}
                    style={{ minWidth: "220px", padding: "8px" }}
                  >
                    {STAGE_VALUES.map((stage) => (
                      <option key={stage} value={stage}>
                        {titleCase(stage)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handlePatchStage}
                    disabled={savingStage || !stageDraft}
                    style={{ padding: "8px 12px", fontWeight: 700 }}
                  >
                    {savingStage ? "Saving..." : "Save stage"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid" style={{ gap: "12px" }}>
              <div>
                <div className="label">Notes</div>
                {notes.length === 0 ? (
                  <p className="meta" style={{ marginTop: "8px" }}>
                    No notes yet.
                  </p>
                ) : (
                  <ul className="list">
                    {notes.map((note) => (
                      <li key={note.id} style={{ padding: "10px 6px" }}>
                        <div style={{ fontWeight: 600 }}>{note.content}</div>
                        <div className="meta" style={{ marginTop: "4px", marginBottom: "8px" }}>
                          {formatDate(note.created_at || note.updated_at)}
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteNote(note.id)}
                          disabled={deletingNoteId === note.id}
                          style={{ padding: "6px 10px" }}
                        >
                          {deletingNoteId === note.id ? "Deleting..." : "Delete note"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form onSubmit={handleAddNote}>
                <div className="label">Add new note</div>
                <textarea
                  value={noteContent}
                  onChange={(event) => setNoteContent(event.target.value)}
                  rows={3}
                  style={{ width: "100%", marginTop: "6px", padding: "8px" }}
                  placeholder="Write an internal note"
                />
                <button
                  type="submit"
                  disabled={savingNote || !noteContent.trim()}
                  style={{ marginTop: "8px", padding: "8px 12px", fontWeight: 700 }}
                >
                  {savingNote ? "Adding..." : "Add note"}
                </button>
              </form>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
