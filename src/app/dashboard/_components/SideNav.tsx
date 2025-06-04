"use client";

import { FileClock, Home, Settings, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UsageTrack from "../content/[slug]/_components/UsageTrack";

function SideNav() {
    const MenuItems = [
        { name: "Home", icon: Home, path: "/dashboard" },
        { name: "History", icon: FileClock, path: "/dashboard/history" },
        { name: "Billing", icon: Wallet, path: "/dashboard/billing" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    ];

    const path = usePathname();

    return (
        <div className="h-full flex flex-col p-6 bg-white border-r justify-between">
            <div className="flex flex-col w-full ">
                <div className="relative w-16 h-16 mx-auto mb-8">
                    <Image
                        src="/AICGEN.png"
                        alt="Logo"
                        fill
                        sizes="64px"
                        priority
                        className="object-cover rounded-lg"
                    />
                </div>

                <nav className="space-y-2 mt-2">
                    {MenuItems.map((item, index) => {
                        const isActive = path === item.path;
                        return (
                            <Link
                                key={index}
                                href={item.path}
                                className={`flex items-center gap-x-3 px-4 py-3 rounded-lg font-medium transition-all
                                ${isActive ? "bg-indigo-500 text-white" : "text-gray-700 hover:bg-indigo-400 hover:text-white"}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className=" overflow-hidden">
                <UsageTrack/>
            </div>
        </div>
    );
}

export default SideNav;
