import { PageBreadCrumb } from "@/components/common";

export const metadata = {
  title: "Autonomous Control - VoltGuard Admin",
  description: "Manage drone autonomous operation settings and flight parameters",
};

export default function AutonomousControlPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageName="Autonomous Control" />

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Flight Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Altitude (meters)
              </label>
              <input
                type="number"
                defaultValue={100}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Flight Speed (km/h)
              </label>
              <input
                type="number"
                defaultValue={40}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Autonomous Modes</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
              <span className="text-gray-700 dark:text-gray-300">Enable Auto-Takeoff</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
              <span className="text-gray-700 dark:text-gray-300">Enable Auto-Landing</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="size-4 accent-brand-500" />
              <span className="text-gray-700 dark:text-gray-300">Enable Auto-Return</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Waypoint Management</h3>
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Create and manage flight waypoints here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
