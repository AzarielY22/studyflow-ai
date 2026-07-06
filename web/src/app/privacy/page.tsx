import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="prose prose-invert mx-auto max-w-3xl px-4 py-32 sm:px-6">
        <h1>Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: July 6, 2026</p>
        <p>
          StudyFlow AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website{" "}
          <a href="https://www.getstudyflow.online">https://www.getstudyflow.online</a> and the
          StudyFlow AI Chrome extension. This policy explains what information we collect, how we
          use it, and your choices.
        </p>

        <h2>Information We Collect</h2>

        <h3>Account information (website &amp; extension)</h3>
        <p>
          When you sign in with Google, we receive personally identifiable information such as your
          name, email address, and profile photo. We use this to create and manage your account.
        </p>

        <h3>Authentication information (extension)</h3>
        <p>
          The Chrome extension stores a secure session token locally on your device (using Chrome
          storage) so you remain signed in. We do not store your Google password.
        </p>

        <h3>Website content you choose to analyze</h3>
        <p>
          When you use StudyFlow AI to analyze a webpage, PDF, YouTube video, or highlighted text,
          we collect the content you explicitly submit, including page title, URL, and visible text
          from that page or selection. This is sent to our servers to generate summaries, flashcards,
          and quizzes.
        </p>
        <p>
          <strong>We do not collect your browsing history.</strong> We only access the specific
          page or selection you choose to analyze. We do not monitor tabs in the background, log
          keystrokes, track mouse movement, or collect location data.
        </p>

        <h3>Study materials &amp; usage data</h3>
        <p>
          We store the materials you create (summaries, flashcards, quizzes, folders, favorites),
          chat messages you send about your materials, and basic usage data such as scan counts and
          subscription plan status.
        </p>

        <h3>Payment information</h3>
        <p>
          Paid subscriptions are processed by Stripe. We do not store your full credit card number.
          Stripe provides us with billing status, customer ID, and subscription details needed to
          manage your plan.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Provide, operate, and improve StudyFlow AI</li>
          <li>Generate AI study materials from content you submit</li>
          <li>Authenticate you on the website and Chrome extension</li>
          <li>Manage subscriptions and billing</li>
          <li>Send service-related communications (if you opt in)</li>
          <li>Respond to support requests</li>
        </ul>
        <p>
          We use your data only for these purposes. We do not sell your personal information. We do
          not use your data for creditworthiness, lending, or unrelated advertising.
        </p>

        <h2>Chrome Extension Data Disclosure</h2>
        <p>For the StudyFlow AI Chrome extension, we collect:</p>
        <ul>
          <li>
            <strong>Personally identifiable information:</strong> name and email (via Google
            sign-in)
          </li>
          <li>
            <strong>Authentication information:</strong> session token stored locally on your device
          </li>
          <li>
            <strong>Website content:</strong> text, title, and URL from pages you explicitly choose
            to analyze
          </li>
        </ul>
        <p>We do not collect: health information, financial card details in the extension, personal
          communications, location, web browsing history, or background user activity tracking.</p>

        <h2>Third-Party Services</h2>
        <p>We use trusted providers to operate our service:</p>
        <ul>
          <li>
            <strong>Google</strong> — OAuth sign-in
          </li>
          <li>
            <strong>OpenAI</strong> — AI processing of content you submit
          </li>
          <li>
            <strong>Stripe</strong> — payment processing
          </li>
          <li>
            <strong>Neon</strong> — database hosting
          </li>
          <li>
            <strong>Vercel</strong> — website hosting
          </li>
        </ul>
        <p>
          These providers process data on our behalf only to deliver the service. We do not authorize
          them to sell your data.
        </p>

        <h2>Data Retention &amp; Deletion</h2>
        <p>
          We retain your account and study materials until you delete them or close your account.
          You can delete individual materials from your dashboard and remove all materials from
          Settings. To request full account deletion, contact us at the email below.
        </p>

        <h2>Data Security</h2>
        <p>
          We use industry-standard security measures including HTTPS encryption, secure cloud
          infrastructure, and access controls. No method of transmission over the internet is 100%
          secure, but we work to protect your information.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          StudyFlow AI is not intended for children under 13 (or under 16 in the European Economic
          Area). We do not knowingly collect data from children.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, delete, or export
          your personal data. Contact us to make a request. If you are in the EU/EEA or UK, you may
          also have the right to lodge a complaint with your local data protection authority.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. We will post the updated version on this page
          and update the &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy questions or data requests, contact:{" "}
          <a href="mailto:support@getstudyflow.online">support@getstudyflow.online</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
