
import { NewsletterForm } from "./newsletter-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function HomeSidebar() {
    return (
        <div className="sticky top-28 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Subscribe</CardTitle>
                    <CardDescription>Get the latest posts delivered to your inbox.</CardDescription>
                </CardHeader>
                <CardContent>
                    <NewsletterForm />
                </CardContent>
            </Card>
        </div>
    )
}
