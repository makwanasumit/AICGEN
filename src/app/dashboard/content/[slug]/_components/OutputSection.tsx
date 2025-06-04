import React, { useEffect, useRef, useState } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { Editor } from '@toast-ui/react-editor';

// Toast components
const Toast = ({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-right">
      <Check size={16} />
      {message}
    </div>
  );
};

type Props = {
  aiOutput?: string
}

const OutputSection: React.FC<Props> = ({ aiOutput }) => {
  const editorRef = useRef<InstanceType<typeof Editor>>(null);
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      editorInstance.setMarkdown(aiOutput || '');
    }
  }, [aiOutput]);

  const handleCopy = async () => {
    try {
      const editorInstance = editorRef.current?.getInstance();
      if (editorInstance) {
        const markdown = editorInstance.getMarkdown();
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setShowToast(true);
        
        // Reset the copied state after a brief moment
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md border rounded-lg">
        <div className='flex justify-between p-5 items-center'>
          <h2>Your result</h2>
          <Button 
            className='bg-indigo-500 hover:bg-indigo-600 transition-colors'
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <Editor
          initialValue="hello react editor world!"
          initialEditType="wysiwyg"
          height="600px"
          useCommandShortcut={true}
          onChange={() => console.log(editorRef.current?.getInstance().getMarkdown())}
          ref={editorRef}
        />
      </div>

      <Toast 
        message="Content copied to clipboard!" 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  )
}

export default OutputSection