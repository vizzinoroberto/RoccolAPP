"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

type ListItem = {
  id: string;
  text: string;
  done: boolean;
  createdBy?: string;
};

export default function SharedList({
  collectionName,
  placeholder,
  emptyLabel,
}: {
  collectionName: string;
  placeholder: string;
  emptyLabel: string;
}) {
  const { user } = useAuth();
  const [items, setItems] = useState<ListItem[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ListItem, "id">) })));
    });
    return () => unsub();
  }, [collectionName]);

  const addItem = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, collectionName), {
      text: text.trim(),
      done: false,
      createdBy: user?.email ?? null,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const toggleItem = async (item: ListItem) => {
    await updateDoc(doc(db, collectionName, item.id), { done: !item.done });
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="mb-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder={placeholder}
          enterKeyHint="done"
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
        />
        <button
          onClick={addItem}
          className="shrink-0 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Aggiungi
        </button>
      </div>

      {items.length === 0 && (
        <p className="py-8 text-center text-sm text-neutral-400">{emptyLabel}</p>
      )}

      <ul className="flex flex-col gap-1.5">
        {pending.map((item) => (
          <ListRow key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
        ))}
      </ul>

      {done.length > 0 && (
        <>
          <p className="mb-1.5 mt-4 text-xs font-medium uppercase text-neutral-400">
            Completati
          </p>
          <ul className="flex flex-col gap-1.5">
            {done.map((item) => (
              <ListRow key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ListRow({
  item,
  onToggle,
  onRemove,
}: {
  item: ListItem;
  onToggle: (item: ListItem) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-neutral-200 pl-1 pr-2 dark:border-neutral-800">
      <label className="flex flex-1 cursor-pointer items-center gap-3 py-3 pl-2">
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggle(item)}
          className="h-5 w-5 shrink-0 accent-neutral-900 dark:accent-white"
        />
        <span
          className={`flex-1 text-sm ${
            item.done ? "text-neutral-400 line-through" : ""
          }`}
        >
          {item.text}
        </span>
      </label>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 p-3 text-neutral-400 hover:text-red-500"
        aria-label="Elimina"
      >
        ✕
      </button>
    </li>
  );
}
