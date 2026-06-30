import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-32 sm:px-6">
        <h1 className="text-4xl font-bold">Help & Support</h1>
        <p className="mt-4 text-zinc-400">We&apos;re here to help you study smarter.</p>
        <div className="mt-12 space-y-4">
          {[
            { q: "How do I install the Chrome extension?", a: "Visit the Chrome Web Store and click 'Add to Chrome'. Sign in with your Google account to sync with your dashboard." },
            { q: "What file types are supported?", a: "PDFs, YouTube videos, Google Docs, PowerPoints, research papers, educational websites, and highlighted text from any webpage." },
            { q: "How do I upgrade my plan?", a: "Go to Billing in your dashboard or visit our Pricing page to upgrade to Pro or Premium." },
            { q: "Can I cancel anytime?", a: "Yes. Manage your subscription through the Stripe Customer Portal from your Billing page." },
          ].map(({ q, a }) => (
            <Card key={q}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-2 text-sm text-zinc-400">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-zinc-400">
          Still need help? Email{" "}
          <a href="mailto:support@studyflow.ai" className="text-indigo-400 hover:underline">
            support@studyflow.ai
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
