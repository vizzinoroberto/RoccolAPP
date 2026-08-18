import AuthGate from "@/components/AuthGate";
import SharedList from "@/components/SharedList";

export default function TodoPage() {
  return (
    <AuthGate>
      <SharedList
        collectionName="todos"
        placeholder="Aggiungi un task..."
        emptyLabel="Nessun task da fare"
      />
    </AuthGate>
  );
}
