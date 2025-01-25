import React from "react";
import { useRecordContext } from "react-admin";

export const ImageDetails: React.FC = () => {
  const record = useRecordContext();
  if (!record || !record.color) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <img
        src={record.url}
        alt={record.color.name}
        style={{ maxWidth: "200px", borderRadius: "8px" }}
      />
      <div>
        <strong>Color Name:</strong> {record.color.name}
      </div>
      <div>
        <strong>Color Hex:</strong>{" "}
        <span
          style={{
            backgroundColor: record.color.hex,
            padding: "0.2rem 0.5rem",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          {record.color.hex}
        </span>
      </div>
      <div>
        <strong>Sizes:</strong>
        <ul>
          {record.color.sizes.map((size: any) => (
            <li key={size.id}>{size.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};