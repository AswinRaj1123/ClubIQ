import { PageBreadCrumb } from "@/components/common";

export const metadata = {
  title: "Cost Analysis - VoltGuard Admin",
  description: "Analyze operational costs and budgeting",
};

export default function CostAnalysisPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageName="Cost Analysis" />

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Monthly Budget</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">₹50,000</p>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-success-500"></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">60% utilized (₹30,000)</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">₹30,000</p>
          <p className="text-xs text-success-600 dark:text-success-400 mt-2">Within budget</p>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cost per Flight Hour</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">₹24.19</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Average cost</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cost Breakdown by Category</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">45%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Flight Time</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">₹13,500</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400">30%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Battery</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">₹9,000</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">15%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Data Processing</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">₹4,500</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-error-600 dark:text-error-400">10%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Maintenance</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">₹3,000</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cost Trends</h3>
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">Cost trends visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}
