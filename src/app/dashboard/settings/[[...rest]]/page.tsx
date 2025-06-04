import { UserProfile } from "@clerk/nextjs";

export default async function Page() {
    return (
        <div className="flex flex-col items-center justify-center p-6 h-full">
            <UserProfile path="/dashboard/settings" routing="path"/>
        </div>
    );
}   