import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ultron",
  description: "Terms of service for the Ultron platform. Covers account registration, billing, acceptable use, data handling, and liability.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-white mt-10 mb-4">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-white mt-6 mb-3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#999] text-[15px] leading-relaxed mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc list-inside space-y-2 text-[#999] text-[15px] leading-relaxed mb-4 pl-1">{children}</ul>;
}

function Def({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <P>
      <strong className="text-white">&ldquo;{term}&rdquo;</strong> {children}
    </P>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms &amp; Conditions</h1>
          <p className="text-[#999] text-sm">Last Updated: February 19, 2026</p>
        </div>

        <H2>Definitions</H2>
        <Def term="Service">refers to the Ultron platform, including the web dashboard at app.51ultron.com, the Telegram bot, WhatsApp bot, and all associated APIs and integrations.</Def>
        <Def term="User">refers to any individual or entity that creates an account and uses the Service.</Def>
        <Def term="OpenClaw">refers to the AI engine that powers Ultron, handling natural language processing, task execution, and automation.</Def>
        <Def term="BYOK">(Bring Your Own Key) refers to the model where Users provide their own API keys for third-party services.</Def>
        <Def term="Workspace">refers to a User&apos;s individual Ultron environment, identified by a unique workspace code.</Def>

        <H2>Account Registration</H2>
        <P>
          To use Ultron, you must create an account with a valid email address and password, or sign in via Google OAuth. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use the Service. You agree to provide accurate, current, and complete information during registration.
        </P>

        <H2>Service Plans and Billing</H2>

        <H3>Free Plan (Starter)</H3>
        <P>
          The Free plan provides access to Ultron via Telegram and WhatsApp, the web dashboard, 5 conversations per day, and BYOK capability. No payment information is required.
        </P>

        <H3>Max Plan</H3>
        <P>
          The Max plan is available at $19 per month per user, billed monthly. It includes unlimited conversations, full execution and deployment capabilities, access to all departments (Sales, Creates, Builds), and all integration capabilities.
        </P>

        <H3>Billing</H3>
        <P>
          Payments are processed through Stripe. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring monthly basis. You may cancel your subscription at any time through the Settings page or Stripe Customer Portal. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial months.
        </P>

        <H2>Acceptable Use</H2>
        <P>You agree not to use Ultron to:</P>
        <UL>
          <li>Send unsolicited bulk emails (spam) or violate anti-spam laws including CAN-SPAM and GDPR</li>
          <li>Harass, threaten, or defame any individual or organization</li>
          <li>Generate misleading, fraudulent, or deceptive content</li>
          <li>Attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
          <li>Use the Service for any illegal purpose or in violation of any applicable laws</li>
          <li>Exceed reasonable usage limits or attempt to overload the system</li>
        </UL>

        <H2>API Keys and Integrations</H2>
        <P>
          When you connect third-party services (Gmail, Google Calendar, Apollo, Apify, ZeroBounce, or others) through the Integrations page, you grant Ultron permission to access those services on your behalf using the credentials or API keys you provide.
        </P>
        <UL>
          <li>You are solely responsible for the security of your API keys</li>
          <li>We store API keys in encrypted form in our database</li>
          <li>We do not share your API keys with any third party</li>
          <li>You may revoke access at any time by disconnecting the integration</li>
          <li>You are responsible for ensuring your use of third-party services through Ultron complies with those services&apos; terms</li>
        </UL>

        <H2>AI-Generated Content and Actions</H2>
        <P>Ultron uses AI to generate content, find leads, draft emails, and perform other business tasks. You acknowledge that:</P>
        <UL>
          <li>AI-generated content may contain errors and should be reviewed before use</li>
          <li>You are responsible for all content sent or published through Ultron on your behalf</li>
          <li>Ultron will request confirmation before sending emails or performing irreversible actions</li>
          <li>Lead data and contact information sourced through Ultron may not be 100% accurate</li>
        </UL>

        <H2>Data and Privacy</H2>
        <P>
          Your use of data collected, processed, or stored through Ultron is governed by our{" "}
          <a href="/privacy-policy" className="text-[#DA4E24] hover:text-white underline underline-offset-4 transition-colors">
            Privacy Policy
          </a>
          . By using the Service, you consent to the collection and use of information as described in the Privacy Policy.
        </P>

        <H2>Intellectual Property</H2>
        <P>
          Ultron and all associated branding, technology, and documentation are the intellectual property of NXT Enterprises. Content you create using Ultron belongs to you. You grant us a limited license to process and store your content solely for the purpose of providing the Service.
        </P>

        <H2>Limitation of Liability</H2>
        <P>
          To the maximum extent permitted by applicable law, NXT Enterprises shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim. The Service is provided &ldquo;as is&rdquo; without warranties of any kind, whether express or implied.
        </P>

        <H2>Indemnification</H2>
        <P>
          You agree to indemnify and hold harmless NXT Enterprises from any claims, damages, losses, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
        </P>

        <H2>Termination</H2>
        <P>
          We may suspend or terminate your account at our discretion if you violate these Terms. You may delete your account at any time through the Settings page. Upon termination, your data will be retained for 30 days, after which it will be permanently deleted. Any outstanding subscription charges remain due upon termination.
        </P>

        <H2>Changes to These Terms</H2>
        <P>
          We may update these Terms from time to time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the updated Terms.
        </P>

        <H2>Governing Law</H2>
        <P>
          These Terms are governed by and construed in accordance with the laws of Romania. Any disputes arising from these Terms shall be resolved in the competent courts of Romania.
        </P>
      </div>
    </div>
  );
}
