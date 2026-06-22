import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col pl-64 min-h-screen">
        {/* Header telemetry and clock */}
        <Header />

        {/* Dynamic page contents */}
        <main className="flex-1 p-8 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
