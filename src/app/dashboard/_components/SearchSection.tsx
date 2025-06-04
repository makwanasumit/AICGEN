import { Search } from 'lucide-react';
import React from 'react';

const SearchSection = ({OnSearchInput}: {OnSearchInput: (value: string) => void}) => {
    return (
        <div className="flex flex-col items-center px-4 py-12 bg-gradient-to-tr from-indigo-800 via-indigo-500 to-indigo-300 text-center">
            <h2 className="text-4xl text-white font-bold mb-2">Browse All Templates</h2>
            <p className="text-white font-medium mb-6">What are you looking for?</p>
            <div className="w-full max-w-2xl">
                <div className="flex items-center bg-white rounded-md px-4 py-3 shadow-md gap-2">
                    <Search className="text-gray-500 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        className="w-full outline-none text-gray-700 placeholder-gray-500 text-xl"
                        placeholder="Search"
                        aria-label="Search templates"
                        onChange={(e) => OnSearchInput(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchSection
