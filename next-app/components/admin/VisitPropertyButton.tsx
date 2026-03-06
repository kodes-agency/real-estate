"use client";

import React from "react";
import { useDocumentInfo } from "@payloadcms/ui";
import type { BeforeDocumentControlsClientProps } from "payload";

export function VisitPropertyButton(props: BeforeDocumentControlsClientProps) {
  const { initialData } = useDocumentInfo();
  const slug = initialData?.slug as string | undefined;

  if (!slug) {
    return null;
  }

  const href = `http://localhost:3000/imoti/${slug}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 15px",
        backgroundColor: "var(--theme-elevation-100)",
        color: "var(--theme-text)",
        textDecoration: "none",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: 500,
        marginRight: "8px",
        border: "1px solid var(--theme-elevation-150)",
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-elevation-150)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--theme-elevation-100)";
      }}
    >
      Разгледай имот
    </a>
  );
}
