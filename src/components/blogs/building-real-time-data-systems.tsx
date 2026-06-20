import React from 'react';

export const building_real_time_data_systems = {
  "building-real-time-data-systems": {
    slug: "building-real-time-data-systems",
    title: "Building Real-Time Data Systems: Lessons from Vehicle Telemetry",
    excerpt: "Designing high-reliability real-time systems for embedded platforms. Discusses timing constraints, signal degradation detection, and distributed data management using SOME/IP and AUTOSAR.",
    date: "2026-02-03",
    category: "Embedded Systems",
    readTime: "13 min",
    content: (
      <div className="max-w-none text-slate-300 space-y-8 leading-relaxed selection:bg-blue-500/30">
        
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Introduction
          </h2>
          <p className="text-base text-slate-400">
            Designing distributed embedded systems for the automotive sector introduces a ruthless constraint 
            that traditional cloud microservices rarely contend with: <strong>deterministic timing loops</strong>. 
          </p>
          <p className="text-slate-400">
            While developing a core vehicle telemetry ingestion platform, our team hit a classic high-concurrency 
            bottleneck. We had over 10 independent on-vehicle applications processing environment data, driver inputs, 
            and sensor metrics. Each service needed to pass its payload down to a single telemetry collector at a 
            rigid periodicity of <strong>100ms</strong>. 
          </p>
          <p className="text-slate-400">
            If a service missed its transmission window, or if the collector stalled while processing a single payload, 
            data was lost, and a system-level fault flag had to be raised instantly. Here is how we solved this problem 
            using a centralized <strong>Data Handler Architecture</strong> leveraging function pointers, concurrent lambda 
            callbacks, and Google Protocol Buffers (Protobuf).
          </p>
        </section>

        {/* The Problem */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            The Problem: High Frequency and Unpredictable Payloads
          </h2>
          <p className="text-slate-400">
            When 10+ services attempt to dump data into a single aggregator every 100ms, a naive architectural 
            design creates severe resource contention:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-300">
            <li><strong className="text-slate-200">Variable Payload Sizes:</strong> Infotainment packets might be light strings, while sensor networks stream dense arrays of tracking vectors.</li>
            <li><strong className="text-slate-200">Lock Contention:</strong> If services lock a shared global resource blindly, slower threads will block critical high-priority tasks, causing them to miss their 100ms deadlines.</li>
            <li><strong className="text-slate-200">Serialization Overhead:</strong> Converting raw structs to transmittable payloads takes CPU cycles. Doing this inefficiently inside the main loop guarantees timing failures.</li>
          </ul>
        </section>

        {/* Solution Architecture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Solution Architecture: Inverted Control with Function Pointers
          </h2>
          <p className="text-slate-400">
            To minimize data copying and eliminate raw lock stalling, we inverted the data gathering process. 
            Instead of forcing services to prepare a data payload, acquire a lock, and push it, we created a 
            centralized <code>DataHandler</code> class. 
          </p>
          <p className="text-slate-400">
            Services aggregate this handler and pass a lightweight lambda wrapper containing a function pointer 
            to their own internal data structure. The <code>DataHandler</code> manages the critical lock context 
            internally, calls the lambda to populate serialization structures in-place, and safely releases the lock.
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">1. Defining the Serialized Payload (Protobuf)</h3>
              <p className="text-slate-400 mb-3">
                We utilized Google Protocol Buffers due to their optimized binary memory footprints and fast serialization performance characteristics:
              </p>
              <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`syntax = "proto3";

message TelemetryPacket {
    string service_id = 1;
    uint64 timestamp = 2;
    bytes payload = 3;
    uint32 packet_sequence = 4;
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">2. The Centralized Data Handler Implementation</h3>
              <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`#include <iostream>
#include <mutex>
#include <functional>
#include <string>
#include <map>
#include "telemetry.pb.h"

class DataHandler {
private:
    std::mutex dataMutex;
    std::map<std::string, uint64_t> lastCommsTracker;
    const uint64_t TIMEOUT_THRESHOLD_MS = 100;

public:
    using PopulatorCallback = std::function<void(TelemetryPacket&)>;

    void executeSafeIngestion(const std::string& serviceId, PopulatorCallback populateData) {
        // Enforce tight critical section locking boundary
        std::lock_guard<std::mutex> lock(dataMutex);
        
        try {
            TelemetryPacket packet;
            packet.set_service_id(serviceId);
            packet.set_timestamp(getCurrentTimestampMS());
            
            // Execute the service's lambda closure in-place inside the safe zone
            populateData(packet);
            
            // Track timing health metrics instantly
            lastCommsTracker[serviceId] = packet.timestamp();
            dispatchToNetworkBuffer(packet);
            
        } catch (const std::exception& e) {
            raiseSystemFaultFlag(serviceId, "INGESTION_FAILURE");
        }
    }

    void verifyPeriodicityChecks() {
        std::lock_guard<std::mutex> lock(dataMutex);
        uint64_t current = getCurrentTimestampMS();
        
        for (const auto& [serviceId, lastSeen] : lastCommsTracker) {
            if ((current - lastSeen) > TIMEOUT_THRESHOLD_MS) {
                raiseSystemFaultFlag(serviceId, "MISSING_PERIODICITY_WINDOW");
            }
        }
    }
};`}
              </pre>
            </div>
          </div>
        </section>

        {/* Service Aggregation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Service Aggregation: Executing via Lambdas
          </h2>
          <p className="text-slate-400">
            By aggregating the <code>DataHandler</code> class, concrete automotive subsystems (such as a 
            Sensor Network application) drop their active references straight into a localized lambda whenever 
            their 100ms execution timer triggers.
          </p>
          <pre className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-sm font-mono text-emerald-400 overflow-x-auto shadow-inner">
{`class SensorService {
private:
    DataHandler* telemetryIngestor;
    std::string serviceId = "SENSOR_NET_02";
    uint32_t sequenceCounter = 0;

    struct SensorData {
        double velocity;
        double acceleration;
    } currentTelemetryMetrics;

public:
    SensorService(DataHandler* ingestor) : telemetryIngestor(ingestor) {}

    // Triggered exactly every 100ms via RTOS cyclic thread task loop
    void onPeriodicTimerTick() {
        sequenceCounter++;
        
        // Invoke execution path, passing lambda capturing context state definitions
        telemetryIngestor->executeSafeIngestion(serviceId, [this](TelemetryPacket& packet) {
            std::string serializedPayload;
            serializedPayload.append(
                reinterpret_cast<const char*>(&currentTelemetryMetrics), 
                sizeof(SensorData)
            );
            
            packet.set_payload(serializedPayload);
            packet.set_packet_sequence(sequenceCounter);
        });
    }
};`}
          </pre>
        </section>

        {/* Architectural Benefits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
            Architectural Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">1. Avoids Duplicate Heap Allocations</h3>
              <p className="text-sm text-slate-400">Passing references down avoids temporary intermediate serialization copies, keeping heap memory operations deterministic.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">2. Isolated Deadlock Protection</h3>
              <p className="text-sm text-slate-400">Application developers don't touch raw mutex locks. Context acquisition is managed securely within the internal layout frame.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-1">3. Non-Blocking Audits</h3>
              <p className="text-sm text-slate-400">A watchdog loop running <code>verifyPeriodicityChecks()</code> monitors transaction footprints without stalling hot paths.</p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="space-y-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl mt-12">
          <h2 className="text-xl font-bold text-white">Conclusion</h2>
          <p className="text-slate-400 text-sm">
            When dealing with hard automotive timing loops, code predictability matters just as much as raw processing speed. 
            Moving the serialization and concurrency abstractions away from individual services and into an aggregated 
            <code>DataHandler</code> allowed our telemetry platform to handle fluctuating multi-payload bursts with rock-solid reliability.
          </p>
        </section>

      </div>
    ),
  }
};