"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { submitPropertyRequest } from "@/actions/submit-property-request";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DynamicIcon } from "@/components/dynamic-icon";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import { GoldButton } from "../ui/gold-button";

// Schema for client-side validation
const formSchema = z.object({
  firstName: z.string().min(1, "Моля въведете име"),
  lastName: z.string().min(1, "Моля въведете фамилия"),
  email: z.email("Невалиден имейл адрес"),
  phone: z.string().min(1, "Моля въведете телефон"),
  // title removed from form
  purpose: z.string().min(1, "Моля изберете цел"),
  category: z.coerce.number().min(1, "Моля изберете категория"),
  city: z.string().min(1, "Моля въведете населено място"),
  region: z.string().min(1, "Моля въведете област"),
  price: z.coerce.number().min(0, "Моля въведете цена"),
  size: z.coerce.number().min(0, "Моля въведете площ"),
  description: z.string().min(1, "Моля въведете описание"),
  images: z.array(z.any()).optional(), // Handled by FileUpload
  website: z.string(),
});

type Option = {
  id: number;
  title: string;
  [key: string]: any;
};

type PublishPropertyFormProps = {
  categories: Option[];
  mode?: "evaluation" | "client-sale";
  title?: string;
  description?: string;
  className?: string;
};

export function PublishPropertyForm({
  categories,
  mode = "client-sale",
  title,
  description,
  className,
}: PublishPropertyFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      // title: "",
      purpose: "",
      category: "" as unknown as number,
      city: "",
      region: "",
      price: "" as unknown as number,
      size: "" as unknown as number,
      description: "",
      images: [] as File[],
      website: "",
      requestType: mode,
    },
    validators: {
      onSubmit: formSchema as any,
    },
    onSubmit: async ({ value }) => {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("firstName", value.firstName);
      formData.append("lastName", value.lastName);
      formData.append("email", value.email);
      formData.append("phone", value.phone);
      // formData.append("title", value.title);
      formData.append("purpose", value.purpose);
      formData.append("category", value.category.toString());
      formData.append("city", value.city);
      formData.append("region", value.region);
      formData.append("price", value.price.toString());
      formData.append("size", value.size.toString());
      formData.append("description", value.description);
      formData.append("requestType", value.requestType);

      if (value.website) formData.append("website", value.website);

      if (value.images && value.images.length > 0) {
        value.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const result = await submitPropertyRequest(formData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        toast.error(result.message || "Възникна грешка при изпращането.");
      }
    },
  });

  if (isSubmitted) {
    return (
      <Card
        className={cn(
          "w-full h-full border-none shadow-none flex flex-col justify-center",
          className,
        )}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
            <DynamicIcon name="Check" className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold">
            {mode === "evaluation"
              ? "Заявката за оценка е изпратена!"
              : "Обявата е изпратена!"}
          </h3>
          <p className="text-muted-foreground max-w-xs">
            Наш сътрудник ще прегледа информацията и ще се свърже с Вас.
          </p>
        </CardContent>
      </Card>
    );
  }

  const defaultTitle =
    mode === "evaluation" ? "Заяви оценка на имот" : "Публикуване на имот";
  const defaultDescription =
    mode === "evaluation"
      ? "Попълнете формата, за да получите професионална пазарна оценка."
      : "Попълнете формата по-долу, за да изпратите вашия имот за одобрение.";

  return (
    <form
      id="publish-property-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("flex flex-col h-full bg-background", className)}
    >
      {/* Hidden Fields */}
      <form.Field
        name="website"
        children={(field) => (
          <div aria-hidden="true" className="hidden absolute left-[-9999px]">
            <input
              name={field.name}
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}
      />
      <form.Field
        name="requestType"
        children={(field) => (
          <input
            type="hidden"
            name={field.name}
            value={field.state.value || ""}
          />
        )}
      />

      {/* Header - Fixed */}
      <div className="flex-none p-6 border-b z-10 bg-background relative">
        <h2 className="text-xl font-semibold mb-2 pr-8">
          {title || defaultTitle}
        </h2>
        <p className="text-muted-foreground text-sm">
          {description || defaultDescription}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="space-y-10 pb-4">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">Лични данни</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Информация за контакт с Вас.
              </p>
            </div>
            <div className="sm:max-w-3xl md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="firstName"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Име</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Иван"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="lastName"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Фамилия</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Петров"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="email"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Имейл</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="email"
                          placeholder="ivan@example.com"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="phone"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Телефон</FieldLabel>
                        <PhoneInput
                          international
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(value) => field.handleChange(value || "")}
                          defaultCountry="BG"
                          className=""
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Information Section */}
          <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">
                Информация за имота
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Основни характеристики и локация.
              </p>
            </div>
            <div className="sm:max-w-3xl md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="purpose"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Цел</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val || "")}
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue placeholder="Изберете цел">
                              {field.state.value === "for_sale"
                                ? "Продажба"
                                : field.state.value === "for_rent"
                                  ? "Наем"
                                  : "Изберете цел"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="for_sale">Продажба</SelectItem>
                            <SelectItem value="for_rent">Наем</SelectItem>
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="category"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Категория</FieldLabel>
                        <Select
                          value={field.state.value?.toString()}
                          onValueChange={(val) =>
                            field.handleChange(Number(val))
                          }
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue placeholder="Изберете категория">
                              {categories.find(
                                (c) =>
                                  c.id.toString() ===
                                  field.state.value?.toString(),
                              )?.title || "Изберете категория"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>

                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="region"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Област</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Напр. София-град"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="city"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>
                          Населено място
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Напр. София"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>

                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="price"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Цена (€)</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          placeholder="50000"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
                <div className="col-span-full sm:col-span-3">
                  <form.Field
                    name="size"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Площ (м²)</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          placeholder="75"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <form.Field
                    name="description"
                    children={(field) => (
                      <Field
                        className="gap-2"
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel htmlFor={field.name}>Описание</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Допълнителна информация за имота..."
                          className="min-h-[100px]"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Images Section */}
          <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">Изображения</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Добавете снимки на имота. Максимален размер на файл 10MB.
              </p>
            </div>
            <div className="sm:max-w-3xl md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-full">
                  <form.Field
                    name="images"
                    children={(field) => (
                      <Field className="gap-2">
                        <ImageUpload
                          initialFiles={field.state.value}
                          onImagesChange={(files) => field.handleChange(files)}
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-none p-6 border-t bg-background">
        <div className="flex justify-end">
          <GoldButton
            type="submit"
            borderWidth={2}
            className="w-full sm:w-auto py-4 rounded-md shadow-md/30 bg-black text-white hover:bg-foreground"
          >
            Изпрати
          </GoldButton>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          С натискането на бутона "Изпрати" се съгласявате с нашата{" "}
          <Link href="/policy" className="underline">
            политика за поверителност
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
