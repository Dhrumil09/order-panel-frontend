import { useState } from "react";
import AdminLayout from "~/components/AdminLayout";
import ComingSoon from "~/components/ComingSoon";
import { createPageMeta } from "~/utils/meta";

export function meta() {
  return createPageMeta("Analytics", "View analytics.");
}

export default function Analytics() {
  const analyticsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="text-[#9869E0]"
    >
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
    </svg>
  );

  return (
    <AdminLayout title="Analytics">
      <ComingSoon
        title="Analytics Dashboard"
        description="This section is currently under development. Soon you'll be able to view comprehensive analytics, charts, and insights about your business performance."
        icon={analyticsIcon}
      />
    </AdminLayout>
  );
}
