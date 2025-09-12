"use client";

import { useState } from "react";
import { createNote } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewNote } from "../../types/note";
import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from '@/lib/stores/noteStore';

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "",
};

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const [values, setValues] = useState<NewNote>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof NewNote, string>>>(
    {}
  );

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const validate = (formValues: NewNote) => {
    const newErrors: typeof errors = {};

    if (!formValues.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formValues.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formValues.title.length > 50) {
      newErrors.title = "Title must be at most 50 characters";
    }

    if (formValues.content.length > 500) {
      newErrors.content = "Content must be at most 500 characters";
    }

    if (!formValues.tag) {
      newErrors.tag = "Tag is required";
    } else if (
      !["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(
        formValues.tag
      )
    ) {
      newErrors.tag = "Invalid tag";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    await mutation.mutateAsync(values);
    setValues(initialValues);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={values.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={values.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="">Choose tag</option>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
