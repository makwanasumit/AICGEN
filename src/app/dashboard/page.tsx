"use client"
import { useState } from "react";
import SearchSection from "./_components/SearchSection";
import TemplateListSection from "./_components/TemplateListSection";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Page() {
    const [userSearchInput, setuserSearchInput] = useState<string | undefined>()
    const { user } = useUser();
    console.log(user)
    if (user === null) {
        redirect("/sign-in")
    }
    return (
        <div>
            {/* Template search section */}
            <SearchSection OnSearchInput={(value: string) => setuserSearchInput(value)} />


            {/* Template section */}

            <TemplateListSection userSearchInput={userSearchInput} />
        </div>
    );


}