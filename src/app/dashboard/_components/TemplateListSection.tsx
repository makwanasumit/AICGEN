 import React, { useEffect, useState } from 'react'
import TemplateCard from './TemplateCard'
import { data } from '@/app/(data)/Templates';

export interface TEMPLATE {
    name: string;
    desc: string;
    category: string;
    icon: string;
    aiPrompt: string;
    slug: string;
    form: FORM[];
}

export interface FORM {
    label: string;
    field: string;
    name: string;
    required?: boolean;
}

const TemplateListSection = ({ userSearchInput }: { userSearchInput?: string }) => {
    const [templateList, setTemplateList] = useState<TEMPLATE[]>(data);

    useEffect(() => {
        if (userSearchInput && userSearchInput.trim() !== "") {
            const filteredList = data.filter((item: TEMPLATE) =>
                item.name.toLowerCase().includes(userSearchInput.toLowerCase())
            );
            setTemplateList(filteredList);
        } else {
            // No input or empty input — show all
            setTemplateList(data);
        }
    }, [userSearchInput]);

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6'>
            {templateList.map((item: TEMPLATE, index: number) => (
                <TemplateCard key={index} item={item} />
            ))}
        </div>
    );
}

export default TemplateListSection;
