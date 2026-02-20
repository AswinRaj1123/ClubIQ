import { PageBreadCrumb } from "@/components/common";

export const metadata = {
  title: "Settings - VoltGuard Lineman",
  description: "Lineman panel settings and configuration",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageName="Settings" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">General Settings</h3>
              
              <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="VoltGuard Lineman"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option>UTC</option>
                    <option>IST (UTC+5:30)</option>
                    <option>EST (UTC-5:00)</option>
                    <option>PST (UTC-8:00)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300">Email notifications for critical faults</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300">SMS alerts for emergency situations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4 accent-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300">Weekly summary reports</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security Settings</h3>
              <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300">Two-factor authentication</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 accent-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300">Session login activity alerts</span>
                </label>
              </div>
            </div>

            <button className="px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Version</p>
                <p className="text-gray-800 dark:text-white font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-800 dark:text-white font-medium">2024-12-20</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-success-600 dark:text-success-400 font-medium">Operational</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Danger Zone</h3>
            <button className="w-full px-4 py-2 bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 font-medium rounded-lg hover:bg-error-100 dark:hover:bg-error-500/20 transition-colors text-sm">
              Clear Cache
            </button>
            <button className="w-full mt-2 px-4 py-2 bg-error-500 text-white font-medium rounded-lg hover:bg-error-600 transition-colors text-sm">
              Reset Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
