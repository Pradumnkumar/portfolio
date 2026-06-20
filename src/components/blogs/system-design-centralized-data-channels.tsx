import React from 'react';

export const system_design_centralized_data_channels = {
  "system-design-centralized-data-channels": {
    slug: "system-design-centralized-data-channels",
    title: "System Design: Centralized Data Channels and Singleton Patterns",
    excerpt: "Designing maintainable interfaces for microservices. Learn how to implement centralized data channels as a single source of truth and enable seamless protocol updates with minimal code changes.",
    date: "2025-12-28",
    category: "System Design",
    readTime: "13 min",
    content: (
      <div className="max-w-none text-slate-300 space-y-8 leading-relaxed selection:bg-blue-500/30">
        
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Introduction
          </h2>
          <p className="text-base text-slate-400">
            Building scalable microservices requires careful thought about how components communicate. 
            In this article, I'll share how we implemented centralized data channels as a single source 
            of truth in our vehicle telemetry platform at Jaguar Land Rover, and how singleton patterns 
            enabled seamless protocol updates with minimal code changes.
          </p>
        </section>

        {/* The Problem */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            The Problem
          </h2>
          <p className="text-slate-400">
            Our distributed automotive system consists of multiple embedded subsystems communicating 
            via <strong>SOME/IP (Scalable Service-Oriented MiddleWARe over IP)</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Engine Control Units (ECUs)</li>
            <li>Infotainment Systems</li>
            <li>Sensor Networks</li>
            <li>Telemetry Collectors</li>
          </ul>
          <p className="text-slate-400 pt-2">
            Originally, each service independently handled its data protocol conversion, which led to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li>Code duplication across multiple services</li>
            <li>Inconsistent data transformations</li>
            <li>Difficult protocol updates requiring changes in 5+ places</li>
            <li>Tight coupling between services and protocol logic</li>
          </ul>
        </section>

        {/* Solution */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Solution: Centralized Data Channels
          </h2>
          <p className="text-slate-400">
            We designed a centralized data channel architecture where all protocol handling was abstracted 
            into dedicated channel managers. Here's how it works:
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">1. Data Channel Interface</h3>
              <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`class DataChannel {
public:
    virtual void publish(const Message& msg) = 0;
    virtual void subscribe(MessageHandler handler) = 0;
    virtual void updateProtocol(const ProtocolSpec& spec) = 0;
    virtual ~DataChannel() = default;
};`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">2. Singleton Pattern Implementation</h3>
              <p className="text-slate-400 mb-3">
                The singleton pattern ensures only one instance of each channel exists across the entire system. 
                By utilizing <code>std::call_once</code>, we achieve complete thread-safety during heap initialization:
              </p>
              <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`#include <memory>
#include <mutex>
#include <map>

class TelemetryChannel : public DataChannel {
private:
    static std::unique_ptr<TelemetryChannel> instance;
    static std::once_flag initFlag;
    
    std::map<std::string, Message> messageBuffer;
    ProtocolConverter converter;
    
    // Private constructor protects direct initialization
    TelemetryChannel() = default;
    
public:
    // Explicitly delete copy paths
    TelemetryChannel(const TelemetryChannel&) = delete;
    TelemetryChannel& operator=(const TelemetryChannel&) = delete;
    
    static TelemetryChannel* getInstance() {
        // Safe, isolated initialization context sequence
        std::call_once(initFlag, []() {
            instance = std::unique_ptr<TelemetryChannel>(new TelemetryChannel());
        });
        return instance.get();
    }
    
    void publish(const Message& msg) override {
        auto converted = converter.toSOMEIP(msg);
        messageBuffer[msg.id] = converted;
        // Broadcast to subscribers
    }
};
// 1. Allocate the smart pointer shell in static memory
std::unique_ptr<TelemetryChannel> TelemetryChannel::instance = nullptr;
// 2. Allocate the thread synchronization flag in static memory
std::once_flag TelemetryChannel::initFlag;
`}
              </pre>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Benefits of This Approach
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">1. Single Source of Truth</h3>
              <p className="text-sm text-slate-400">All protocol conversions happen in one place. Services query the channel rather than implementing custom parsing loops.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">2. Seamless Protocol Updates</h3>
              <p className="text-sm text-slate-400">When SOME/IP updates happen, we only alter the ProtocolConverter. All services update instantly without redeployment constraints.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">3. Reduced Code Duplication</h3>
              <p className="text-sm text-slate-400">Eliminated ~2000 lines of duplicated logic across systems, dropping core maintenance overhead parameters by 70%.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">4. Testability</h3>
              <p className="text-sm text-slate-400">Centralized blocks made execution paths predictable, dramatically simplifying writing complex integration logic tests.</p>
            </div>
          </div>
        </section>

        {/* Implementation Details */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Implementation Details
          </h2>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-400">Thread Safety Insights</h3>
            <p className="text-slate-400">
              In modern C++, declaring a custom copy constructor as <code>= delete</code> implicitly suppresses the automatic generation of move constructors. 
            </p>
            <blockquote className="border-l-4 border-blue-500 bg-slate-950 p-4 rounded-r-xl my-2 text-sm italic text-slate-400">
              Rule of Thumb: While the compiler blocks move operations implicitly if copying is deleted, explicitly writing out both deleted states improves code clarity and protects against subtle compiler versioning configuration updates.
            </blockquote>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Dependency Injection Integration</h3>
            <p className="text-slate-400 mb-3">
              While singletons offer clear architectural access points, abstracting dependencies through pointer handles keeps things clean and mockable for target unit test suites:
            </p>
            <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`class VehicleService {
private:
    DataChannel* channel;
    
public:
    // Allow an injected mock or fall back to the default operational Singleton channel
    VehicleService(DataChannel* ch = nullptr) 
        : channel(ch ? ch : TelemetryChannel::getInstance()) {}
        
    void processTelemetry() {
        Message msg;
        // ... build telemetry payload
        channel->publish(msg);
    }
};`}
            </pre>
          </div>
        </section>

        {/* Lessons Learned */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Lessons Learned
          </h2>
          <ul className="space-y-3 pl-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">▪</span>
              <p><strong className="text-slate-200">Singleton ≠ Global:</strong> Use dependency injection structures even alongside singletons to preserve clear isolation and test containment metrics.</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">▪</span>
              <p><strong className="text-slate-200">Protocol Abstraction:</strong> Abstracting implementation formats away behind clean interfaces makes subsequent embedded hardware migrations straightforward.</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">▪</span>
              <p><strong className="text-slate-200">Thread Safety First:</strong> In low-latency embedded networks, always model processing pathways assuming concurrent race contexts from the initial line of architecture code.</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">▪</span>
              <p><strong className="text-slate-200">Monitoring:</strong> Add lightweight telemetry metrics to tracking wrappers to map health statuses and capture data processing latency trends before anomalies impact hardware modules.</p>
            </li>
          </ul>
        </section>

        {/* Conclusion */}
        <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl mt-12">
          <h2 className="text-xl font-bold text-white">Conclusion</h2>
          <p className="text-slate-400 text-sm">
            Centralized data channels with singleton patterns provided a clean, maintainable architecture 
            for our distributed automotive system. This approach reduced code duplication, enabled seamless 
            protocol updates, and improved overall system reliability.
          </p>
          <p className="text-slate-400 text-sm font-medium text-blue-400/90">
            The key takeaway: when multiple services need consistent access to shared resources, consider 
            centralizing that logic behind a well-designed interface rather than duplicating it across 
            your codebase.
          </p>
        </section>

        <h2>Question: Why did we use instance.get() instead of returning just the unique_ptr reference?</h2>

      </div>
    ),
  }
};