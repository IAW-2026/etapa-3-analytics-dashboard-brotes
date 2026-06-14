import { fetchDashboardData } from "@/lib/api";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchDashboardData();

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F2EA]">
      <Topbar
        buyerOnline={data.meta.buyerAppOnline}
        sellerOnline={data.meta.sellerAppOnline}
        paymentsOnline={data.meta.paymentsAppOnline}
        actualizadoEn={data.meta.actualizadoEn}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}