"use client";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu, Bell, ChevronDown, User, User2, LogOut, Settings, Users2, CreditCard, LifeBuoy, RefreshCw } from "lucide-react";
import { LogoWithHoverMenu } from "./LogoWithHoverMenu";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { getUserNotificationsCount } from "@/app/action";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Topbar() {
  const { toggleSidebar } = useSidebar();
  const path = usePathname();
  const params = useParams();
  const session = useSession();

  const [notifications, setNotifications] = useState<number>(0);
  const [pathPrefix, setPathPrefix] = useState<string>("");
  const [isHubSelectorOpen, setIsHubSelectorOpen] = useState(false);

  useEffect(() => {
    const updateNotifications = () => {
      getUserNotificationsCount().then((count) => { setNotifications(count) });
    };

    // Initial fetch
    updateNotifications();

    const interval = setInterval(updateNotifications, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (path.startsWith("/dashboard")) setPathPrefix(`dashboard/${params.patientId}`);
    else if (path.split("/")[1]) setPathPrefix(path.split("/")[1]);
  }, [path, params]);

  async function handleLogOut() {
    await signOut();
    toast.success("Logged out successfully");
  }

  return (
    <div className="bg-[#003B46] shadow-lg fixed w-full left-0 flex items-center justify-between top-0 z-50 px-4 h-16 text-white">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={toggleSidebar}
          className="hover:bg-[#0E7490] hover:text-white text-white p-1"
        >
          <Menu size={24} />
        </Button>

        <div className="flex items-center ">
          {/* Placeholder for Alphalake Logo - Text for now as per image or minimal logo */}
          <div className="flex flex-col justify-center h-8">
            <Image
              src="/AL_WHITE.png"
              alt="Alphalake Ai"
              width={120}
              height={32}
              className="object-contain"
              style={{ height: 'auto', width: 'auto', maxHeight: '32px' }}
            />
          </div>

          <div className="h-8 w-[1px] bg-gray-500 mx-3"></div>

          <div className="flex flex-col">
            <span className="font-semibold text-md leading-tight">Pharmacy Cloud</span>
            <span className="text-sm text-gray-300">Inpatient Hub</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center">
        {/* Notification Bell */}
        <Link href={`/${pathPrefix}/notifications`}>
          <div className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/10 mr-4">
            <Bell size={20} className="text-white" />
            {notifications > 0 && (
              <div className="absolute top-1.5 right-2 w-4 h-4 bg-[#E11D48] rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none border-2 border-[#003B46] translate-x-1/2 -translate-y-1/2">
                {notifications}
              </div>
            )}
          </div>
        </Link>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1 pr-3 border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
              <div className="relative">
                {session?.data?.user.image ? (
                  <Image
                    src={getImageUrl(session.data.user.image) || "/user.png"}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-9 h-9 border-2 border-white/20"
                  />
                ) : (
                  <div className="rounded-full bg-white/10 w-9 h-9 flex items-center justify-center border-2 border-white/20">
                    <User size={20} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#003B46]"></div>
              </div>
              <ChevronDown size={16} className="text-white/80" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] bg-white text-[#111827] shadow-lg rounded-xl border border-gray-100 p-2">
            <div className="px-3 py-3">
              <p className="font-bold text-[15px] text-[#111827] leading-none mb-1">{session?.data?.user.name || "User"}</p>
              <p className="text-[13px] text-gray-500 mb-2 truncate">{session?.data?.user.email || "user@example.com"}</p>
              <RenderRole role={session?.data?.user.role} />
            </div>

            <DropdownMenuSeparator className="bg-gray-200 my-1" />

            <DropdownMenuItem asChild className="focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <Link href={`/${pathPrefix}/profile`} className="flex items-center w-full">
                <Settings className="mr-3 h-[18px] w-[18px] text-gray-500" />
                <span className="font-medium text-[14px]">Profile Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <Link href={`/${pathPrefix}/hub-settings`} className="flex items-center w-full">
                <RefreshCw className="mr-3 h-[18px] w-[18px] text-gray-500" />
                <span className="font-medium text-[14px]">Hub settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <Link href={`/${pathPrefix}/hub-users`} className="flex items-center w-full">
                <Users2 className="mr-3 h-[18px] w-[18px] text-gray-500" />
                <span className="font-medium text-[14px]">Hub users</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-200 my-1" />

            <DropdownMenuItem asChild className="focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <Link href={`/${pathPrefix}/billing`} className="flex items-center w-full">
                <Bell className="mr-3 h-[18px] w-[18px] text-gray-500" />
                <span className="font-medium text-[14px]">Billing and subscriptions</span>
              </Link>
            </DropdownMenuItem>



            <DropdownMenuItem asChild className="focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <Link href={`/${pathPrefix}/support`} className="flex items-center w-full">
                <LifeBuoy className="mr-3 h-[18px] w-[18px] text-gray-500" />
                <span className="font-medium text-[14px]">Support</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-200 my-1" />

            <DropdownMenuItem onClick={handleLogOut} className="focus:bg-[#FEF2F2] focus:text-[#EF4444] text-[#EF4444] cursor-pointer py-2.5 px-3 rounded-md my-0.5">
              <LogOut className="mr-3 h-[18px] w-[18px]" />
              <span className="font-medium text-[14px]">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-[1px] bg-white/20 mx-3"></div>

        {/* Right Logo */}
        {/* Right Logo */}
        <div
          className="relative flex items-center cursor-pointer group"
          onMouseEnter={() => setIsHubSelectorOpen(false)} // Reset if needed, or just used for hover state
        >
          {/* Logo Container with Hover Logic implemented via CSS group-hover or State if needed. 
                 Using generic Tooltip is hard for interactive content. 
                 I'll use a simple clean state approach.
             */}
          <LogoWithHoverMenu onOpenHub={() => setIsHubSelectorOpen(true)} />
        </div>

        <Dialog open={isHubSelectorOpen} onOpenChange={setIsHubSelectorOpen}>
          <DialogContent className="max-w-4xl p-0 bg-white overflow-hidden border-none shadow-2xl">
            <div className="flex h-[500px]">
              {/* Left Side - Visual/Branding */}
              <div className="w-1/3 bg-[#003B46] p-8 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                  <Image
                    src="/cara-logo-white.png"
                    alt="Cara Allcare Pharmacy"
                    width={160}
                    height={48}
                    className="object-contain mb-6"
                  />
                  <h2 className="text-2xl font-bold mb-2">Select Hub</h2>
                  <p className="text-[#A5F3FC]">Access your operational workspaces.</p>
                </div>

                <div className="relative z-10">
                  <p className="text-xs text-[#A5F3FC]/60">© 2024 Cara Allcare Pharmacy</p>
                </div>

                {/* Abstract Circle Decoration */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#0E7490] opacity-50 blur-3xl"></div>
                <div className="absolute top-12 -left-12 w-48 h-48 rounded-full bg-[#0E7490] opacity-30 blur-2xl"></div>
              </div>

              {/* Right Side - Hub Options */}
              <div className="w-2/3 p-10 bg-gray-50 flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Inpatient Hub */}
                  <div className="cursor-pointer group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#003B46]/50 hover:-translate-y-1">
                    <div className="mb-4 rounded-full bg-[#E0F2F1] p-3 w-fit text-[#003B46]">
                      <RefreshCw size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#003B46]">Inpatient Hub</h3>
                    <p className="text-sm text-gray-500 mt-2">Manage patient prescriptions and dispensing workflows.</p>
                  </div>

                  {/* Deliveries Hub */}
                  <div className="cursor-pointer group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#003B46]/50 hover:-translate-y-1">
                    <div className="mb-4 rounded-full bg-[#E0F2F1] p-3 w-fit text-[#003B46]">
                      <CreditCard size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#003B46]">Deliveries Hub</h3>
                    <p className="text-sm text-gray-500 mt-2">Track deliveries and logistics.</p>
                  </div>

                  {/* Org Admin Console - Only for Admins */}
                  {session?.data?.user.role === 'ADMIN' && (
                    <div className="col-span-1 md:col-span-2 mt-2 cursor-pointer group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#003B46]/50">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-[#F3F4F6] p-3 text-gray-700">
                          <Settings size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#003B46]">Organisation Admin Console</h3>
                          <p className="text-sm text-gray-500">Manage users, settings, and organisation-wide configurations.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function RenderRole({ role }: { role: string | undefined }) {
  const roleName = {
    "ADMIN": "Admin",
    "PHARMACIST": "Pharmacist",
    "CUSTOMER": "Next of Kin",
    "MANAGER": "Home Manager"
  }[role || ""] || "User";

  return <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{roleName}</p>;
}