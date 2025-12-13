import { DashboardBody } from "@/components/Dashboardbody";
import { UploadCard } from "@/components/UploadCard";
export function Dashboard() {
    return (
        <div>
            <UploadCard />
            <DashboardBody />
        </div>
    );
}
