import Sidebar from '@/components/farmer/Sidebar';
import TopBar from '@/components/farmer/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFBF5]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {children}
        </main>
      </div>
    </div>
  );
}
