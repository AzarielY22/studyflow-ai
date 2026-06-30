import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-32 sm:px-6 prose prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Acceptance of Terms</h2>
        <p>By using StudyFlow AI, you agree to these terms of service.</p>
        <h2>Service Description</h2>
        <p>StudyFlow AI provides AI-powered study material generation from uploaded educational content.</p>
        <h2>Subscriptions</h2>
        <p>Paid subscriptions are billed monthly through Stripe. You may cancel at any time through the customer portal.</p>
        <h2>Acceptable Use</h2>
        <p>You may not use StudyFlow AI to process content you do not have rights to use.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, contact support@studyflow.ai</p>
      </main>
      <Footer />
    </div>
  );
}
