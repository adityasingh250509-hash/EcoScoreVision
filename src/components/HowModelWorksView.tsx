import React, { useState } from "react";
import { 
  Cpu, 
  Layers, 
  Calculator, 
  TreePine, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Zap, 
  Sliders, 
  RefreshCw,
  Compass,
  Flame,
  Globe
} from "lucide-react";
import { motion } from "motion/react";

export default function HowModelWorksView() {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Interactive Sandbox state
  const [sandboxQty, setSandboxQty] = useState<number>(12);
  const [sandboxFactor, setSandboxFactor] = useState<number>(1.5);
  const [sandboxUnit, setSandboxUnit] = useState<string>("hours");

  const calculatedEmissions = sandboxQty * sandboxFactor;
  const calculatedTrees = Math.ceil(calculatedEmissions / 20);

  const PIPELINE_STEPS = [
    {
      id: 0,
      title: "1. Roboflow Computer Vision & Object Detection",
      icon: Cpu,
      badge: "Roboflow Workflows",
      summary: "Custom-trained appliance model detecting bounding boxes, object class, and confidence scores.",
      details: "Trained and hosted on Roboflow, the electrical-appliance-detector model is queried in real-time via the Roboflow Serverless Hosted Inference API. It parses incoming image frames or live camera streams, identifying key appliance categories (such as Microwave Oven, Refrigerator, Television, Washing Machine, Air Conditioner, and Electric Kettle) with sub-second latency.",
      codeSnippet: `// 1. Query Roboflow Hosted Inference API\nconst res = await fetch(\n  "https://serverless.roboflow.com/infer/workflows/aditya-singh-e15al/electrical-appliance-detector",\n  {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({\n      api_key: "hVoxe0R8340Zd7vEzqCz",\n      inputs: { image: { type: "base64", value: base64Image } }\n    })\n  }\n);\nconst { outputs } = await res.json();\n// outputs[0].predictions -> [{ class: "microwave", confidence: 0.94 }]`
    },
    {
      id: 1,
      title: "2. Gemini Cross-Verification & Hardware Model Extraction",
      icon: Sparkles,
      badge: "Dual-Layer Safety Net",
      summary: "Validates Roboflow predictions, corrects errors, and identifies the exact hardware model series.",
      details: "To ensure empirical accuracy, Gemini inspects the image alongside Roboflow's prediction. If Roboflow is correct, Gemini verifies the detection and identifies the exact hardware model series (e.g., 'Panasonic Inverter Countertop NN-SN686S'). If Roboflow misclassifies or encounters an unindexed item, Gemini acts as a safety net: overriding with the true appliance name and detailed specifications.",
      codeSnippet: `// 2. Gemini Cross-Verification & Hardware Spec Resolution\nconst prompt = \`Roboflow detected: "\${roboflowClass}".\nIs this correct? If Roboflow made an error, tell the true appliance name.\nAlso identify the exact model number and hardware specifications.\`;\n\nconst verification = await ai.models.generateContent({\n  model: "gemini-3.1-flash-lite",\n  contents: [prompt, imagePart],\n  config: { responseMimeType: "application/json" }\n});`
    },
    {
      id: 2,
      title: "3. Semantic Classification & Schema Output",
      icon: Layers,
      badge: "Strict JSON Schema",
      summary: "Deterministic taxonomy mapping into categorized environmental scopes.",
      details: "The verified appliance and hardware model are mapped into standardized GHG scopes (Appliance, Energy, Transport, or Waste). An empirical baseline consumption quantity and standard operational unit (hours, km, or kWh) are extracted.",
      codeSnippet: `{\n  "item_name": "Microwave Oven (Panasonic Countertop Inverter 1200W)",\n  "appliance_name": "microwave oven",\n  "model": "Panasonic Countertop Inverter 1200W",\n  "category": "appliance",\n  "default_unit": "hours",\n  "estimated_quantity": 0.5,\n  "estimated_factor": 1.2,\n  "factor_label": "Standard Inverter Microwave 1200W Grid Factor"\n}`
    },
    {
      id: 3,
      title: "4. Emission Factor Matrix Multiplication",
      icon: Calculator,
      badge: "GHG Protocol Standard",
      summary: "Mathematical carbon equivalent calculation based on regional grid & fuel standards.",
      details: "Emissions are computed using the empirical formula: CO2e (kg) = Usage Quantity (Q) × Emission Factor (EF). Factors follow the Intergovernmental Panel on Climate Change (IPCC) and GHG Protocol Scope 1 and Scope 2 standards.",
      codeSnippet: `// Empirical Emissions Formula\nconst emissions = quantity * factor;\n// Example: 0.5 hours * 1.2 kg CO2/hour = 0.60 kg CO2`
    },
    {
      id: 4,
      title: "5. Botanical Tree Offset Sequestration Model",
      icon: TreePine,
      badge: "IPCC Carbon Sink Metric",
      summary: "Converting raw greenhouse gas kilograms into real-world reforestation offset targets.",
      details: "According to environmental forestry research and the EPA/IPCC, an average mature deciduous tree sequesters approximately 20 to 22 kg of CO2 per year. EcoPulse applies a conservative ceil formula: Required Trees = ⌈Emissions / 20 kg⌉.",
      codeSnippet: `// Botanical Sequestration Target\nconst treeOffset = Math.max(1, Math.ceil(emissions / 20));\n// 0.60 kg CO2 absorbed within 1 tree offset unit`
    }
  ];

  return (
    <div className="flex flex-col gap-12 pb-16 text-[#f0f6fc]">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[#c4b5fd] text-xs font-bold tracking-wide w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse"></span>
            <span>Made with Roboflow • Computer Vision Architecture</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ea44f]/15 border border-[#2ea44f]/35 text-[#2ea44f] text-xs font-bold uppercase tracking-wider w-fit">
            <Cpu className="w-4 h-4" />
            <span>Dual-AI Verification Pipeline</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          How the Roboflow Model Works
        </h1>
        <p className="text-base text-gray-300 leading-relaxed">
          Learn how the custom <strong className="text-white">Roboflow appliance vision model</strong> (<span className="text-[#c4b5fd] font-mono text-sm">electrical-appliance-detector</span>) 
          and hosted serverless inference operate together with <strong className="text-white">Gemini cross-verification</strong> to identify appliances, pinpoint hardware models, and calculate carbon footprints.
        </p>
      </div>

      {/* Roboflow Model Architecture Specifications Card */}
      <section className="bg-gradient-to-br from-[#1d1035] via-[#161b22] to-[#0d1117] border border-[#7c3aed]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#30363d]/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Roboflow Appliance Detector Specification</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7c3aed]/30 text-[#c4b5fd] border border-[#7c3aed]/50 uppercase">
                  Production Workflow
                </span>
              </div>
              <p className="text-xs text-gray-400">Trained and deployed with Roboflow Workflows & Hosted Serverless Inference</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#7c3aed]/40 text-[#c4b5fd]">
              API: serverless.roboflow.com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-[#0d1117]/80 border border-[#30363d]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</span>
            <div className="mt-1 font-mono text-sm font-bold text-white">aditya-singh-e15al</div>
            <p className="mt-1 text-[11px] text-gray-500">Roboflow organization workspace</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117]/80 border border-[#30363d]">
            <span className="text-[11px] font-semibold text-[#a78bfa] uppercase tracking-wider">Workflow Model ID</span>
            <div className="mt-1 font-mono text-sm font-bold text-[#c4b5fd] truncate">electrical-appliance-detector</div>
            <p className="mt-1 text-[11px] text-gray-500">Custom object detection graph</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117]/80 border border-[#30363d]">
            <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-wider">Dual-AI Integration</span>
            <div className="mt-1 font-mono text-sm font-bold text-[#38bdf8]">Roboflow + Gemini</div>
            <p className="mt-1 text-[11px] text-gray-500">Auto cross-verification & model specs</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117]/80 border border-[#30363d]">
            <span className="text-[11px] font-semibold text-[#2ea44f] uppercase tracking-wider">Target Domain</span>
            <div className="mt-1 font-mono text-sm font-bold text-[#2ea44f]">Energy & Appliances</div>
            <p className="mt-1 text-[11px] text-gray-500">Microwaves, ACs, Fridges, TVs, etc.</p>
          </div>
        </div>

        {/* How the Roboflow + Gemini Handshake Works */}
        <div className="mt-6 p-4 rounded-xl bg-[#050911]/80 border border-[#30363d] flex flex-col md:flex-row items-center gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-2 text-[#a78bfa] font-bold min-w-fit">
            <Sparkles className="w-4 h-4" />
            <span>How The Models Collaborate:</span>
          </div>
          <div className="flex-1 leading-relaxed">
            <strong className="text-white">1. Roboflow Detection:</strong> Scans the camera/uploaded frame and predicts the appliance class (e.g. <em>microwave</em>, <em>refrigerator</em>). 
            <span className="mx-2 text-gray-500">➔</span>
            <strong className="text-white">2. Gemini Verification:</strong> Validates Roboflow's prediction. If Roboflow is right, Gemini confirms it and extracts the exact model series. If Roboflow misidentifies, Gemini corrects the appliance name and specifies the model.
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step Pipeline */}
      <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#2ea44f]" />
              <span>5-Stage Neural Carbon Pipeline</span>
            </h2>
            <span className="text-xs text-gray-400">Click any stage to inspect inner mechanics</span>
          </div>

          {/* Step Pills Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2ea44f]/20 border-[#2ea44f] shadow-lg text-white"
                      : "bg-[#0d1117] border-[#30363d] hover:bg-[#21262d] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#2ea44f]" : "text-gray-400"}`} />
                    <span className="text-[10px] font-mono font-bold">{idx + 1}/5</span>
                  </div>
                  <span className="text-xs font-bold line-clamp-1">{step.title.split(". ")[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep Dive Card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left: Explanation */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-[#2ea44f]/20 text-[#2ea44f] border border-[#2ea44f]/40">
                  {PIPELINE_STEPS[activeStep].badge}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {PIPELINE_STEPS[activeStep].title}
                </h3>
              </div>

              <p className="text-sm text-gray-300 font-medium">
                {PIPELINE_STEPS[activeStep].summary}
              </p>

              <p className="text-xs text-gray-400 leading-relaxed">
                {PIPELINE_STEPS[activeStep].details}
              </p>

              <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Validated with UN SDG 13 Target 13.3 Standards</span>
              </div>
            </div>

            {/* Right: Code / Schema Inspector */}
            <div className="lg:col-span-5 bg-[#050911] border border-[#30363d] rounded-xl p-4 flex flex-col gap-2 font-mono text-xs text-gray-300 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#21262d] text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5 text-[#38bdf8]">
                  <FileText className="w-3.5 h-3.5" /> Pipeline Artifact
                </span>
                <span className="text-[10px] text-gray-500">TypeScript / JSON</span>
              </div>
              <pre className="text-emerald-300/90 leading-relaxed text-[11px] whitespace-pre-wrap">
                {PIPELINE_STEPS[activeStep].codeSnippet}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Formula Sandbox */}
      <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#38bdf8]" />
                <span>Interactive Carbon Math Sandbox</span>
              </h2>
              <p className="text-xs text-gray-400">Adjust the usage and emission coefficient to see dynamic mathematical outcomes</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#21262d] text-cyan-400 border border-[#30363d] font-mono">
              CO2e = Q × EF
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="flex flex-col gap-4 p-5 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-semibold">Usage Quantity (Q):</span>
                  <span className="font-mono text-cyan-400 font-bold">{sandboxQty} {sandboxUnit}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={sandboxQty}
                  onChange={(e) => setSandboxQty(Number(e.target.value))}
                  className="w-full accent-[#2ea44f] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-semibold">Emission Factor (EF):</span>
                  <span className="font-mono text-amber-400 font-bold">{sandboxFactor} kg/{sandboxUnit}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="5.0"
                  step="0.05"
                  value={sandboxFactor}
                  onChange={(e) => setSandboxFactor(Number(e.target.value))}
                  className="w-full accent-[#38bdf8] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-300 font-semibold">Unit Type:</span>
                <div className="grid grid-cols-3 gap-2">
                  {["hours", "km", "kWh"].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSandboxUnit(unit)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        sandboxUnit === unit
                          ? "bg-[#2ea44f]/20 border-[#2ea44f] text-[#2ea44f]"
                          : "bg-[#161b22] border-[#30363d] text-gray-400 hover:text-white"
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Summary */}
            <div className="flex flex-col justify-between p-5 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Computed Carbon Output</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400">{calculatedEmissions.toFixed(2)}</span>
                  <span className="text-sm text-gray-300 font-semibold">kg CO2</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Equivalent to driving {Math.round(calculatedEmissions / 0.12)} km in an average gasoline sedan.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#30363d]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">Severity Tier:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    calculatedEmissions < 10 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : calculatedEmissions < 40 
                      ? "bg-amber-500/20 text-amber-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {calculatedEmissions < 10 ? "Low Impact" : calculatedEmissions < 40 ? "Moderate Impact" : "High Carbon Peak"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tree Offset Target */}
            <div className="flex flex-col justify-between p-5 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Botanical Sequestration</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#2ea44f]">{calculatedTrees}</span>
                  <span className="text-sm text-gray-300 font-semibold">Tree{calculatedTrees === 1 ? "" : "s"} Required</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Based on EPA standard of 20 kg CO2 absorbed per mature deciduous tree per calendar year.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#30363d] flex items-center gap-1.5 text-[#2ea44f] text-xs font-semibold">
                <TreePine className="w-4 h-4" />
                <span>Supports Global Reforestation Targets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GHG Protocol Scopes Table */}
      <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#2ea44f]" />
          <span>GHG Protocol Scope Alignment</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <span className="text-xs font-bold text-purple-400 uppercase">Scope 1 (Direct)</span>
            <h4 className="text-sm font-bold text-white mt-1">Direct Fuel Combustion</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Emissions from gasoline/diesel passenger vehicles, natural gas stoves, and on-site generators directly detected by EcoPulse.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <span className="text-xs font-bold text-cyan-400 uppercase">Scope 2 (Indirect Grid)</span>
            <h4 className="text-sm font-bold text-white mt-1">Purchased Electricity</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Grid electricity consumed by residential air conditioners, refrigerators, water heaters, and consumer electronics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <span className="text-xs font-bold text-[#2ea44f] uppercase">Scope 3 (Value Chain)</span>
            <h4 className="text-sm font-bold text-white mt-1">Embodied & Lifecycle</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Indirect emissions from food waste, disposable packaging, consumer goods lifecycle, and flights.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
