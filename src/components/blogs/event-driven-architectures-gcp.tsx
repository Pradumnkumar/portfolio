import React from 'react';
import NextImage from 'next/image';
import event_architecture from './assets/event-driven-architectures-gcp.png';

export const event_driven_architectures_gcp = {
  "event-driven-architectures-gcp": {
    slug: "event-driven-architectures-gcp",
    title: "Event-Driven Architectures on GCP: From Pub/Sub to Cloud Functions",
    excerpt: "Explore building scalable event-driven systems using GCP services. Learn how to decouple services, handle asynchronous workflows, and optimize costs with Cloud Run and Cloud Tasks.",
    date: "2025-05-03",
    category: "Cloud Architecture",
    readTime: "5 min",
    content:(
    <div className="max-w-none text-slate-300 space-y-8 leading-relaxed selection:bg-blue-500/30">
      
      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          Introduction
        </h2>
        <p className="text-base text-slate-400">
          When designing data pipelines that handle rich media processing and heavy AI inference, architectural boundaries matter. In the early stages of building a system to extract nutrition data, ingredient lists, and metadata from user-submitted audio logs, it is incredibly tempting to route everything through a core backend. 
        </p>
        <p className="text-slate-400">
          However, forcing a synchronous web framework like Django to handle long-running audio processing, Large Language Model (LLM) orchestration, human-in-the-loop validation gates, and external webhook deliveries creates a fragile, blocking bottleneck.
        </p>
        <p className="text-slate-400">
          This article details the architectural evolution of moving away from an all-in-one Django deployment running on Google Cloud Run, shifting instead toward an asynchronous, decoupled topology powered by Google Cloud Pub/Sub, Cloud Functions, and the Gemini API.
        </p>
      </section>

      {/* The Initial Monolith */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          The Initial Monolith: Why Django on Cloud Run Stalled
        </h2>
        <p className="text-slate-400">
          Our initial MVP followed a traditional web architecture: a unified Django application deployed to Google Cloud Run handling API requests, business logic, database state, and background processing. 
        </p>
        <p className="text-slate-400">
          When a user submitted an audio log (e.g., describing what they ate) via WhatsApp, the workflow looked like this:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-300">
          <li><strong className="text-slate-200">Webhook Reception:</strong> Django accepted the incoming audio payload from WhatsApp.</li>
          <li><strong className="text-slate-200">Heavy Inference & Extraction:</strong> Django made blocking HTTP calls to Gemini to extract structured JSON data (nutrition metrics, ingredient lists, and metadata).</li>
          <li><strong className="text-slate-200">State Tracking:</strong> The application saved the unverified draft to PostgreSQL.</li>
          <li><strong className="text-slate-200">Human Verification:</strong> Once a human reviewer checked the data, Django triggered a translation and audio synthesis layer, pushing a response back through WhatsApp.</li>
        </ol>

        <h3 className="text-lg font-semibold text-blue-400 mt-4">The Breakdown</h3>
        <p className="text-slate-400">
          While Cloud Run scales exceptionally well for stateless HTTP requests, combining these distinct workloads into a single execution context created severe architectural friction:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-slate-300">
          <li><strong className="text-slate-200">Request-Response Timeouts:</strong> Webhooks from messaging networks like WhatsApp expect rapid <code>200 OK</code> acknowledgments. Forcing the webhook thread to wait for audio processing and Gemini API response latencies risked dropping connections.</li>
          <li><strong className="text-slate-200">Resource Contention & Cost:</strong> LLM orchestration, text-to-speech generation, and media processing are highly CPU and memory intensive. Scaling up the entire Django container to accommodate transient computational spikes resulted in inflated infrastructure costs.</li>
          <li><strong className="text-slate-200">Brittle Error Scopes:</strong> If the Gemini API rate limits tripped, or the translation layer stalled, the primary web server thread crashed or hung, compromising unrelated core user workflows.</li>
        </ul>
      </section>

      {/* Architecture Reasoning */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          The Decoupled Architecture
        </h2>
        <p className="text-slate-400">
          To fix this, we stripped the heavy data processing out of the core web framework. Django was refactored to act purely as an agile, low-latency API gateway and state orchestrator, delegating execution pipelines to specialized cloud resources.
        </p>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner leading-normal">
        <NextImage 
            src={event_architecture}
            alt="GCP Pub/Sub Event Driven Architecture Diagram" 
            //Required for static GitHub Pages export
            unoptimized />
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-lg font-semibold text-blue-400">1. The Gateway Layer (Django on Cloud Run)</h3>
            <p className="text-slate-400">
              When WhatsApp sends a new incoming audio clip webhook, Django immediately writes the raw payload reference and initial status to the database, publishes a lightweight event message containing the object tracking info to a Google Cloud Pub/Sub topic, and instantly returns a <code>200 OK</code> back to WhatsApp. The total processing footprint on the web server drops to fractions of a second.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400">2. The Message Bus (Google Cloud Pub/Sub)</h3>
            <p className="text-slate-400">
              Pub/Sub provides a highly resilient, asynchronous buffer between ingestion and processing. If down-stream services experience load spikes, Pub/Sub securely queues the events. It guarantees delivery through retry policies and dead-letter topics without putting pressure on the primary application.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400">3. The Execution Worker (Google Cloud Functions)</h3>
            <p className="text-slate-400">
              A dedicated, event-driven Cloud Function is configured to subscribe to the Pub/Sub topic. This function runs completely independent of Django and is explicitly optimized with dedicated timeout ranges and resource allocations suited for media handling and AI coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive Processing Flow */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          Deep Dive: The Data & Processing Flow
        </h2>
        <p className="text-slate-400">
          When the Cloud Function pulls a message from the queue, it coordinates a series of specialized micro-tasks:
        </p>

        <div className="space-y-6 pt-2">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Step 1: Intelligent Extraction via Gemini</h3>
            <p className="text-slate-400 mb-3">
              The function sends the user's media track directly to Gemini. Using Gemini's multimodal capabilities and <strong>Structured Outputs (JSON Schema)</strong>, we enforce an exact schema layout returned directly from the model, eliminating brittle parsing regex loops:
            </p>
            <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`{
  "order_list": [
    { "name": "Greek Yogurt", "amount": "200g" },
    { "name": "Honey", "amount": "1 tbsp" }
]
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Step 2: The Human-in-the-Loop Gateway</h3>
            <p className="text-slate-400">
              AI extraction provides high velocity, but nutritional data requires strict accuracy. Once Gemini delivers the structured JSON data, the Cloud Function updates the database record state to <code>PENDING_VERIFICATION</code>. 
            </p>
            <p className="text-slate-400">
              This populates a clean internal review dashboard. A human operator reviews the extracted structured values, fixes anomalies or hallucinations if present, and signs off.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Step 3: Multilingual Audio Synthesis & Outbound Delivery</h3>
            <p className="text-slate-400">
              Once verified, an event triggers the final processing step:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-slate-200">Translation Mapping:</strong> Based on the user's profile configuration or the language code flagged by Gemini, the text summary is routed through translation layers.</li>
              <li><strong className="text-slate-200">Audio Compilation:</strong> The translated output runs through a text-to-speech engine to render localized audio insights.</li>
              <li><strong className="text-slate-200">WhatsApp Dispatch:</strong> A final payload containing both the formatted text summary and the audio insight file link is dispatched back through the WhatsApp Business API to the user.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architectural Benefits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          Architectural Benefits: Why This Move Paid Off
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
            <h3 className="font-semibold text-white mb-1">1. Rock-Solid Fault Isolation</h3>
            <p className="text-sm text-slate-400">If external translation endpoints go down or Gemini encounters a rate limit block, the Cloud Function fails safely. Pub/Sub retains the message and automatically backs off before attempting a retry.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
            <h3 className="font-semibold text-white mb-1">2. Micro-Scaling Efficiency</h3>
            <p className="text-sm text-slate-400">Isolating the heavy computation to Cloud Functions means you pay only for the exact milliseconds required to process that audio file, allowing you to downscale Django to minimal resources.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
            <h3 className="font-semibold text-white mb-1">3. Clear Code Boundaries</h3>
            <p className="text-sm text-slate-400">Developers can maintain business logic in the Django codebase without wading through complex audio handling logic. Data engineers can work exclusively inside the cloud function.</p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl mt-12">
        <h2 className="text-xl font-bold text-white">Conclusion</h2>
        <p className="text-slate-400 text-sm">
          Moving the heavy lifting from a unified web server to an event-driven architecture turned out to be a major win. By putting Pub/Sub and Cloud Functions between incoming WhatsApp webhooks and our backend, we gained separate execution scales, fault proofing, and structural maintainability without breaking our core web platform.
        </p>
      </section>

    </div>
)}
};