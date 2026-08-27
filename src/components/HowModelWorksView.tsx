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
      title: "1. Multimodal Vision Perception",
      icon: Cpu,
      badge: "Gemini 3.6 Flash",
      summary: "High-resolution visual encoding and fast reasoning over image parts or live video frames.",
      details: "EcoPulse passes the raw base64 image along with structured system instructions to Gemini 3.6 Flash. The model analyzes visual characteristics such as machine form factor, compressor grilles, vehicle exhausts, displacement badges, or wattage plates.",
      codeSnippet: `// Server API Call with Structured Output\nconst response = await ai.models.generateContent({\n  model: "gemini-3.6-flash",\n  contents: { parts: [imagePart, promptPart] },\n  config: {\n    responseMimeType: "application/json",\n    responseSchema: { ... }\n  }\n});`
    },
    {
      id: 1,
      title: "2. Semantic Classification & Schema Output",
      icon: Layers,
      badge: "Strict JSON Schema",
      summary: "Deterministic taxonomy mapping into categorized environmental scopes.",
      details: "The vision model classifies the item into standard GHG categories (Appliance, Transport, Energy, or Waste) and extracts a standard usage unit (hours, km, or kWh) alongside a recommended baseline consumption quantity.",
      codeSnippet: `{\n  "item_name": "Split Air Conditioner",\n  "category": "appliance",\n  "default_unit": "hours",\n  "estimated_quantity": 8,\n  "estimated_factor": 1.5,\n  "factor_label": "Standard Inverter 1.5-Ton Grid Factor"\n}`
    },
    {
      id: 2,
      title: "3. Emission Factor Matrix Multiplication",
      icon: Calculator,
      badge: "GHG Protocol Standard",
      summary: "Mathematical carbon equivalent calculation based on regional grid & fuel standards.",
      details: "Emissions are computed using the empirical formula: CO2e (kg) = Usage Quantity (Q) × Emission Factor (EF). Factors follow the Intergovernmental Panel on Climate Change (IPCC) and GHG Protocol Scope 1 and Scope 2 standards.",
      codeSnippet: `// Empirical Emissions Formula\nconst emissions = quantity * factor;\n// Example: 8 hours * 1.5 kg CO2/hour = 12.0 kg CO2`
    },
    {
      id: 3,
      title: "4. Botanical Tree Offset Sequestration Model",
      icon: TreePine,
      badge: "IPCC Carbon Sink Metric",
      summary: "Converting raw greenhouse gas kilograms into real-world reforestation offset targets.",
      details: "According to environmental forestry research and the EPA/IPCC, an average mature deciduous tree sequesters approximately 20 to 22 kg of CO2 per year. EcoPulse applies a conservative ceil formula: Required Trees = ⌈Emissions / 20 kg⌉.",
      codeSnippet: `// Botanical Sequestration Target\nconst treeOffset = Math.max(1, Math.ceil(emissions / 20));\n// 12.0 kg CO2 requires 1 full tree year to neutralize`
    },
    {
      id: 4,
      title: "5. Adaptive Generative Mitigation Synthesis",
      icon: Sparkles,
      badge: "Zero-Hallucination Advice",
      summary: "Contextual advice tailored to user specific habits, equipment, and efficiency gains.",
      details: "A secondary Gemini reasoning pass evaluates the calculated carbon footprint and yields three concise, actionable mitigation recommendations that immediately reduce operational emissions or propose cleaner renewable substitutes.",
      codeSnippet: `// Tailored Mitigation Guidance\n1. Set thermostat to 24°C (75°F) to lower compressor load by 18%.\n2. Clean intake air filters bi-weekly to prevent airflow resistance.\n3. Plant 1 native tree to completely balance this audit session.`
    }
  ];

  return (
    <div className="flex flex-col gap-12 pb-16 text-[#f0f6fc]">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ea44f]/15 border border-[#2ea44f]/35 text-[#2ea44f] text-xs font-bold uppercase tracking-wider w-fit">
          <Cpu className="w-4 h-4" />
          <span>Scientific Methodology & AI Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          How EcoPulse Translates Vision Into Carbon Intelligence
        </h1>
        <p className="text-base text-gray-300 leading-relaxed">
          Explore the multimodal neural pipeline, greenhouse gas calculation formulas, 
          and forestry sequestration models powering EcoPulse Vision for UN SDG 13.
        </p>
      </div>

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
