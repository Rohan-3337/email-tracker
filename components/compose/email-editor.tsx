'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Send,
  Save,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SmartEmailDialog } from '../SmartEmailDialog';
import { Template } from '@/lib/generated/prisma';
import toast from 'react-hot-toast';
import { SmartFormSubmit } from '@/lib/actions/SmartFormSubmit';

export function EmailEditor() {
  const [recipient, setRecipient] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [smartForm, setSmartForm] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSubmit,setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/template');
      const data = await res.json();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const handleAI = async () => {
    setLoading(true);
    const res = await fetch('/api/ai-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.subject && data.content) {
      setSubject(data.subject.replace(/\[(.*?)\]/g, '{{$1}}'));
      setContent(data.content.replace(/\[(.*?)\]/g, '{{$1}}'));
      setCategory(data.category);
      setName(data.name);
    } else {
      toast.error("LLM Error",{position:"top-center"})
    }
  };

 
  //   try {
  //     const response = await fetch('/api/send', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         html: EmailData.content,
  //         subject: EmailData.subject,
  //         to: EmailData.recipientName,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       toast.error(`Failed to send email: ${errorData.error || 'Unknown error'}`,{position:"top-center"});
  //       return;
  //     }

  //     toast.success(' Email sent successfully!',{position:"top-center"});
  //   } catch (error) {
  //     toast.error('Failed to send email due to network or server error.',{
  //       position:"top-center"
  //     });
  //   }
  // };

  const handleTemplate = async () => {
    try {
      setIsSubmit(true);
      const res = await fetch('/api/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, name, category }),
      });
      const data = await res.json();
      if(!res.ok) return toast.error(data?.error,{position:"top-center"});
      setIsSubmit(false);
      toast.success('Template saved successfully',{position:"top-center"});
      setCategory('');
      setContent('');
      setName('');
      setSubject('');
    } catch (error) {
      toast.error('Template save failed: ' + error,{position:"top-center"});
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const selected = templates.find((t) => t.id === templateId);
    if (selected) {
      setCategory(selected.category);
      setContent(selected.content);
      setName(selected.name);
      setSubject(selected.subject);
    }else{
      setCategory('');
      setContent('');
      setName('');
      setSubject('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Compose Email</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleAI} disabled={loading}>
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? 'Thinking...' : 'AI Assist'}
              </Button>
              {/* <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button> */}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Add recipient..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select onValueChange={handleSelectTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank Email</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Toolbar */}
          <div className="flex items-center space-x-2 border-b pb-3">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm"><Bold className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Italic className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Underline className="w-4 h-4" /></Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm"><Link className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Image className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Paperclip className="w-4 h-4" /></Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm"><Smile className="w-4 h-4" /></Button>
          </div>

          {/* Email Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your email content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4">
            {/* <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm"><Paperclip className="w-4 h-4 mr-2" />Attach Files</Button>
              <Button variant="outline" size="sm">Schedule Send</Button>
            </div> */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleTemplate} disabled={isSubmit}>
                {isSubmit &&<Loader2 className=' w-4 h-4 mr-2 animate-spin'/>}
                Save as Template
                </Button>
              <Button onClick={() => setSmartForm(true)}>
                <Send className="w-4 h-4 mr-2" /> Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Dialog */}
      <SmartEmailDialog
        initialData={{
          subject,
          content,
          recipientName: recipient,
        }}
        onSubmit={SmartFormSubmit}
        onOpen={smartForm}
        setOpen={setSmartForm}
      />
    </div>
  );
}

