"use client";

import { data } from "@/app/(data)/Templates";
import { SaveToDb } from "@/app/actions/saveToDb";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { GoogleGenAI } from "@google/genai";
import { ArrowLeft, Cross, Crosshair, CrossIcon, FolderClosed, X } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useContext, useMemo, useState } from "react";
import { TEMPLATE } from "../../_components/TemplateListSection";
import FormSection from "./_components/FormSection";
import OutputSection from "./_components/OutputSection";
import { TotalUsageContext } from "@/app/(contenxt)/TotalUsageContext";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import UsageTrack from "./_components/UsageTrack";
import { UserSubscriptionContext } from "@/app/(contenxt)/UserSubscription";

export default function CreateNewContent() {
    const params = useParams();
    const slug = params?.slug as string;

    const [loading, setLoading] = useState(false);
    const [aiOutput, setAiOutput] = useState<string>('');

    const [modal, setModal] = useState(false);

    const { user } = useUser();

    const selectedTemplate: TEMPLATE | undefined = useMemo(() => {
        return data.find((item: TEMPLATE) => item.slug === slug);
    }, [slug]);

    const { totalUsage } = useContext(TotalUsageContext);

    const { userSubscription } = useContext(UserSubscriptionContext);

    if (user === null) {
        redirect("/sign-in")
    }

    const GenerateAiContent = async (formData: Record<string, string>) => {
        if (!userSubscription) {
            if (totalUsage >= 10000) {
                setModal(true);
                console.log(modal)
                return;
            }
        }
        setLoading(true);

        const selectedPrompt = selectedTemplate?.aiPrompt || "";
        const formattedFields = Object.entries(formData)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

        const finalPrompt = `${selectedPrompt}\n\nBased on the above, generate detailed, well-structured Markdown content using appropriate headings, bold text, and lists where necessary.\n\nInput:\n${formattedFields}`;

        // console.log("Final Prompt:", finalPrompt);

        const ai = new GoogleGenAI({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!,
        });

        const config = {
            responseMimeType: 'text/plain',
        };

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: finalPrompt,
                    },
                ],
            },
        ];

        try {
            const response = await ai.models.generateContentStream({
                model: "gemini-1.5-flash",
                config,
                contents,
            });

            let fullResponse = "";
            for await (const chunk of response) {
                fullResponse += chunk.text;
                // console.log("Chunk:", chunk.text);
            }

            // console.log("AI Response:", fullResponse);

            setAiOutput(fullResponse);
            if (selectedTemplate?.slug) {
                await SaveInDb(JSON.stringify(formData), selectedTemplate.slug, fullResponse);
            } else {
                console.error('selectedTemplate.slug is undefined');
            }

            setLoading(false);



            // Optional: Pass fullResponse to state and render in <OutputSection />
        } catch (error) {
            console.error("Error generating content:", error);
            setLoading(false);
        }
    };


    const SaveInDb = async (formData: string, slug: string, aiOutput: string) => {
        const createdBy = user?.primaryEmailAddress?.emailAddress;

        if (!createdBy) {
            console.error("User email is missing, cannot save to DB");
            return;
        }

        await SaveToDb({
            formData,
            templateSlug: slug,
            aiResponse: aiOutput,
            createdBy,
        });
    };


    return (
        <div className="p-6">
            <Link href="/dashboard">
                <Button className="mb-6 p-5 bg-gray-700 hover:bg-gray-900 transition-all text-white duration-150"><ArrowLeft />Back</Button>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Form Section */}
                <FormSection
                    selectedTemplate={selectedTemplate}
                    userFormInput={(data: Record<string, string>) => GenerateAiContent(data)}
                    loading={loading}
                />
                {/* Content Section */}
                <div className="col-span-2">
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
            {modal && (
                <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-blur-sm bg-black/50 flex items-center justify-center">
                    <div className="bg-white w-[500px] space-y-3 p-6 rounded-lg relative flex flex-col justify-between">
                        <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setModal(false)} />
                        <h1 className="text-2xl font-bold capitalize">You have reached your daily limit</h1>
                        <UsageTrack />
                    </div>
                </div>
            )}
        </div>
    );
}
