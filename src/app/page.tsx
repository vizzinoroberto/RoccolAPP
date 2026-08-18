import AuthGate from "@/components/AuthGate";
import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <AuthGate>
      <Calendar />
    </AuthGate>
  );
}
