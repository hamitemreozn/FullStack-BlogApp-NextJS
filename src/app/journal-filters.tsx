"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  const debounceTimer = useRef<number | undefined>(undefined);

  const cancelPendingSearch = useCallback(() => {
    if (debounceTimer.current !== undefined) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = undefined;
    }
  }, []);

  const navigate = useCallback(
    (
      nextQuery: string,
      nextCategory: string,
      navigation: "push" | "replace",
    ) => {
      cancelPendingSearch();
      const href = createFilterHref(pathname, nextQuery, nextCategory);

      startTransition(() => {
        router[navigation](href, { scroll: false });
      });
    },
    [cancelPendingSearch, pathname, router],
  );

  useEffect(() => {
    function syncFiltersFromHistory() {
      cancelPendingSearch();
      const parameters = new URLSearchParams(window.location.search);
      setQuery(parameters.get("q") ?? "");
      setCategory(parameters.get("category") ?? "");
    }

    window.addEventListener("popstate", syncFiltersFromHistory);
    return () => {
      window.removeEventListener("popstate", syncFiltersFromHistory);
    };
  }, [cancelPendingSearch]);

  useEffect(() => {
    if (query === initialQuery && category === initialCategory) {
      return;
    }

    debounceTimer.current = window.setTimeout(() => {
      debounceTimer.current = undefined;
      navigate(query, category, "replace");
    }, 300);

    return cancelPendingSearch;
  }, [
    cancelPendingSearch,
    category,
    initialCategory,
    initialQuery,
    navigate,
    query,
  ]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(query, category, "push");
  }

  function clear() {
    setQuery("");
    setCategory("");
    navigate("", "", "replace");
  }

  const hasFilters = Boolean(query.trim() || category);

  return (
    <form aria-busy={isPending} className="journal-filters" onSubmit={submit}>
      <label>
        <span>Yazılarda ara</span>
        <input
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Örn. Venüs"
          value={query}
        />
      </label>
      <label>
        <span>Kategori</span>
        <select
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
