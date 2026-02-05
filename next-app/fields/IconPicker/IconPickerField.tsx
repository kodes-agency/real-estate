"use client";

import * as PhosphorIcons from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useField, FieldLabel } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

import "./styles.scss";

// Get all icon names from Phosphor (filter out non-icon exports)
// Helper to get formatted icon names
const getFilteredIconNames = (): string[] => {
  const excluded = new Set([
    "IconContext",
    "IconBase",
    "IconWeight",
    "IconProps",
    "SSR",
    "default",
  ]);

  return Object.keys(PhosphorIcons).filter((key) => {
    if (excluded.has(key)) return false;
    const item = (PhosphorIcons as Record<string, unknown>)[key];
    return (
      typeof item === "function" || (typeof item === "object" && item !== null)
    );
  });
};

// Get icon component by name
const getIconComponent = (name: string): PhosphorIcon | null => {
  //   @ts-ignore
  const icon = (PhosphorIcons as unknown as Record<string, PhosphorIcon>)[name];
  return icon || null;
};

export const IconPickerField: React.FC<TextFieldClientProps> = (props) => {
  const { field, path } = props;
  const { value, setValue } = useField<string>({ path });

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const icons = getFilteredIconNames();
    setAvailableIcons(icons);
    if (icons.length === 0) {
      setDebugInfo(
        `Debug: 0 icons. Keys: ${Object.keys(PhosphorIcons).length}`,
      );
    }
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return availableIcons.slice(0, 150);
    }
    const searchLower = search.toLowerCase();
    return availableIcons
      .filter((name) => name.toLowerCase().includes(searchLower))
      .slice(0, 150);
  }, [search, availableIcons]);

  // Get the selected icon component
  const SelectedIcon = value ? getIconComponent(value) : null;

  // Handle icon selection
  const handleSelect = (iconName: string) => {
    setValue(iconName);
    setIsOpen(false);
    setSearch("");
  };

  // Handle clear
  const handleClear = () => {
    setValue("");
  };

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="icon-picker-field">
      <FieldLabel
        label={field.label || "Icon"}
        path={path}
        required={field.required}
      />

      <div className="icon-picker-field__control">
        <button
          type="button"
          className="icon-picker-field__trigger"
          onClick={() => setIsOpen(true)}
        >
          {SelectedIcon ? (
            <div className="icon-picker-field__selected">
              <SelectedIcon size={24} weight="regular" />
              <span className="icon-picker-field__name">{value}</span>
            </div>
          ) : (
            <span className="icon-picker-field__placeholder">
              Изберете икона...
            </span>
          )}
        </button>

        {value && (
          <button
            type="button"
            className="icon-picker-field__clear"
            onClick={handleClear}
            aria-label="Clear icon"
          >
            <PhosphorIcons.XIcon size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="icon-picker-field__overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="icon-picker-field__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="icon-picker-field__header">
              <h3>
                Изберете икона ({availableIcons.length} налични) {debugInfo}
              </h3>
              <button
                type="button"
                className="icon-picker-field__close"
                onClick={() => setIsOpen(false)}
              >
                <PhosphorIcons.XIcon size={20} />
              </button>
            </div>

            <div className="icon-picker-field__search">
              <PhosphorIcons.MagnifyingGlassIcon
                size={18}
                className="icon-picker-field__search-icon"
              />
              <input
                type="text"
                placeholder="Търсене на икони..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="icon-picker-field__grid">
              {filteredIcons.map((iconName) => {
                const IconComponent = getIconComponent(iconName);
                if (!IconComponent) return null;

                return (
                  <button
                    key={iconName}
                    type="button"
                    className={`icon-picker-field__icon ${value === iconName ? "icon-picker-field__icon--selected" : ""}`}
                    onClick={() => handleSelect(iconName)}
                    title={iconName}
                  >
                    <IconComponent size={24} weight="regular" />
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="icon-picker-field__empty">
                Няма намерени икони за "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPickerField;
