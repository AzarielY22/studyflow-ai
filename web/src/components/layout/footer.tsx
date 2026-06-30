import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              StudyFlow AI
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Turn any content into study materials in seconds.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/features" className="hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
              <li><a href="mailto:support@studyflow.ai" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} StudyFlow AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
