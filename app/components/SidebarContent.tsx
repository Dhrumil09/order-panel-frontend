import { NavLink } from "react-router";

const SidebarContent = () => (
  <div className="flex h-full flex-col justify-between p-4">
    <div className="flex flex-col gap-4">
      <h1 className="text-[#1F1F1F] text-base font-medium leading-normal">
        Acme Co
      </h1>
      <div className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 rounded-full px-3 py-2 ${
              isActive
                ? "bg-[#EAE2FA] text-[#5E2BA8]"
                : "text-[#1F1F1F] hover:bg-[#F7F3FF]"
            }`
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                className={isActive ? "text-inherit" : "text-[#666666]"}
                data-icon="House"
                data-size="24px"
                data-weight="fill"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                </svg>
              </div>
              <p className="text-inherit text-sm font-medium leading-normal">
                Dashboard
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 rounded-full px-3 py-2 ${
              isActive
                ? "bg-[#EAE2FA] text-[#5E2BA8]"
                : "text-[#1F1F1F] hover:bg-[#F7F3FF]"
            }`
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                className={isActive ? "text-inherit" : "text-[#666666]"}
                data-icon="SquaresFour"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path>
                </svg>
              </div>
              <p className="text-inherit text-sm font-medium leading-normal">
                Products
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 rounded-full px-3 py-2 ${
              isActive
                ? "bg-[#EAE2FA] text-[#5E2BA8]"
                : "text-[#1F1F1F] hover:bg-[#F7F3FF]"
            }`
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                className={isActive ? "text-inherit" : "text-[#666666]"}
                data-icon="Receipt"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z"></path>
                </svg>
              </div>
              <p className="text-inherit text-sm font-medium leading-normal">
                Orders
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 rounded-full px-3 py-2 ${
              isActive
                ? "bg-[#EAE2FA] text-[#5E2BA8]"
                : "text-[#1F1F1F] hover:bg-[#F7F3FF]"
            }`
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                className={isActive ? "text-inherit" : "text-[#666666]"}
                data-icon="Users"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                </svg>
              </div>
              <p className="text-inherit text-sm font-medium leading-normal">
                Customers
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 rounded-full px-3 py-2 ${
              isActive
                ? "bg-[#EAE2FA] text-[#5E2BA8]"
                : "text-[#1F1F1F] hover:bg-[#F7F3FF]"
            }`
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                className={isActive ? "text-inherit" : "text-[#666666]"}
                data-icon="ChartLine"
                data-size="24px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path>
                </svg>
              </div>
              <p className="text-inherit text-sm font-medium leading-normal">
                Analytics
              </p>
            </>
          )}
        </NavLink>
      </div>
    </div>
  </div>
);

export default SidebarContent;
