import type { Field } from "payload";

export interface IconPickerFieldOptions {
  name?: string;
  label?: string;
  required?: boolean;
  admin?: {
    description?: string;
    condition?: (data: unknown, siblingData: unknown) => boolean;
    width?: string;
  };
}

/**
 * Creates an icon picker field configuration for Payload CMS.
 * Uses Phosphor Icons and stores the icon name as a string.
 *
 * @example
 * // In your collection:
 * fields: [
 *   iconPickerField({
 *     label: 'Category Icon',
 *     required: true,
 *   }),
 * ]
 */
export const iconPickerField = (
  options: IconPickerFieldOptions = {},
): Field => {
  const {
    name = "icon",
    label = "Икона",
    required = false,
    admin = {},
  } = options;

  return {
    name,
    type: "text",
    label,
    required,
    admin: {
      ...admin,
      components: {
        Field: "@/fields/IconPicker/IconPickerField#IconPickerField",
      },
    },
  };
};

export default iconPickerField;
