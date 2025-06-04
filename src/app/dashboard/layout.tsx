"use client";
import React, { useState } from 'react';
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { TotalUsageContext } from '../(contenxt)/TotalUsageContext';
import { UserSubscriptionContext } from '../(contenxt)/UserSubscription';

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [totalUsage, setTotalUsage] = useState<number>(0);

  const [userSubscription, setUserSubscription] = useState<boolean>(false)

  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <UserSubscriptionContext.Provider value={{ userSubscription, setUserSubscription }}>
        <div className="flex h-screen bg-slate-100">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-screen w-72 lg:block hidden md:hidden bg-white shadow-sm z-40">
            <SideNav />
          </aside>

          {/* Main Content */}
          <div className="flex-1 lg:ml-72 flex flex-col">
            {/* Header */}
            <Header />

            {/* Page content */}
            <main className="flex-1 overflow-auto flex flex-col">
              <div className="max-w-full flex-[1]">{children}</div>
            </main>
          </div>
        </div>
      </UserSubscriptionContext.Provider>
    </TotalUsageContext.Provider>

  );
}

export default Layout;
