import { PageBreadCrumb } from "@/components/common";

export const metadata = {
  title: "Analytics - VoltGuard Lineman",
  description: "View detailed analytics and performance metrics",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageName="Analytics" />

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Flights</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">245</p>
          <p className="text-xs text-success-600 dark:text-success-400 mt-2">+12% from last month</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Flight Hours</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">1,240</p>
          <p className="text-xs text-success-600 dark:text-success-400 mt-2">+5% from last month</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Flight Duration</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">5.1h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Per flight mission</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">98.5%</p>
          <p className="text-xs text-success-600 dark:text-success-400 mt-2">Flight completion</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Flights</h3>
          <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">Chart visualization coming soon</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Flight Duration Trends</h3>
          <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Voltage Stability Analytics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Voltage Stability Analysis</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Voltage Range (All Lines)</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Min Voltage</span>
                  <span className="font-semibold text-gray-800 dark:text-white">235V</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-warning-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Avg Voltage</span>
                  <span className="font-semibold text-gray-800 dark:text-white">240V</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-success-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Max Voltage</span>
                  <span className="font-semibold text-gray-800 dark:text-white">245V</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-success-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Voltage Deviation Index</h4>
            <div className="flex flex-col items-center justify-center h-48">
              <div className="relative w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(rgb(46, 213, 115) 0deg, rgb(46, 213, 115) 252deg, rgb(255, 165, 2) 252deg, rgb(255, 165, 2) 360deg)`,
                  borderRadius: '50%',
                }}></div>
                <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">94%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stability</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Excellent voltage stability</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Voltage Events (This Month)</h4>
            <div className="space-y-2">
              <div className="p-3 bg-success-50 dark:bg-success-500/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-success-700 dark:text-success-400">Normal Range</span>
                  <span className="font-bold text-success-700 dark:text-success-400">245</span>
                </div>
              </div>
              <div className="p-3 bg-warning-50 dark:bg-warning-500/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warning-700 dark:text-warning-400">Minor Deviation</span>
                  <span className="font-bold text-warning-700 dark:text-warning-400">12</span>
                </div>
              </div>
              <div className="p-3 bg-error-50 dark:bg-error-500/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-error-700 dark:text-error-400">Critical Spike</span>
                  <span className="font-bold text-error-700 dark:text-error-400">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Monitoring */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Temperature Monitoring</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Conductor Temperature</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Min Temp</span>
                  <span className="font-semibold text-gray-800 dark:text-white">28°C</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-success-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Avg Temp</span>
                  <span className="font-semibold text-gray-800 dark:text-white">38°C</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-warning-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Max Temp</span>
                  <span className="font-semibold text-gray-800 dark:text-white">52°C</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-error-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Temperature by Location</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Chennai Region</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-warning-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">42°C</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Coimbatore Region</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-warning-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">38°C</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Madurai Region</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-error-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">48°C</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Trichy Region</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-success-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">32°C</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Temperature Alerts (24h)</h4>
            <div className="space-y-2">
              <div className="p-3 bg-success-50 dark:bg-success-500/10 rounded-lg border-l-4 border-success-500">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-success-700 dark:text-success-400 font-medium">Normal</span>
                  <span className="text-sm font-bold text-success-700 dark:text-success-400">156 events</span>
                </div>
              </div>
              <div className="p-3 bg-warning-50 dark:bg-warning-500/10 rounded-lg border-l-4 border-warning-500">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warning-700 dark:text-warning-400 font-medium">Elevated Temp</span>
                  <span className="text-sm font-bold text-warning-700 dark:text-warning-400">23 events</span>
                </div>
              </div>
              <div className="p-3 bg-error-50 dark:bg-error-500/10 rounded-lg border-l-4 border-error-500">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-error-700 dark:text-error-400 font-medium">High Temp Alert</span>
                  <span className="text-sm font-bold text-error-700 dark:text-error-400">3 events</span>
                </div>
              </div>
              <div className="p-3 bg-error-50 dark:bg-error-500/10 rounded-lg border-l-4 border-error-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-error-700 dark:text-error-400 font-medium">Critical Overheat</span>
                  <span className="text-sm font-bold text-error-700 dark:text-error-400">1 event</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
