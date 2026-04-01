import { useFormValue } from "sanity";
import { StringInputProps } from "sanity";

/**
 * Custom input for the videoUrl field on photoSubmission.
 * Renders the default URL input plus a clickable link to the video
 * so reviewers can open it directly from the studio without copy-pasting.
 */
export function YouTubeLinkInput(props: StringInputProps) {
  const value = useFormValue(props.path) as string | undefined;

  return (
    <div>
      {props.renderDefault(props)}
      {value && (
        <div style={{ marginTop: "0.5rem" }}>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#e53e3e",
              textDecoration: "underline",
            }}
          >
            ▶ Open video to review ↗
          </a>
        </div>
      )}
    </div>
  );
}
