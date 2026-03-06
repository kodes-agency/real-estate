"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";

import { submitVisitRequest } from "@/actions/submit-visit-request";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { DynamicIcon } from "@/components/dynamic-icon";
import { GoldButton } from "../ui/gold-button";

// Schema must match the server action schema
const formSchema = z.object({
  firstName: z.string().min(1, "Моля въведете име"),
  lastName: z.string().min(1, "Моля въведете фамилия"),
  email: z.email("Невалиден имейл адрес"),
  phone: z.string().min(1, "Моля въведете телефон"),
  property: z.string().min(1, "ID на имота е задължително"),
  website: z.string(),
});

type VisitRequestFormProps = {
  propertyId: string;
};

export function VisitRequestForm({ propertyId }: VisitRequestFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      property: propertyId,
      website: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await submitVisitRequest({
        ...value,
        property: Number(value.property),
      });
      if (result.success) {
        setIsSubmitted(true);
        // Toast is optional here since we are showing a dedicated success message,
        // but it doesn't hurt to have it as well or we can remove it.
        // Keeping it for double confirmation, but localized.
        // toast.success("Заявката е изпратена успешно!");
      } else {
        toast.error(result.message || "Възникна грешка при изпращането.");
      }
    },
  });

  if (isSubmitted) {
    return (
      <Card className="w-full border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
            <DynamicIcon name="Check" className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold">Благодарим Ви!</h3>
          <p className="text-muted-foreground max-w-xs">
            Ще се свържем с Вас възможно най-скоро.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ring-0">
      <CardHeader className="">
        <CardTitle className="text-xl">Заяви оглед</CardTitle>
        <CardDescription>
          Попълнете формата по-долу, за да заявите оглед за този имот. Ние ще се
          свържем с Вас възможно най-скоро за да уточним точен час в удобен за
          Вас ден.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <form
          id="visit-request-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-4">
            {/* Hidden Property ID Field */}
            <form.Field
              name="property"
              children={(field) => (
                <input
                  type="hidden"
                  {...field.state}
                  value={field.state.value}
                />
              )}
            />

            {/* Honeypot Field */}
            <form.Field
              name="website"
              children={(field) => (
                <div
                  aria-hidden="true"
                  className="hidden absolute left-[-9999px]"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    {...field.state}
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="firstName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Име</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Иван"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="lastName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Фамилия</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Петров"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Имейл</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="email"
                      placeholder="ivan.petrov@example.com"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="phone"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Телефон</FieldLabel>
                    <PhoneInput
                      international
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => field.handleChange(value || "")}
                      defaultCountry="BG"
                      placeholder="+359 888 123 456"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <GoldButton
            type="submit"
            form="visit-request-form"
            className="w-full mt-4 rounded-md shadow-md/30 bg-black text-white hover:bg-foreground py-4"
            borderWidth={2}
          >
            Изпрати заявка
          </GoldButton>
          <p className="text-center text-xs text-muted-foreground mt-4">
            С натискането на бутона "Изпрати заявка" се съгласявате с нашата{" "}
            <Link href="/policy" className="underline">
              политика за поверителност
            </Link>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
