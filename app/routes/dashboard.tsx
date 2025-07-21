import { useState } from "react";
import type { Route } from "./+types/home";
import AdminLayout from "~/components/AdminLayout";
import { createPageMeta } from "~/utils/meta";

export function meta({}: Route.MetaArgs) {
  return createPageMeta("Dashboard", "Dashboard for managing products and orders.");
}

export default function Dashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
          <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
            Orders
          </p>
          <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
            2,315
          </p>
          <p className="text-sm sm:text-base font-medium leading-normal text-[#4BB543]">
            +12% from last month
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-[#DDDDDD] bg-white p-4 sm:p-6">
          <p className="text-sm sm:text-base font-medium leading-normal text-[#1F1F1F]">
            Customers
          </p>
          <p className="text-xl sm:text-2xl font-bold leading-tight tracking-light text-[#1F1F1F]">
            1,235
          </p>
          <p className="text-sm sm:text-base font-medium leading-normal text-[#4BB543]">
            +15% from last month
          </p>
        </div>
      </div>

      {/* Latest Orders Section */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#1F1F1F] mb-4">
          Latest Orders
        </h2>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {/* Mobile Order Cards */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">#12345</p>
                <p className="text-sm text-[#666666]">Owen Turner</p>
              </div>
              <button className="flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-3 py-1 text-xs font-medium text-[#1F1F1F]">
                <span className="truncate">Shipped</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#666666]">$120.00</p>
              <p className="text-xs text-[#666666]">2023-08-15</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">#12346</p>
                <p className="text-sm text-[#666666]">Sophia Mitchell</p>
              </div>
              <button className="flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-3 py-1 text-xs font-medium text-[#1F1F1F]">
                <span className="truncate">Processing</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#666666]">$85.50</p>
              <p className="text-xs text-[#666666]">2023-08-14</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">#12347</p>
                <p className="text-sm text-[#666666]">Ethan Hayes</p>
              </div>
              <button className="flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-3 py-1 text-xs font-medium text-[#1F1F1F]">
                <span className="truncate">Delivered</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#666666]">$250.00</p>
              <p className="text-xs text-[#666666]">2023-08-13</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">#12348</p>
                <p className="text-sm text-[#666666]">Ava Bennett</p>
              </div>
              <button className="flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-3 py-1 text-xs font-medium text-[#1F1F1F]">
                <span className="truncate">Shipped</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#666666]">$150.75</p>
              <p className="text-xs text-[#666666]">2023-08-12</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-[#1F1F1F]">#12349</p>
                <p className="text-sm text-[#666666]">Caleb Foster</p>
              </div>
              <button className="flex min-w-[70px] max-w-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-3 py-1 text-xs font-medium text-[#1F1F1F]">
                <span className="truncate">Processing</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#666666]">$90.00</p>
              <p className="text-xs text-[#666666]">2023-08-11</p>
            </div>
          </div>
        </div>

        {/* Desktop Table Container */}
        <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-[#DDDDDD] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Order ID
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[120px]">
                    Customer
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[80px]">
                    Total
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F] min-w-[100px]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-t-[#DDDDDD]">
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                    #12345
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    Owen Turner
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                    <button className="flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F]">
                      <span className="truncate">Shipped</span>
                    </button>
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    $120.00
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    2023-08-15
                  </td>
                </tr>
                <tr className="border-t border-t-[#DDDDDD]">
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                    #12346
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    Sophia Mitchell
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                    <button className="flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F]">
                      <span className="truncate">Processing</span>
                    </button>
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    $85.50
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    2023-08-14
                  </td>
                </tr>
                <tr className="border-t border-t-[#DDDDDD]">
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                    #12347
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    Ethan Hayes
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                    <button className="flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F]">
                      <span className="truncate">Delivered</span>
                    </button>
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    $250.00
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    2023-08-13
                  </td>
                </tr>
                <tr className="border-t border-t-[#DDDDDD]">
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                    #12348
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    Ava Bennett
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                    <button className="flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F]">
                      <span className="truncate">Shipped</span>
                    </button>
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    $150.75
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    2023-08-12
                  </td>
                </tr>
                <tr className="border-t border-t-[#DDDDDD]">
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#1F1F1F]">
                    #12349
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    Caleb Foster
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal">
                    <button className="flex min-w-[70px] sm:min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F7F3FF] px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium leading-normal text-[#1F1F1F]">
                      <span className="truncate">Processing</span>
                    </button>
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    $90.00
                  </td>
                  <td className="h-[60px] sm:h-[72px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-normal leading-normal text-[#666666]">
                    2023-08-11
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
