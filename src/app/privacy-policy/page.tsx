import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ultron",
  description: "How Ultron collects, uses, and protects your data. BYOK model, encrypted storage, GDPR compliance.",
  alternates: { canonical: "/privacy-policy" },
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#999] text-sm">Last Updated: November 15, 2024</p>
        </div>

        <H2>Information We Collect</H2>

        <H3>Information You Provide</H3>
        <UL>
          <li>Account information: name, email address, password (hashed)</li>
          <li>Business profile: business name, description, ideal customer profile, preferred tone, active platforms</li>
          <li>API keys for third-party integrations (stored encrypted)</li>
          <li>Google OAuth tokens when you connect Gmail or Calendar</li>
          <li>Messages and conversations you have with Ultron</li>
          <li>Content you create through Ultron (posts, emails, outreach campaigns)</li>
          <li>Lead and deal data you generate or import</li>
        </UL>

        <H3>Information Collected Automatically</H3>
        <UL>
          <li>Channel connection data (Telegram user ID, WhatsApp number)</li>
          <li>Usage data: conversation count, message count, features used</li>
          <li>Workspace code and linked channel identifiers</li>
          <li>Timestamps of interactions</li>
        </UL>

        <H3>Information We Do Not Collect</H3>
        <UL>
          <li>We do not collect payment card details directly. All payments are processed by Stripe.</li>
          <li>We do not read the contents of your connected Gmail or Calendar except when executing a specific task you requested through Ultron.</li>
        </UL>

        <H2>How We Use Your Information</H2>
        <UL>
          <li>To provide and operate the Ultron Service</li>
          <li>To personalize Ultron&apos;s responses based on your business profile and conversation history</li>
          <li>To execute tasks you request: sending emails, scheduling meetings, finding leads, generating content</li>
          <li>To sync your data across channels (web dashboard, Telegram, WhatsApp) for a unified experience</li>
          <li>To enforce plan limits and manage your subscription</li>
          <li>To improve the Service and fix issues</li>
          <li>To communicate with you about your account, updates, or support</li>
        </UL>

        <H2>Data Storage and Security</H2>

        <H3>Where We Store Data</H3>
        <P>
          Your data is stored in Supabase (hosted on AWS) with row-level security enabled. Each user can only access their own data. API keys are stored in encrypted form. Google OAuth tokens are stored in a separate encrypted table.
        </P>

        <H3>Security Measures</H3>
        <UL>
          <li>Row-level security (RLS) on all database tables</li>
          <li>Encrypted storage for API keys and OAuth tokens</li>
          <li>HTTPS encryption for all web traffic</li>
          <li>Server-side API routes that never expose credentials to the browser</li>
          <li>Webhook authentication via shared secrets for server-to-server communication</li>
        </UL>

        <H3>BYOK Model</H3>
        <P>
          When you provide your own API keys (Bring Your Own Key), those keys are used exclusively to execute tasks on your behalf. We do not use your keys for any other purpose. Keys are stored encrypted and can be deleted at any time by disconnecting the integration.
        </P>

        <H2>Data Sharing</H2>
        <P>We do not sell your data. We share your information only in these cases:</P>
        <UL>
          <li>With third-party services you explicitly connect (Gmail, Apollo, Apify, etc.) to execute tasks you request</li>
          <li>With Stripe for payment processing</li>
          <li>With the AI engine (OpenClaw) to generate responses and execute tasks</li>
          <li>When required by law or to protect our legal rights</li>
        </UL>
        <P>
          We do not share your business data, leads, content, or conversation history with other Ultron users or any third party for marketing purposes.
        </P>

        <H2>Data Retention</H2>
        <UL>
          <li>Active accounts: data is retained for as long as your account is active</li>
          <li>Deleted accounts: data is permanently deleted within 30 days of account deletion</li>
          <li>Conversation history: retained indefinitely for active accounts to provide cross-channel memory and context</li>
          <li>Billing records: retained for 7 years as required by law</li>
        </UL>

        <H2>Your Rights</H2>
        <P>Under GDPR and applicable data protection laws, you have the right to:</P>
        <UL>
          <li><strong className="text-white">Access:</strong> request a copy of all data we hold about you</li>
          <li><strong className="text-white">Rectification:</strong> update or correct your personal information via the Settings page</li>
          <li><strong className="text-white">Deletion:</strong> delete your account and all associated data</li>
          <li><strong className="text-white">Portability:</strong> request your data in a machine-readable format</li>
          <li><strong className="text-white">Objection:</strong> object to certain processing of your data</li>
          <li><strong className="text-white">Restriction:</strong> request we limit how we process your data</li>
        </UL>
        <P>
          To exercise these rights, contact us at support@51ultron.com or use the account management features in the Settings page.
        </P>

        <H2>Cookies</H2>
        <P>
          We use essential cookies for authentication and session management. We do not use advertising or tracking cookies. Supabase authentication requires cookies to maintain your login session.
        </P>

        <H2>Cross-Channel Data</H2>
        <P>
          Ultron operates across multiple channels (web, Telegram, WhatsApp). When you link a channel using your workspace code, conversations and data from that channel are synced to your Supabase account. This enables Ultron to maintain context across platforms. You can unlink a channel at any time through the Settings page.
        </P>

        <H2>AI Processing</H2>
        <P>
          Your messages are processed by AI to generate responses and execute tasks. We do not use your conversations to train AI models. Your business data, leads, and content remain private to your account. AI responses may be inaccurate and should be reviewed before acting on them.
        </P>

        <H2>Children</H2>
        <P>
          Ultron is not intended for use by individuals under 18 years of age. We do not knowingly collect information from children.
        </P>

        <H2>International Data Transfers</H2>
        <P>
          Your data may be processed in servers located in the United States (AWS/Supabase) and the European Union. We ensure appropriate safeguards are in place for any international data transfers in compliance with GDPR.
        </P>

        <H2>Changes to This Policy</H2>
        <P>
          We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service. The &ldquo;Last Updated&rdquo; date at the top reflects the most recent revision.
        </P>
      </div>
    </div>
  );
}
