import { useState, useEffect, useCallback } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, User, BookOpen, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router";
import { BACKEND_BASE_URL } from "@/constants";

type SearchResult = {
  users: Array<{ id: string; name: string; email: string; role: string }>;
  classes: Array<{
    id: number;
    name: string;
    inviteCode: string;
    status: string;
  }>;
  subjects: Array<{ id: number; name: string; code: string }>;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults(null);
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/api/search?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) return;
      const data: SearchResult = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type to search users, classes, subjects..."
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          search(value);
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {results && (
          <>
            {results.users.length > 0 && (
              <CommandGroup heading="Users">
                {results.users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      navigate(`/users/edit/${user.id}`);
                      setOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({user.role})
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.classes.length > 0 && (
              <CommandGroup heading="Classes">
                {results.classes.map((cls) => (
                  <CommandItem
                    key={cls.id}
                    onSelect={() => {
                      navigate(`/classes/show/${cls.id}`);
                      setOpen(false);
                    }}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{cls.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cls.inviteCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.subjects.length > 0 && (
              <CommandGroup heading="Subjects">
                {results.subjects.map((subject) => (
                  <CommandItem
                    key={subject.id}
                    onSelect={() => {
                      navigate(`/subjects/show/${subject.id}`);
                      setOpen(false);
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{subject.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {subject.code}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // We use a portal-based approach: the trigger just toggles state
  // and the actual dialog is rendered via CommandDialog
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md hover:bg-accent hover:text-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults(null);
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/api/search?q=${encodeURIComponent(q)}`
      );
      if (!res.ok) return;
      const data: SearchResult = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type to search users, classes, subjects..."
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          search(value);
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {results && (
          <>
            {results.users.length > 0 && (
              <CommandGroup heading="Users">
                {results.users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      navigate(`/users/edit/${user.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({user.role})
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.classes.length > 0 && (
              <CommandGroup heading="Classes">
                {results.classes.map((cls) => (
                  <CommandItem
                    key={cls.id}
                    onSelect={() => {
                      navigate(`/classes/show/${cls.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>{cls.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cls.inviteCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.subjects.length > 0 && (
              <CommandGroup heading="Subjects">
                {results.subjects.map((subject) => (
                  <CommandItem
                    key={subject.id}
                    onSelect={() => {
                      navigate(`/subjects/show/${subject.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{subject.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {subject.code}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
