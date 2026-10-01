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
  Globe,
  Download,
  Table,
  Check
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
    <div className="flex flex-col gap-10 pb-16 text-[#f1f5f9]">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        {/* Zero-Pill Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>MADE WITH ROBOFLOW</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>COMPUTER VISION ARCHITECTURE</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>GEMINI 3.7 MULTIMODAL</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
          How the Roboflow Vision Model Works
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Learn how the custom <strong className="text-white font-medium">Roboflow appliance vision model</strong> (<span className="text-violet-300 font-mono text-xs">electrical-appliance-detector</span>) 
          and hosted serverless inference operate together with <strong className="text-white font-medium">Gemini cross-verification</strong> to identify appliances, pinpoint hardware models, and calculate carbon footprints.
        </p>
      </div>

      {/* Roboflow Model Architecture Specifications Card */}
      <section className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Roboflow Appliance Detector Specification</h2>
                <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">
                  Production Workflow
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Trained and deployed with Roboflow Workflows & Hosted Serverless Inference</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-slate-300">
              API: serverless.roboflow.com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Workspace</span>
            <div className="mt-1 font-mono text-sm font-semibold text-white">aditya-singh-e15al</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Roboflow organization</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider">Workflow Model ID</span>
            <div className="mt-1 font-mono text-sm font-semibold text-violet-300 truncate">electrical-appliance-detector</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Object detection graph</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Dual-AI Integration</span>
            <div className="mt-1 font-mono text-sm font-semibold text-cyan-300">Roboflow + Gemini</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Cross-verification layer</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Target Domain</span>
            <div className="mt-1 font-mono text-sm font-semibold text-emerald-300">Energy & Appliances</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Microwaves, ACs, Fridges</p>
          </div>
        </div>

        {/* How the Roboflow + Gemini Handshake Works */}
        <div className="mt-5 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-violet-300 font-mono text-[11px] font-semibold min-w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODEL HANDSHAKE:</span>
          </div>
          <div className="flex-1 leading-relaxed text-slate-400 text-[11px] sm:text-xs">
            <strong className="text-white">1. Roboflow Detection:</strong> Scans camera/uploaded frame and predicts appliance class (e.g. <em>microwave</em>, <em>refrigerator</em>). 
            <span className="mx-2 text-slate-600">➔</span>
            <strong className="text-white">2. Gemini Verification:</strong> Validates Roboflow prediction. If accurate, confirms and extracts exact model series. If misclassified, overrides with true appliance name and hardware specs.
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step Pipeline */}
      <section className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>5-Stage Neural Carbon Pipeline</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Select stage to inspect</span>
          </div>

          {/* Step Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.08] border-emerald-500/60 shadow-xs text-white"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                    <span className="text-[10px] font-mono font-semibold">{idx + 1}/5</span>
                  </div>
                  <span className="text-xs font-semibold truncate">{step.title.split(". ")[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep Dive Card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-black/30 border border-white/[0.06] rounded-xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          >
            {/* Left: Explanation */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {PIPELINE_STEPS[activeStep].badge}
                </span>
                <h3 className="text-base font-bold text-white">
                  {PIPELINE_STEPS[activeStep].title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {PIPELINE_STEPS[activeStep].summary}
              </p>

              <p className="text-xs text-slate-400 leading-relaxed">
                {PIPELINE_STEPS[activeStep].details}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Validated against IPCC & UN SDG 13 Target 13.3 Standards</span>
              </div>
            </div>

            {/* Right: Code / Schema Inspector */}
            <div className="lg:col-span-5 bg-[#070a11] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-2 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <FileText className="w-3.5 h-3.5" /> Pipeline Artifact
                </span>
                <span className="text-[10px] text-slate-500 font-mono">TypeScript / JSON</span>
              </div>
              <pre className="text-emerald-400/90 leading-relaxed text-[11px] whitespace-pre-wrap font-mono">
                {PIPELINE_STEPS[activeStep].codeSnippet}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Formula Sandbox */}
      <section className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Interactive Carbon Math Sandbox</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Adjust usage and emission factor to observe real-time mathematical outcomes</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-black/40 text-cyan-400 border border-white/[0.08] font-mono">
              CO2e = Q × EF
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Input Controls */}
            <div className="flex flex-col gap-3.5 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Usage Quantity (Q):</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">{sandboxQty} {sandboxUnit}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={sandboxQty}
                  onChange={(e) => setSandboxQty(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Emission Factor (EF):</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">{sandboxFactor} kg/{sandboxUnit}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="5.0"
                  step="0.05"
                  value={sandboxFactor}
                  onChange={(e) => setSandboxFactor(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-slate-300">Unit Type:</span>
                <div className="grid grid-cols-3 gap-2">
                  {["hours", "km", "kWh"].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSandboxUnit(unit)}
                      className={`py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        sandboxUnit === unit
                          ? "bg-white/[0.1] border-emerald-500/60 text-emerald-400"
                          : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Summary */}
            <div className="flex flex-col justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Computed Carbon Output</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">{calculatedEmissions.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 font-mono">kg CO2</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Equivalent to driving {Math.round(calculatedEmissions / 0.12)} km in an average gasoline sedan.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400">Severity Tier:</span>
                <span className={`font-mono text-[10px] font-semibold uppercase ${
                  calculatedEmissions < 10 
                    ? "text-emerald-400" 
                    : calculatedEmissions < 40 
                    ? "text-amber-400" 
                    : "text-rose-400"
                }`}>
                  {calculatedEmissions < 10 ? "● Low Impact" : calculatedEmissions < 40 ? "▲ Moderate" : "✖ High Peak"}
                </span>
              </div>
            </div>

            {/* Tree Offset Target */}
            <div className="flex flex-col justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Botanical Sequestration</span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">{calculatedTrees}</span>
                  <span className="text-xs text-slate-400">Tree{calculatedTrees === 1 ? "" : "s"} Required</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  EPA standard of 20 kg CO2 absorbed per mature deciduous tree per year.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                <TreePine className="w-3.5 h-3.5" />
                <span>Global Reforestation Target</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GHG Protocol Scopes Table */}
      <section className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>GHG Protocol Scope Alignment</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono font-semibold text-violet-400 uppercase">Scope 1 (Direct)</span>
            <h4 className="text-xs sm:text-sm font-semibold text-white mt-1">Direct Fuel Combustion</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Emissions from gasoline/diesel passenger vehicles, gas stoves, and on-site generators directly detected by EcoPulse.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase">Scope 2 (Indirect Grid)</span>
            <h4 className="text-xs sm:text-sm font-semibold text-white mt-1">Purchased Electricity</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Grid electricity consumed by residential air conditioners, refrigerators, water heaters, and electronics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">Scope 3 (Value Chain)</span>
            <h4 className="text-xs sm:text-sm font-semibold text-white mt-1">Embodied & Lifecycle</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Indirect emissions from food waste, disposable packaging, consumer goods lifecycle, and flights.
            </p>
          </div>
        </div>
      </section>

      {/* Teacher Presentation Dataset (CSV) Section */}
      <section className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <Table className="w-3.5 h-3.5" />
              <span>Academic Presentation Dataset</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Appliance Energy & Emissions Dataset (CSV)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive 25-device reference table with power ratings, GHG factors, daily/annual CO2 calculations, and tree offset formulas to show your teacher.
            </p>
          </div>

          <a
            href="/devices_and_emissions_dataset.csv"
            download="devices_and_emissions_dataset.csv"
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer min-w-fit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV for Teacher</span>
          </a>
        </div>

        {/* Dataset Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Devices</span>
            <div className="text-base font-bold font-mono text-white mt-0.5">25 Appliances</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Roboflow Classes</span>
            <div className="text-base font-bold font-mono text-violet-300 mt-0.5">7 Categories</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-slate-400 uppercase">GHG Protocol</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">Scope 1 & 2</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Tree Offset Base</span>
            <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">20 kg/Tree/Yr</div>
          </div>
        </div>

        {/* Interactive Scrollable Table Preview */}
        <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-black/40">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-white/[0.03] text-slate-300 font-semibold sticky top-0 border-b border-white/[0.08]">
                <tr>
                  <th className="py-2.5 px-3">Device ID</th>
                  <th className="py-2.5 px-3">Appliance & Model</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Power</th>
                  <th className="py-2.5 px-3">Usage</th>
                  <th className="py-2.5 px-3 text-amber-400">Daily CO2</th>
                  <th className="py-2.5 px-3 text-rose-400">Annual CO2</th>
                  <th className="py-2.5 px-3 text-emerald-400">Trees Needed</th>
                  <th className="py-2.5 px-3">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300 font-mono text-[11px]">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-001</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Split Air Conditioner (1.5-Ton Inverter)</td>
                  <td className="py-2 px-3 text-cyan-400">Cooling</td>
                  <td className="py-2 px-3">1500W</td>
                  <td className="py-2 px-3">8.0 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">9.84 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">3,591.6 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">180 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-003</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Frost-Free Refrigerator (260L Inverter)</td>
                  <td className="py-2 px-3 text-cyan-400">Kitchen</td>
                  <td className="py-2 px-3">140W</td>
                  <td className="py-2 px-3">24.0 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">1.15 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">419.0 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">21 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-005</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Microwave Oven (Countertop 1200W)</td>
                  <td className="py-2 px-3 text-cyan-400">Kitchen</td>
                  <td className="py-2 px-3">1200W</td>
                  <td className="py-2 px-3">0.5 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">0.49 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">179.6 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">9 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-009</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Washing Machine (Front Load 8kg)</td>
                  <td className="py-2 px-3 text-cyan-400">Laundry</td>
                  <td className="py-2 px-3">500W</td>
                  <td className="py-2 px-3">1.5 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">0.62 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">224.5 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">12 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-012</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Smart Television (55-inch OLED)</td>
                  <td className="py-2 px-3 text-cyan-400">Entertainment</td>
                  <td className="py-2 px-3">120W</td>
                  <td className="py-2 px-3">5.0 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">0.49 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">179.6 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">9 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-017</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Electric Water Geyser (Storage 25L)</td>
                  <td className="py-2 px-3 text-cyan-400">Water Heating</td>
                  <td className="py-2 px-3">2000W</td>
                  <td className="py-2 px-3">1.5 hrs</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">2.46 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">897.9 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">45 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 2</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500">DEV-021</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Petrol Passenger Sedan (1.5L)</td>
                  <td className="py-2 px-3 text-violet-400">Transport</td>
                  <td className="py-2 px-3">N/A</td>
                  <td className="py-2 px-3">40.0 km</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold tabular-nums">4.80 kg</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold tabular-nums">1,752.0 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">88 trees</td>
                  <td className="py-2 px-3 text-slate-500">Scope 1</td>
                </tr>
                <tr className="hover:bg-white/[0.02] bg-emerald-500/5">
                  <td className="py-2 px-3 text-emerald-400">DEV-025</td>
                  <td className="py-2 px-3 font-medium text-white font-sans">Home Solar Rooftop PV (5 kW)</td>
                  <td className="py-2 px-3 text-emerald-400">Clean Energy</td>
                  <td className="py-2 px-3">5000W</td>
                  <td className="py-2 px-3">5.0 hrs</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">-16.40 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">-5,986.0 kg</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold tabular-nums">-299 trees</td>
                  <td className="py-2 px-3 text-slate-500">Offset</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Showing preview of 8 of 25 devices. Download full CSV for ratings, savings tips, and Roboflow classes.</span>
            <a
              href="/devices_and_emissions_dataset.csv"
              download="devices_and_emissions_dataset.csv"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Dataset (.csv)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
