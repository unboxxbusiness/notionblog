
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { subscribeToAction, type FormState } from '@/app/actions/subscribe';
import { useActionState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type FormData = z.infer<typeof formSchema>;

const initialState: FormState = {
  message: '',
  status: 'idle',
};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToAction, initialState);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Subscribed!',
        description: state.message,
      });
      form.reset();
    } else if (state.status === 'error' && state.errors) {
        Object.entries(state.errors).forEach(([key, value]) => {
            form.setError(key as keyof FormData, {
                type: 'manual',
                message: value?.[0]
            })
        })
    } else if (state.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : 'Subscribe'}
        </Button>
      </form>
       {state.status === 'error' && !state.errors && (
         <p className="text-sm font-medium text-destructive mt-2 text-center">{state.message}</p>
      )}
    </Form>
  );
}
