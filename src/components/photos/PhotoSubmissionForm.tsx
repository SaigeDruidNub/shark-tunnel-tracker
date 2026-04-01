import { useId, useRef, useState } from "react";
import { writeClient } from "../../lib/sanity/client";
import { stops } from "../../data/stops";
import styles from "./PhotoSubmissionForm.module.css";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type FormStatus = "idle" | "uploading" | "success" | "error";

export function PhotoSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputId = useId();
  const captionId = useId();
  const nameId = useId();
  const stopId = useId();
  const youtubeId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function validateAndSetFile(selected: File) {
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError("Please select a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFileError("Image must be 10 MB or smaller.");
      return;
    }
    setFileError(null);
    setFile(selected);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    setFile(null);
    if (selected) validateAndSetFile(selected);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    setFile(null);
    validateAndSetFile(droppedFile);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "uploading") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const caption = (data.get("caption") as string).trim();
    const submitterName = (data.get("submitterName") as string).trim();
    const videoUrl = (data.get("videoUrl") as string).trim() || undefined;
    const relatedStopId = (data.get("relatedStopId") as string) || undefined;

    if (!file && !videoUrl) {
      setFileError("Please upload a photo or enter a YouTube URL.");
      return;
    }

    setStatus("uploading");
    setErrorMessage(null);

    try {
      let imageRef:
        | { _type: "image"; asset: { _type: "reference"; _ref: string } }
        | undefined;

      if (file) {
        const asset = await writeClient.assets.upload("image", file, {
          filename: file.name,
          contentType: file.type,
        });
        imageRef = {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        };
      }

      await writeClient.create({
        _type: "photoSubmission",
        caption,
        submitterName,
        submittedAt: new Date().toISOString(),
        approved: false,
        ...(imageRef && { image: imageRef }),
        ...(videoUrl && { videoUrl }),
        ...(relatedStopId && { relatedStopId }),
      });

      setStatus("success");
      setFile(null);
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again in a moment.");
    }
  }

  function handleReset() {
    setStatus("idle");
    setFile(null);
    setFileError(null);
    setErrorMessage(null);
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successHeading}>Thanks for sharing! 🦈</p>
        <p className={styles.successBody}>
          Your submission is under review and will appear in the gallery once
          approved.
        </p>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
        >
          Submit another
        </button>
      </div>
    );
  }

  const isUploading = status === "uploading";

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Submit a photo or video"
    >
      <h3 className={styles.title}>Submit Your Photo</h3>
      <p className={styles.subtitle}>
        Spotted the Shark Tunnel? Snap a photo and share it with the KidWind
        community!
      </p>

      <div className={styles.formBody}>
        {/* Left: upload box */}
        <div className={styles.dropzoneCol}>
          <div
            className={`${styles.dropzone}${isDragOver ? ` ${styles.dropzoneActive}` : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <label htmlFor={fileInputId} className={styles.dropzoneLabel}>
              <span className={styles.uploadIconBox} aria-hidden="true">
                ↑
              </span>
              <span className={styles.dropzoneText}>
                {file ? file.name : "Tap or drag a photo"}
              </span>
              <input
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className={styles.hiddenInput}
                onChange={handleFileChange}
                disabled={isUploading}
                aria-describedby={fileError ? `${fileInputId}-error` : undefined}
              />
            </label>
          </div>
          {fileError && (
            <p id={`${fileInputId}-error`} className={styles.fieldError} role="alert">
              {fileError}
            </p>
          )}
          <p className={styles.hint}>JPEG, PNG, WebP, GIF · 10 MB</p>
        </div>

        {/* Right: fields */}
        <div className={styles.fieldsCol}>
          <div className={styles.field}>
            <label htmlFor={nameId} className={styles.label}>
              Your name <span className={styles.optional}>(required)</span>
            </label>
            <input
              id={nameId}
              name="submitterName"
              type="text"
              required
              maxLength={100}
              className={styles.input}
              placeholder="Alex K."
              disabled={isUploading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={youtubeId} className={styles.label}>
              YouTube link <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id={youtubeId}
              name="videoUrl"
              type="url"
              className={styles.input}
              placeholder="https://youtube.com/..."
              disabled={isUploading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={captionId} className={styles.label}>
              Caption <span className={styles.optional}>(required)</span>
            </label>
            <input
              id={captionId}
              name="caption"
              type="text"
              required
              maxLength={200}
              className={styles.input}
              placeholder="The shark made it!"
              disabled={isUploading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={stopId} className={styles.label}>
              Which stop? <span className={styles.optional}>(optional)</span>
            </label>
            <select
              id={stopId}
              name="relatedStopId"
              className={styles.select}
              disabled={isUploading}
            >
              <option value="">— pick a stop —</option>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}, {s.state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isUploading}
        aria-disabled={isUploading}
      >
        {isUploading ? "Uploading…" : "Submit Photo"}
      </button>
    </form>
  );
}
