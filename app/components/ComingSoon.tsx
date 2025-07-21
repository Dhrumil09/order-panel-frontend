interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ComingSoon = ({ title, description, icon }: ComingSoonProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-[#EAE2FA] flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-[#666666] mb-6">
          {description}
        </p>
        <div className="inline-flex items-center rounded-full bg-[#F7F3FF] px-4 py-2 text-sm font-medium text-[#9869E0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 