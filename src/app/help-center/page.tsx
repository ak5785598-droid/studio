import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, Mail } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';

const faqs = [
  {
    question: 'How do I create an account?',
    answer:
      'You can create an account using your phone number or Google account directly from the login screen.',
  },
  {
    question: 'How do I buy coins?',
    answer:
      "You can buy coins by navigating to Boutique > Gold Coins. There you'll find various coin packages available for purchase.",
  },
  {
    question: 'What are coins used for?',
    answer:
      'Coins are used to send virtual gifts to other users in chat rooms and to equip premium assets in the Boutique.',
  },
  {
    question: 'How can I edit my profile?',
    answer:
      'You can edit your profile information, including your name, bio, and avatar, by going to Me > Modify Persona.',
  },
  {
    question: 'How do I launch a frequency?',
    answer:
      'On the main Home screen, select "Create Room" to define your frequency and gather your tribe.',
  },
];

export default function HelpCenterPage() {
  return (
    <AppLayout>
      <div className="space-y-8 p-4 max-w-4xl mx-auto pb-24">
        <header className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary uppercase italic">
            Official Help Center
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Find answers to your questions and get the support you need.
          </p>
        </header>
        
        <Card className="border-none bg-gradient-to-r from-primary/10 to-accent/10 overflow-hidden relative group rounded-[2.5rem]">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Need Live Support?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground font-body text-lg">
              Contact our official support team via email or look for users with the "Official" badge in any frequency.
            </p>
            <div className="flex items-center justify-between rounded-2xl border-2 border-primary/20 bg-background/50 p-6 hover:bg-primary/10 transition-all shadow-xl group/btn">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                        <Mail className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Ummy Support</h3>
                        <p className="text-sm text-muted-foreground font-body">
                            Email Response within 24 Hours
                        </p>
                    </div>
                </div>
                <button className="bg-primary text-white font-black uppercase tracking-widest text-xs px-8 py-3 rounded-full shadow-lg transition-transform group-hover/btn:scale-105">
                    Email Us
                </button>
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
             <LifeBuoy className="h-64 w-64" />
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle className="font-headline uppercase italic">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-gray-100">
                  <AccordionTrigger className="text-left font-bold py-6">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body text-base pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
