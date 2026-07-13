const getSiteDisplayName = () => {
  const site = (import.meta.env.VITE_SITE_NAME || "").split(".")[0] || "";
  return site ? site.charAt(0).toUpperCase() + site.slice(1).toLowerCase() : "";
};

export default function Terms() {
  const siteName = getSiteDisplayName() || "ClearLedger";
  return (
    <div className="max-w-4xl mx-auto" id="terms">
      <section className="py-12 border-b-2 border-blue-200 mb-12">
        <h1 className="mb-4 text-4xl text-slate-900">Terms of Participation &amp; Transparency Framework</h1>
        <div className="h-1 w-20 bg-blue-600 mb-6"></div>
        <p className="text-xl text-slate-600 leading-relaxed">Effective Date: March 5, 2026</p>
      </section>
      <article className="space-y-6 text-slate-700 leading-relaxed">
        <p>{siteName} Research Inc. (&quot;{siteName}&quot;, &quot;we&quot;, &quot;our&quot;) is an independent transparency and documentation-focused research organization. These Terms of Participation &amp; Transparency Framework (the &quot;Agreement&quot;) govern your access to and participation in any {siteName} study, audit-style review, evaluation program, panel, or structured research initiative (collectively, the &quot;Research Programs&quot;).</p>
        <p>By participating in any Research Program, you acknowledge and agree to the terms set out below.</p>
        <p>{siteName} and the participant are each referred to as a &quot;Party&quot; and collectively as the &quot;Parties.&quot;</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4 first:mt-0">1. Research Mandate and Scope</h2>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">1.1 Core Focus</h3>
        <p>{siteName} conducts structured research centered on transparency, disclosure clarity, system documentation, workflow traceability, and control visibility within regulated or age-restricted digital environments.</p>
        <p>Research Programs may include evaluation of:</p>
        <ul>
          <li>Registration disclosures</li>
          <li>Identity verification sequencing</li>
          <li>Payment method transparency</li>
          <li>Withdrawal processing clarity</li>
          <li>Terms and conditions presentation</li>
          <li>Responsible-use tools and limit settings</li>
          <li>Support accessibility</li>
          <li>Communication and notification structures</li>
        </ul>
        <p>Research findings may be aggregated, anonymized, synthesized, and compiled into analytical reports.</p>

        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">1.2 Non-Operational Status</h3>
        <p>{siteName} is not a gambling operator, sportsbook, casino, gaming platform, wagering service, payment processor, financial institution, or promotional intermediary.</p>
        <p>{siteName} does not:</p>
        <ul>
          <li>Operate wagering services</li>
          <li>Accept deposits or process withdrawals</li>
          <li>Facilitate gambling transactions</li>
          <li>Provide bonuses, incentives, or inducements</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">1.3 Excluded Areas</h3>
        <p>{siteName} Research Programs do not include evaluation, comparison, or promotion of commercial bonuses, inducements, or marketing offers.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">2. Independence and Neutrality</h2>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">2.1 Structural Independence</h3>
        <p>{siteName} operates independently and is not owned by, affiliated with, controlled by, or engaged by any third-party platform evaluated within its research.</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">2.2 No Revenue From Evaluated Platforms</h3>
        <p>{siteName} does not receive commissions, referral fees, revenue sharing, or performance-based payments from any platform reviewed.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">3. Eligibility and Participation Conditions</h2>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">3.1 Age Requirement</h3>
        <p>Participation is limited to individuals who are at least nineteen (19) years of age and legally capable of entering into this Agreement.</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">3.2 Voluntary Participation</h3>
        <p>Participation is voluntary. You may discontinue participation at any time.</p>
        <p>Participation does not require:</p>
        <ul>
          <li>Depositing funds</li>
          <li>Placing wagers</li>
          <li>Engaging commercially with third-party services</li>
        </ul>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">3.3 Independent Capacity</h3>
        <p>Participants act solely in a personal capacity. This Agreement does not create employment, agency, partnership, fiduciary, or advisory relationships.</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">3.4 No Advisory Services</h3>
        <p>{siteName} does not provide financial, legal, investment, or gambling advice and does not recommend any third-party services.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">4. Compensation Terms</h2>
        <p>If compensation is offered, it is provided solely for time and structured feedback submitted within Research Programs.</p>
        <p>Compensation:</p>
        <ul>
          <li>Is not contingent upon wagering</li>
          <li>Is not tied to deposit activity</li>
          <li>Is not linked to promotional incentives</li>
          <li>Is not based on engagement outcomes with third-party platforms</li>
        </ul>
        <p>{siteName} retains sole discretion regarding compensation eligibility and may withhold payment for incomplete, inaccurate, misleading, or non-compliant submissions.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">5. Confidentiality and Non-Disclosure</h2>
        <p>Participants may be exposed to non-public research materials, structured audit frameworks, internal evaluation methodologies, or unpublished findings.</p>
        <p>Such materials are confidential and may not be:</p>
        <ul>
          <li>Shared</li>
          <li>Distributed</li>
          <li>Reproduced</li>
          <li>Used outside participation in Research Programs</li>
        </ul>
        <p>Confidentiality obligations survive termination.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">6. Ownership of Research Materials</h2>
        <p>All submissions, evaluations, feedback, documentation, structured responses, recordings, analyses, and derivative outputs generated through participation are the exclusive property of {siteName}.</p>
        <p>Participants assign all rights, title, and interest in such materials to {siteName} and waive moral rights where permitted by law.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">7. Responsible Engagement Statement</h2>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">7.1 Analytical Context Only</h3>
        <p>{siteName} Research Programs exist solely within a transparency and documentation framework. They are not designed to promote, encourage, or induce gambling activity.</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">7.2 Informational Resources</h3>
        <p>{siteName} may provide general consumer protection or responsible engagement resources for informational purposes only.</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">7.3 No Monitoring or Intervention</h3>
        <p>{siteName} does not monitor participant conduct outside research scope and does not provide counseling, diagnostic, or intervention services.</p>
        <p>Responsibility for personal decisions remains solely with the participant.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">8. Privacy and Data Protection</h2>
        <p>{siteName} collects and processes personal information in accordance with applicable Canadian privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA).</p>
        <p>Research findings may be anonymized and aggregated for reporting purposes.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">9. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, {siteName} shall not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising from participation in Research Programs.</p>
        <p>{siteName}&apos;s total aggregate liability shall not exceed the total compensation paid to the participant, if any.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">10. Indemnification</h2>
        <p>Participants agree to indemnify and hold harmless {siteName} and its officers, directors, employees, contractors, and affiliates from any claims arising out of:</p>
        <ul>
          <li>Participation in Research Programs</li>
          <li>Breach of this Agreement</li>
          <li>Misrepresentation</li>
          <li>Independent actions taken outside the research scope</li>
        </ul>
        <p>This obligation survives termination.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">11. Suspension or Termination</h2>
        <p>{siteName} may suspend, terminate, or disqualify participation at its discretion, including for non-compliance, misrepresentation, or conduct that compromises research integrity.</p>
        <p>Unpaid compensation may be forfeited.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">12. Modifications</h2>
        <p>{siteName} may amend this Agreement by posting updated terms. Continued participation following such posting constitutes acceptance.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">13. Assignment</h2>
        <p>{siteName} may assign this Agreement without participant consent. Participants may not assign their rights under this Agreement.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">14. Force Majeure</h2>
        <p>{siteName} is not responsible for delays or failures caused by events beyond reasonable control, including natural disasters, governmental actions, cyber incidents, system failures, or telecommunications disruptions.</p>

        <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">15. Governing Law and Jurisdiction</h2>
        <p>This Agreement shall be governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
        <p>Participants irrevocably submit to the exclusive jurisdiction of the courts of Toronto, Ontario.</p>
      </article>
    </div>
  );
}
