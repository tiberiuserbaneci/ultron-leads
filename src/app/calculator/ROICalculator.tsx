"use client";

import { useState } from "react";
import Link from "next/link";

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  displayValue?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-white">{label}</label>
        <span className="text-sm font-semibold text-white font-mono">
          {displayValue ?? `${value} ${unit}`}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E8541A ${pct}%, #262626 ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export default function ROICalculator() {
  // Fixed defaults per spec
  const [researchHours, setResearchHours] = useState(3);
  const [contentHours, setContentHours] = useState(5);
  const [leadGenHours, setLeadGenHours] = useState(5);
  const [salesHours, setSalesHours] = useState(4);
  const [infraHours, setInfraHours] = useState(1);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [freelancers, setFreelancers] = useState(500);
  const [saasTools, setSaasTools] = useState(200);

  const totalHoursPerWeek = researchHours + contentHours + leadGenHours + salesHours + infraHours;
  const monthlyTimeValue = totalHoursPerWeek * 4.3 * hourlyRate;
  const monthlyExternal = freelancers + saasTools;
  const totalMonthlyCost = monthlyTimeValue + monthlyExternal;
  const totalAnnualCost = totalMonthlyCost * 12;

  const ultronMonthly = 39; // $19 + $20 AI credits
  const ultronAnnual = ultronMonthly * 12;
  const savings = totalAnnualCost - ultronAnnual;

  const barWidth = Math.min(100, (ultronAnnual / totalAnnualCost) * 100);
  const hoursPerMonth = Math.round(totalHoursPerWeek * 4.3);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Section 1 */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-white mb-1">Your current time cost</h3>
            <p className="text-xs text-[#999]">Hours per week you spend on these tasks</p>
          </div>
          <Slider label="Research & competitive intel" unit="hrs/wk" value={researchHours} min={0} max={40} step={1} onChange={setResearchHours} />
          <Slider label="Content creation (posts, emails, blogs)" unit="hrs/wk" value={contentHours} min={0} max={40} step={1} onChange={setContentHours} />
          <Slider label="Lead generation & outreach" unit="hrs/wk" value={leadGenHours} min={0} max={40} step={1} onChange={setLeadGenHours} />
          <Slider label="Sales follow-up & deal tracking" unit="hrs/wk" value={salesHours} min={0} max={40} step={1} onChange={setSalesHours} />
          <Slider label="Infrastructure & system monitoring" unit="hrs/wk" value={infraHours} min={0} max={20} step={1} onChange={setInfraHours} />

          <div className="border-t border-[#1a1a1a] pt-4">
            <h3 className="font-semibold text-white mb-4">Your time value</h3>
            <Slider
              label="What could you earn per hour on high-value work?"
              unit="/hr"
              value={hourlyRate}
              min={25}
              max={500}
              step={5}
              onChange={setHourlyRate}
              displayValue={`$${hourlyRate}/hr`}
            />
          </div>

          <div className="border-t border-[#1a1a1a] pt-4">
            <h3 className="font-semibold text-white mb-4">External costs</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white block mb-2">Monthly freelancer/contractor spend</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] text-sm">$</span>
                  <input
                    type="number"
                    value={freelancers}
                    onChange={(e) => setFreelancers(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black border border-[#222] rounded-lg pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DA4E24] transition-colors"
                    placeholder="500"
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-white block mb-2">Monthly SaaS tools spend</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] text-sm">$</span>
                  <input
                    type="number"
                    value={saasTools}
                    onChange={(e) => setSaasTools(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black border border-[#222] rounded-lg pl-7 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DA4E24] transition-colors"
                    placeholder="200"
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output column */}
        <div className="space-y-4">
          {/* Hours saved. prominent */}
          <div className="bg-[#0a0a0a] border border-[#DA4E24]/15 rounded-2xl p-6">
            <div className="text-sm font-medium text-[#DA4E24] mb-3">Hours you get back</div>
            <div className="text-4xl font-bold font-mono text-white mb-1">{totalHoursPerWeek} <span className="text-xl text-[#999] font-normal">hrs/week</span></div>
            <div className="text-sm text-[#DA4E24] font-mono">{hoursPerMonth} hours per month</div>
            <p className="text-xs text-[#999] mt-3">
              That&apos;s {hoursPerMonth} hours you can spend on strategy, sales calls, or not working.
            </p>
          </div>

          {/* Without Ultron */}
          <div className="bg-[#0a0a0a] border border-[#999]/20 rounded-2xl p-6">
            <div className="text-sm font-medium text-[#999] mb-4">Without Ultron</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Monthly cost of your time</span>
                <span className="text-white font-mono">{formatCurrency(Math.round(monthlyTimeValue))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Monthly external costs</span>
                <span className="text-white font-mono">{formatCurrency(monthlyExternal)}</span>
              </div>
              <div className="border-t border-[#999]/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white font-medium">Monthly total</span>
                  <span className="text-[#999] font-bold font-mono text-lg">{formatCurrency(Math.round(totalMonthlyCost))}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#666]">Annual total</span>
                  <span className="text-[#999]/70 font-mono text-sm">{formatCurrency(Math.round(totalAnnualCost))}/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* With Ultron */}
          <div className="bg-[#0a0a0a] border border-[#DA4E24]/10 rounded-2xl p-6">
            <div className="text-sm font-medium text-[#DA4E24] mb-4">With Ultron</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Hours/week on operations</span>
                <span className="text-white font-mono">~2 hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Ultron plan</span>
                <span className="text-white font-mono">$19/mo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">AI credits (average)</span>
                <span className="text-white font-mono">$20/mo</span>
              </div>
              <div className="border-t border-[#DA4E24]/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white font-medium">Monthly total</span>
                  <span className="text-[#DA4E24] font-bold font-mono text-lg">$39/mo</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#666]">Annual total</span>
                  <span className="text-[#DA4E24]/70 font-mono text-sm">$468/yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Gap */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <p className="text-2xl sm:text-3xl font-bold">
            You&apos;re spending{" "}
            <span className="text-[#999]">{formatCurrency(Math.round(totalAnnualCost))}/year</span>
            {" "}on work that costs{" "}
            <span className="text-[#DA4E24]">$468</span>
            {" "}with Ultron.
          </p>
          {savings > 0 && (
            <p className="mt-3 text-xl text-[#999]">
              That&apos;s{" "}
              <span className="text-[#DA4E24] font-semibold">{formatCurrency(Math.round(savings))}</span>
              {" "}back in your pocket. Every year.
            </p>
          )}
        </div>

        {/* Visual bar comparison */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-[#999] mb-1.5">
              <span>Without Ultron</span>
              <span className="text-[#999] font-mono">{formatCurrency(Math.round(totalAnnualCost))}/yr</span>
            </div>
            <div className="h-8 bg-black rounded-lg overflow-hidden border border-[#1a1a1a]">
              <div className="h-full bg-red-500/25 border border-red-500/30 rounded-lg w-full flex items-center pl-3">
                <span className="text-[#999] text-xs font-mono">{formatCurrency(Math.round(totalAnnualCost))}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-[#999] mb-1.5">
              <span>With Ultron</span>
              <span className="text-[#DA4E24] font-mono">$468/yr</span>
            </div>
            <div className="h-8 bg-black rounded-lg overflow-hidden border border-[#1a1a1a]">
              <div
                className="h-full bg-emerald-500/25 border border-emerald-500/30 rounded-lg flex items-center pl-3 transition-all duration-500"
                style={{ width: `${Math.max(barWidth, 3)}%` }}
              >
                <span className="text-[#DA4E24] text-xs font-mono whitespace-nowrap">$468</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-2 btn-gradient glow-accent text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
          >
            Deploy 5 agents for $19/mo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
