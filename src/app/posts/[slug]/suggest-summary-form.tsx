'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { generateSummaryAction } from './actions';
import { useToast } from '@/hooks/use-toast';

type SuggestSummaryFormProps = {
  content: string;
};

export function SuggestSummaryForm({ content }: SuggestSummaryFormProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    setSummary('');
    const result = await generateSummaryAction(content);
    setLoading(false);

    if (result.success && result.summary) {
      setSummary(result.summary);
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || 'An unknown error occurred.'
        })
    }
  };

  return (
    <Card className="bg-card/50 border-dashed">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI-Powered Summary
        </CardTitle>
        <CardDescription>
          Use AI to generate a concise summary for this article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Suggest Summary'
            )}
          </Button>

          {summary && (
            <div className="space-y-2">
                <label htmlFor="summary" className="text-sm font-medium">Suggested Summary:</label>
                <Textarea id="summary" value={summary} readOnly rows={5} className="bg-background"/>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
