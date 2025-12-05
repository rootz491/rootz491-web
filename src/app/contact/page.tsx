'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getPageContent } from '@/lib/content';
import { Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const page = getPageContent('/contact');
  const { title, subtitle, form, altContacts } = page;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setShowSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(
        'Failed to send message. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4'>
              {title}
            </h1>
            <p className='text-xl text-muted-foreground'>{subtitle}</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto'>
            {showSuccess ? (
              <Card className='border-primary'>
                <CardContent className='pt-6'>
                  <div className='text-center py-8'>
                    <div className='mb-4 text-primary'>
                      <Send className='h-12 w-12 mx-auto' />
                    </div>
                    <h3 className='text-2xl font-bold mb-2'>Message Sent!</h3>
                    <p className='text-muted-foreground'>
                      {form.successMessage}
                    </p>
                    <Button
                      onClick={() => setShowSuccess(false)}
                      variant='outline'
                      className='mt-4'
                    >
                      Send Another Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Honeypot */}
                <input
                  type='text'
                  name='website'
                  className='hidden'
                  tabIndex={-1}
                  autoComplete='off'
                />

                {form.fields.map((field, idx) => (
                  <div key={idx} className='space-y-2'>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className='text-destructive ml-1'>*</span>
                      )}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        rows={6}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}

                {error && (
                  <div className='p-4 bg-destructive/10 text-destructive rounded-md text-sm'>
                    {error}
                  </div>
                )}

                <Button
                  type='submit'
                  size='lg'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : form.submit.label}
                  <Send className='ml-2 h-4 w-4' />
                </Button>
              </form>
            )}

            {/* Alternative Contacts */}
            <div className='mt-12 pt-12 border-t'>
              <h3 className='font-semibold mb-4'>Or reach us directly:</h3>
              <div className='space-y-2'>
                {altContacts.map((contact, idx) => (
                  <div key={idx} className='flex items-center gap-2 text-sm'>
                    <span className='font-medium'>{contact.label}:</span>
                    <span className='text-muted-foreground'>
                      {contact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
