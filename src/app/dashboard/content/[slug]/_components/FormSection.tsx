import { TEMPLATE } from '@/app/dashboard/_components/TemplateListSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';

type Props = {
  selectedTemplate?: TEMPLATE;
  userFormInput: (data: Record<string, string>) => void
  loading?: boolean
};

const FormSection: React.FC<Props> = ({ selectedTemplate, userFormInput, loading }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    userFormInput(formData)
    // console.log('Generated Data:', formData);
    // Add your AI generation logic or API call here
  };

  if (!selectedTemplate) return null;

  return (
    <div className='p-5 shadow-md rounded-lg border bg-white space-y-2 h-fit'>
      <Image src={selectedTemplate.icon} alt={selectedTemplate.name} width={100} height={100} />
      <h2 className='font-bold text-2xl text-indigo-500'>{selectedTemplate.name}</h2>
      <p className='text-gray-500 text-sm'>{selectedTemplate.desc}</p>

      <form onSubmit={handleSubmit} className='mt-6'>
        {selectedTemplate.form.map((item, index) => (
          <div key={index} className='flex flex-col gap-2 mb-6'>
            <label htmlFor={item.name} className='font-bold'>
              {item.label}
            </label>
            {item.field === 'input' ? (
              <Input
                id={item.name}
                name={item.name}
                value={formData[item.name] || ''}
                required={item.required}
                onChange={handleChange}
              />
            ) : item.field === 'textarea' ? (
              <Textarea
                id={item.name}
                name={item.name}
                value={formData[item.name] || ''}
                required={item.required}
                onChange={handleChange}

              />
            ) : null}
          </div>
        ))}

        <Button type='submit' className='ml-auto bg-indigo-500 w-full py-6' disabled={loading}>
          {loading && <Loader2Icon className='animate-spin' />} {loading ? 'Generating...' : 'Generate Content'}
        </Button>
      </form>
    </div>
  );
};

export default FormSection;
