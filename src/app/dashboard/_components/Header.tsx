import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { Search } from 'lucide-react';

function Header() { 
    return (
        <header className="sticky top-0 left-0 w-full bg-white shadow-sm p-6 z-30">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="w-full max-w-3xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Search"
                            aria-label="Search"
                        />
                    </div>
                </div>

                {/* Join Button */}
                <div className="flex gap-2 items-center">
                    <button className="text-white font-medium px-6 py-3 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors whitespace-nowrap">
                        Join Membership
                    </button>

                    <UserButton 
                        appearance={{
                            elements: {
                                userButtonAvatarBox: 'w-10 h-10', // optional: adjust avatar size
                            },
                        }}
                    />
                </div>

            </div>
        </header>
    );
}

export default Header;