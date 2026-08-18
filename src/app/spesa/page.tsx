import AuthGate from "@/components/AuthGate";
import SharedList from "@/components/SharedList";

export default function SpesaPage() {
  return (
    <AuthGate>
      <SharedList
        collectionName="shoppingItems"
        placeholder="Aggiungi alla lista della spesa..."
        emptyLabel="La lista della spesa è vuota"
      />
    </AuthGate>
  );
}
