"use client";

import { FormEvent, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

type Category = {
  slug: string;
  title: string;
};

type JournalFiltersProps = {
  categories: Category[];
  initialCategory: string;
  initialQuery: string;
};

function createFilterHref(pathname: string, query: string, category: string) {
  const parameters = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) parameters.set("q", normalizedQuery);
  if (category) parameters.set("category", category);

  const value = parameters.toString();
  return `${pathname}${value ? `?${value}` : ""}`;
}

export function JournalFilters({
  categories,
  initialCategory,
  initialQuery,
}: JournalFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  function navigate(nextQuery: string, nextCategory: string) {
    startTransition(() => {
      router.push(createFilterHref(pathname, nextQuery, nextCategory), {
        scroll: false,
      });
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(query, category);
  }

  function clear() {
    setQuery("");
    setCategory("");
    navigate("", "");
  }

  const hasFilters = Boolean(query.trim() || category);

  return (
    <form className="journal-filters" onSubmit={submit}>
      <label>
        <span>Yazılarda ara</span>
        <input
          disabled={isPending}
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Örn. Venüs"
          value={query}
        />
      </label>
      <label>
        <span>Kategori</span>
        <select
          disabled={isPending}
          name="category"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <button className="secondary-button" disabled={isPending} type="submit">
        {isPending ? "Filtreleniyor…" : "Filtrele"}
      </button>
      {hasFilters ? (
        <button
          className="text-action"
          disabled={isPending}
          onClick={clear}
          type="button"
        >
          Temizle
        </button>
      ) : null}
    </form>
  );
}
