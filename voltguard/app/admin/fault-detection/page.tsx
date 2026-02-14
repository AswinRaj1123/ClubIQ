import { PageBreadCrumb } from "@/components/common";

export const metadata = {
  title: "Fault Detection - VoltGuard Admin",
  description: "Monitor and analyze detected faults and issues",
};

export default function FaultDetectionPage() {
  const faultReports = [
    {
      id: "FLT-V-23001",
      tower: "Tower 12",
      type: "Damaged Insulator",
      severity: "critical",
      location: "Chennai North",
      status: "Open",
      detectedAt: "2024-02-13 14:32:15",
      updates: [
        { time: "2024-02-13 14:32:15", action: "Fault Detected", detail: "Critical damage on insulator C-phase", user: "Drone AI" },
        { time: "2024-02-13 15:10:00", action: "Field Inspector Assigned", detail: "Technician TN-047 assigned", user: "System" },
        { time: "2024-02-13 16:45:30", action: "On-Site Inspection", detail: "Physical inspection confirmed AI findings", user: "TN-047" },
        { time: "2024-02-13 17:20:00", action: "Repair Scheduled", detail: "Insulator replacement scheduled for 2024-02-14 09:00", user: "Supervisor" },
      ],
    },
    {
      id: "FLT-V-23002",
      tower: "Tower 18",
      type: "Vegetation Encroachment",
      severity: "warning",
      location: "Coimbatore West",
      status: "In Progress",
      detectedAt: "2024-02-12 10:15:00",
      updates: [
        { time: "2024-02-12 10:15:00", action: "Fault Detected", detail: "Tree branches 1.5m from power line", user: "Drone AI" },
        { time: "2024-02-12 11:30:00", action: "Risk Assessment", detail: "Medium risk - monitoring required", user: "Analyst" },
        { time: "2024-02-13 09:00:00", action: "Clearance Work Started", detail: "Vegetation trimming initiated", user: "Contractor" },
      ],
    },
    {
      id: "FLT-V-23003",
      tower: "Tower 7",
      type: "Corroded Conductor",
      severity: "resolved",
      location: "Madurai East",
      status: "Closed",
      detectedAt: "2024-02-10 08:20:00",
      updates: [
        { time: "2024-02-10 08:20:00", action: "Fault Detected", detail: "Corrosion detected on conductor", user: "Drone AI" },
        { time: "2024-02-11 14:00:00", action: "Repair Work", detail: "Conductor section replaced", user: "Technician" },
        { time: "2024-02-12 16:30:00", action: "Quality Check", detail: "Electrical tests passed", user: "Inspector" },
        { time: "2024-02-13 10:00:00", action: "Closed", detail: "Repair verified and complete", user: "Supervisor" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageBreadCrumb pageName="Fault Detection" />

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Faults</h3>
            <span className="text-xs font-medium text-white bg-error-500 px-3 py-1 rounded-full">2</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">2</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requires immediate action</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Warning Faults</h3>
            <span className="text-xs font-medium text-white bg-warning-500 px-3 py-1 rounded-full">5</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">5</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor closely</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Faults</h3>
            <span className="text-xs font-medium text-white bg-success-500 px-3 py-1 rounded-full">12</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">12</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completed repairs</p>
        </div>
      </div>

      {/* Recent Tower 12 Alert */}
      <div className="rounded-2xl bg-error-50 dark:bg-error-500/10 border-l-4 border-error-500 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-error-800 dark:text-error-400 mb-2">⚠️ Tower 12 - Critical Fault</h3>
            <p className="text-error-700 dark:text-error-300 text-sm mb-3">Damaged insulator detected at Chennai North station - immediate action required</p>
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-error-600 dark:text-error-400 font-medium">Fault ID</p>
                <p className="text-error-800 dark:text-error-200 font-mono">FLT-V-23001</p>
              </div>
              <div>
                <p className="text-error-600 dark:text-error-400 font-medium">Detected</p>
                <p className="text-error-800 dark:text-error-200">2024-02-13 14:32</p>
              </div>
              <div>
                <p className="text-error-600 dark:text-error-400 font-medium">Status</p>
                <p className="text-error-800 dark:text-error-200 font-medium">Open</p>
              </div>
              <div>
                <p className="text-error-600 dark:text-error-400 font-medium">Assigned To</p>
                <p className="text-error-800 dark:text-error-200">TN-047</p>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-error-500 text-white font-medium rounded-lg hover:bg-error-600 transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>

      {/* Fault Reports with Update History */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Fault Report Details</h3>
        
        {faultReports.map((report) => (
          <div key={report.id} className="rounded-2xl bg-white p-6 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Report Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{report.type}</h4>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      report.severity === "critical"
                        ? "bg-error-100 dark:bg-error-500/10 text-error-700 dark:text-error-400"
                        : report.severity === "warning"
                        ? "bg-warning-100 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400"
                        : "bg-success-100 dark:bg-success-500/10 text-success-700 dark:text-success-400"
                    }`}
                  >
                    {report.severity.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      report.status === "Open"
                        ? "bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                        : report.status === "In Progress"
                        ? "bg-warning-100 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400"
                        : "bg-success-100 dark:bg-success-500/10 text-success-700 dark:text-success-400"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Tower:</strong> {report.tower} | <strong>Location:</strong> {report.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{report.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  First detected: {report.detectedAt}
                </p>
              </div>
            </div>

            {/* Update Timeline */}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change History</h5>
              <div className="space-y-3">
                {report.updates.map((update, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-brand-500 mt-1.5"></div>
                      {idx < report.updates.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 dark:text-white text-sm">{update.action}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{update.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{update.detail}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">by {update.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
