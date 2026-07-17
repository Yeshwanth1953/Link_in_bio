"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Link2, Eye, Calendar, Sparkles } from "lucide-react";

interface ClickPerLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

interface DailyClick {
  date: string;
  clicks: number;
}

interface AnalyticsData {
  totalClicks: number;
  clicksPerLink: ClickPerLink[];
  dailyClicks: DailyClick[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/dashboard/analytics");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setError("Failed to fetch analytics data");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-900/35 text-red-400 rounded-3xl max-w-2xl">
        <p className="font-semibold">Error Loading Analytics</p>
        <p className="text-sm mt-1">{error || "Could not retrieve link data."}</p>
      </div>
    );
  }

  // Calculate maximum click count in history for scaling the chart
  const maxClicks = Math.max(...data.dailyClicks.map((d) => d.clicks), 5);
  const maxLinkClicks = Math.max(...data.clicksPerLink.map((l) => l.clicks), 1);

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;

  // Compute SVG Points for the line chart
  const points = data.dailyClicks
    .map((d, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (data.dailyClicks.length - 1);
      const y = chartHeight - padding - (d.clicks * (chartHeight - padding * 2)) / maxClicks;
      return `${x},${y}`;
    })
    .join(" ");

  // Compute fill area for the line chart (gradients)
  const areaPoints = points
    ? `${padding},${chartHeight - padding} ${points} ${chartWidth - padding},${chartHeight - padding}`
    : "";

  return (
    <div className="max-w-2xl space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Click Analytics</span>
          <BarChart3 className="h-5 w-5 text-violet-500" />
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Track visitor click metrics. See which affiliate or profile links generate the highest engagement.
        </p>
      </div>

      {/* Grid: Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Eye className="h-24 w-24 text-violet-400" />
          </div>
          <div className="h-12 w-12 rounded-2xl bg-violet-650/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Eye className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-450 uppercase tracking-widest">Total Link Clicks</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{data.totalClicks}</h3>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Link2 className="h-24 w-24 text-indigo-400" />
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-650/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Link2 className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-450 uppercase tracking-widest">Active Link Cards</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{data.clicksPerLink.length}</h3>
          </div>
        </div>
      </div>

      {/* Line Chart: Daily click timeline (Custom SVG) */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            <span>Last 7 Days Traffic</span>
          </h4>
          <span className="text-[10px] text-slate-555 font-medium flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Daily clicks</span>
          </span>
        </div>

        <div className="w-full overflow-x-auto select-none pt-2">
          <div className="min-w-[450px] w-full relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 1, 2].map((i) => {
                const y = padding + (i * (chartHeight - padding * 2)) / 2;
                return (
                  <line
                    key={i}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Under the Line */}
              {areaPoints && (
                <polygon points={areaPoints} fill="url(#chartGradient)" />
              )}

              {/* Line Chart Path */}
              {points && (
                <polyline
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              )}

              {/* Individual Data Points */}
              {data.dailyClicks.map((d, index) => {
                const x = padding + (index * (chartWidth - padding * 2)) / (data.dailyClicks.length - 1);
                const y = chartHeight - padding - (d.clicks * (chartHeight - padding * 2)) / maxClicks;
                return (
                  <g key={index} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-violet-500 stroke-slate-950 stroke-2"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      className="fill-violet-500/20 stroke-none opacity-0 group-hover/dot:opacity-100 transition-opacity"
                    />
                    {/* Tooltip on Hover */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-white text-[9px] font-bold opacity-0 group-hover/dot:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded shadow"
                    >
                      {d.clicks}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels (Dates) */}
              {data.dailyClicks.map((d, index) => {
                const x = padding + (index * (chartWidth - padding * 2)) / (data.dailyClicks.length - 1);
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="fill-slate-500 text-[9px] font-medium"
                  >
                    {d.date}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* List: Links Click Breakdown with responsive progress bars */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-slate-350 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-450" />
            <span>Engagement Per Link</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Click totals broken down by active cards.</p>
        </div>

        <div className="space-y-4">
          {data.clicksPerLink.length > 0 ? (
            data.clicksPerLink.map((link) => {
              // Calculate percentage of clicks relative to the highest clicked link
              const percentage = maxLinkClicks > 0 ? (link.clicks / maxLinkClicks) * 100 : 0;
              return (
                <div key={link.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 truncate max-w-xs sm:max-w-md" title={link.title}>
                      {link.title}
                    </span>
                    <span className="text-slate-450 shrink-0 font-mono">
                      {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-slate-500 italic">
              Create a link and start getting clicks to populate link metrics!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
