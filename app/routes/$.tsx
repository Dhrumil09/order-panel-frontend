export function meta() {
  return [
    { title: "404 - Page Not Found" },
    {
      name: "description",
      content: "The page you're looking for doesn't exist.",
    },
  ];
}

export default function NotFound() {
  // For browser-generated requests (like DevTools), return minimal response
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F9F9F9]"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1F1F1F] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#666666] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#666666] mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-[#B494E5] px-6 py-3 text-white font-medium hover:bg-[#9869E0] transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
