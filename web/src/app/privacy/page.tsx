import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-32 sm:px-6 prose prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide when signing in with Google, including your name and email. We also store uploaded study materials and generated content to provide our services.</p>
        <h2>How We Use Your Data</h2>
        <p>Your uploaded content is processed by AI to generate study materials. We do not sell your data to third parties.</p>
        <h2>Data Storage</h2>
        <p>All data is stored securely using encrypted cloud storage. You can delete your materials at any time from your dashboard.</p>
        <h2>Contact</h2>
        <p>For privacy inquiries, contact support@studyflow.ai</p>
      </main>
      <Footer />
    </div>
  );
}
