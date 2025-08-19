import React, { useState } from "react";
import {
  CheckSquare,
  Users,
  GitPullRequestArrow,
  Flame,
  ChevronDown,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { Button } from "../../../components/Dashboard/Home/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/Dashboard/Home/Card";


const DataBox = ({ label, value, className = '' }) => (
    <div className={`bg-white border border-slate-200 rounded-lg p-2 md:p-4 text-center flex flex-col justify-center h-full ${className}`}>
        <div className="text-xs md:text-sm font-semibold text-slate-600 mb-2">{label}</div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words">{value}</div>
    </div>
);

const SummaryBanner = ({ label, value, valueColor = 'text-[#006685]' }) => (
    <div className="bg-gray-200 rounded-lg p-3 md:p-4 flex justify-between items-center mt-auto">
        <div className="text-sm md:text-md font-semibold text-slate-700 text-left">{label}</div>
        <div className={`text-2xl md:text-4xl font-bold ${valueColor}`}>{value}</div>
    </div>
);

const BudgetUtilizationView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader><CardTitle>Budget Utilization %</CardTitle></CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="grid grid-cols-2 gap-4">
                <DataBox label="Contract Target Price" value="$10,000,00" />
                <DataBox label="Actual Contract Spend" value="$5,000,00" />
            </div>
            <SummaryBanner label="Budget Utilization %" value="20%" />
        </CardContent>
    </Card>
);

const CostToCompleteForecastView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader><CardTitle>Cost to Complete Forecast</CardTitle></CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="grid grid-cols-2 gap-4">
                <DataBox label="Forecasted Cost" value="$10,000,00" />
                <DataBox label="Actual Cost" value="$5,000,00" />
            </div>
            <SummaryBanner label="Cost to Complete" value="$10,000" />
        </CardContent>
    </Card>
);

const VarianceByProjectView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader><CardTitle>Variance by Project and Program</CardTitle></CardHeader>
        <CardContent className="flex flex-col flex-grow gap-4">
            <div className="grid grid-cols-2 gap-4">
                <DataBox label="Forecasted Deviation" value="$10,000,00" />
                <DataBox label="Variance at Completion" value="$5,000,00" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex-grow">
                <h4 className="font-semibold text-slate-700 mb-2">AI Summary</h4>
                <p className="text-sm text-slate-600">Yes to politics race civil prove game watch into.</p>
            </div>
        </CardContent>
    </Card>
);

const VendorContractOverviewView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader><CardTitle>Vendor Contract Overview + Variance of Completion</CardTitle></CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="bg-white border rounded-lg p-4">
                <div className="bg-gray-200 p-2 rounded-t-md flex justify-between font-semibold text-sm">
                    <span>Vendor X</span>
                    <span>Contract Id: C-100</span>
                </div>
                <div className="space-y-2 mt-2 text-xs md:text-sm">
                    {Object.entries({
                        "Contract Start Date": "07/06/2024",
                        "Contract End Date": "08/08/2025",
                        "Contract Ceiling Price": "$10,000,00",
                        "Contract Target Price": "$10,000,00",
                        "Actual Contract Spend": "$10,000,000,00",
                    }).map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b pb-1">
                            <span className="text-slate-600">{label}</span>
                            <span className="font-medium text-slate-800">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-200 rounded-lg p-3 flex justify-between items-center mt-auto">
                <div className="text-md font-semibold text-slate-700">Variance at Completion</div>
                <div className="text-xl md:text-2xl font-bold text-red-600">-$245</div>
            </div>
        </CardContent>
    </Card>
);

const BurnRateAnalysisView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader><CardTitle>Burn Rate Analysis</CardTitle></CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <div className="grid grid-cols-2 gap-4">
                <DataBox label="Planned Cost" value="$10,000,00" />
                <DataBox label="Actual Cost" value="$5,000,00" />
            </div>
            <SummaryBanner label="Actual Cost per time period" value="$10,000" />
        </CardContent>
    </Card>
);

const SpendAndAccrualsView = () => (
    <Card className="bg-[#f3f7f6] h-[430px] flex flex-col">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <CardTitle>Spend and Accruals</CardTitle>
                <span className="text-xs text-slate-500 flex-shrink-0">Update Date: 09/20/2025</span>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            {/* CORRECTED LAYOUT: Using flex-wrap for a 2x1 balanced layout */}
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="w-full sm:w-[calc(50%-0.5rem)]">
                    <DataBox label="Actual Cost" value="$10,000,00" />
                </div>
                <div className="w-full sm:w-[calc(50%-0.5rem)]">
                    <DataBox label="Forecasted Cost" value="$10,000,00" />
                </div>
                <div className="w-full sm:w-[calc(50%-0.5rem)]">
                    <DataBox label="Planned Cost" value="$5,000,00" />
                </div>
            </div>
            <SummaryBanner label="Forecasted Deviation" value="$10,000" />
        </CardContent>
    </Card>
);


// --- Main Dashboard Component ---

const Home = () => {
    const [selectedProject, setSelectedProject] = useState("Project A");
    const [aiSource, setAiSource] = useState("Google");
    const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);

    const financialOverviewItems = [
        "Budget Utilization %", "Cost to complete Forecast", "Variance by Project and program",
        "Vendor Contract Overview", "Burn Rate Analysis", "Spend and Accruals"
    ];
    const [selectedFinancialOverview, setSelectedFinancialOverview] = useState(financialOverviewItems[0]);

    // Data for charts and tables
    const portfolioStatusData = [
        { name: "Delayed", value: 50, barColor: "#ef4444" }, { name: "At Risk", value: 70, barColor: "#f59e0b" }, { name: "On Track", value: 90, barColor: "#22c55e" },
    ];
    const budgetBarsData = [
        { label: "Approved Budget", value: "$1,000,000", barWidthPercent: 100, barColorClass: "bg-teal-600" }, { label: "Actual Spend", value: "$1,000,000", barWidthPercent: 60, barColorClass: "bg-blue-500" },
    ];
    const forecastsData = [
        { label: "-$50,000", needleRotation: 45, sections: [{ color: "#22c55e", percentage: 100, offset: 0 }] },
        { label: "+20%", needleRotation: 150, sections: [{ color: "#22c55e", percentage: 50, offset: 0 }, { color: "#facc15", percentage: 25, offset: 50 }, { color: "#ef4444", percentage: 25, offset: 75 }] },
    ];
    const projectsAI = [
        { name: "Project A", delay: "8%", confidence: "High", risk: "Resource Allocation" }, { name: "Project B", delay: "15%", confidence: "Medium", risk: "Scope Creep" }, { name: "Project C", delay: "5%", confidence: "High", risk: "Dependency" }, { name: "Project D", delay: "22%", confidence: "Low", risk: "Budget Overrun" },
    ];
    const riskFactors = [
        { icon: CheckSquare, label: "Task Delay", sublabel: "High", count: 4, color: "text-red-500" }, { icon: Users, label: "Team Inactivity", sublabel: "Moderate", count: 3, color: "text-amber-500" }, { icon: GitPullRequestArrow, label: "Dependency Conflict", sublabel: "Critical", count: 5, color: "text-red-600" }, { icon: Flame, label: "Burnout Risk", sublabel: "Low", count: 6, color: "text-green-500" },
    ];
    const slippageData = [
        { month: "Jan", plan: 10, actual: 8, forecast: 9 }, { month: "Feb", plan: 20, actual: 15, forecast: 18 }, { month: "Mar", plan: 35, actual: 30, forecast: 32 }, { month: "Apr", plan: 50, actual: 45, forecast: 48 }, { month: "May", plan: 70, actual: 68, forecast: 72 }, { month: "Jun", plan: 85, actual: 88, forecast: 90 },
    ];
    const pieData = [
        { name: "Open Issues (60 - Medium)", value: 60 }, { name: "Open Issues (30 - High)", value: 30 }, { name: "Open Issues (45 - Low)", value: 45 },
    ];
    const PIE_COLORS = ["#f97316", "#ef4444", "#22c55e"];

    const Gauge = ({ label, needleRotation, sections }) => {
        const radius = 40; const circumference = Math.PI * radius;
        return (
            <div className="flex flex-col items-center">
                <svg width="120" height="65" viewBox="0 0 100 55" className="mb-1">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    {sections.map((section, index) => (<path key={index} d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={section.color} strokeWidth="10" strokeDasharray={`${(section.percentage / 100) * circumference} ${circumference}`} strokeDashoffset={-((section.offset / 100) * circumference)} />))}
                    <g style={{ transform: `rotate(${needleRotation}deg)`, transformOrigin: "50px 50px", transition: "transform 0.5s ease-in-out" }}><path d="M 50 50 L 50 15" strokeWidth="2" stroke="black" /><circle cx="50" cy="50" r="4" fill="black" /></g>
                </svg>
                <span className={`text-sm font-bold ${label.startsWith("+") ? "text-red-600" : "text-green-600"}`}>{label}</span>
            </div>
        );
    };

    // Renders the correct financial detail card based on state
    const renderFinancialDetailCard = () => {
        switch (selectedFinancialOverview) {
            case "Budget Utilization %": return <BudgetUtilizationView />;
            case "Cost to complete Forecast": return <CostToCompleteForecastView />;
            case "Variance by Project and program": return <VarianceByProjectView />;
            case "Vendor Contract Overview": return <VendorContractOverviewView />;
            case "Burn Rate Analysis": return <BurnRateAnalysisView />;
            case "Spend and Accruals": return <SpendAndAccrualsView />;
            default: return <BudgetUtilizationView />;
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="mb-4"><p className="text-xl text-[#00254D] font-bold">Portfolio Health Scorecard</p></div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* --- LEFT COLUMN --- */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <Card className="bg-[#f3f7f6]">
                                <CardHeader><CardTitle>% of Projects On Track/Delayed/At Risk</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3 mb-4">
                                        {portfolioStatusData.map((item) => (<div key={item.name}><div className="h-8 flex items-center rounded-sm px-3" style={{ width: `${item.value}%`, backgroundColor: item.barColor }}><span className="text-sm font-medium text-white">{item.name} - {item.value}%</span></div></div>))}
                                    </div>
                                    <div className="relative h-4 mt-8"><div className="absolute inset-0 border-t border-gray-300 mt-2"></div><div className="absolute inset-0 flex justify-between text-xs text-gray-500">{["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].map((val) => (<div key={val} className="flex flex-col items-center"><span className="h-1 w-px bg-gray-300"></span><span>{val}</span></div>))}</div></div>
                                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-12 md:gap-24 text-sm text-gray-600 mt-6">{portfolioStatusData.map((item) => (<div key={item.name} className="flex items-center"><span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.barColor }}></span><span>{item.name}</span></div>))}</div>
                                </CardContent>
                            </Card>
                            <Card className="flex flex-col bg-[#f3f7f6] w-full max-w-4xl mx-auto">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>AI Predicted Portfolio Risk Score</CardTitle>
                                        <div className="relative">
                                            <Button variant="outline" size="sm" className="w-28 justify-between" onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}><span>{aiSource}</span><ChevronDown className={`w-4 h-4 transition-transform ${isAiDropdownOpen ? "rotate-180" : ""}`} /></Button>
                                            {isAiDropdownOpen && (<div className="absolute top-full right-0 mt-1 w-28 bg-white border rounded-md shadow-lg z-10"><ul className="py-1"><li className="px-3 py-1 text-sm hover:bg-slate-100 cursor-pointer" onClick={() => { setAiSource("Google"); setIsAiDropdownOpen(false); }}>Google</li><li className="px-3 py-1 text-sm hover:bg-slate-100 cursor-pointer" onClick={() => { setAiSource("Jira"); setIsAiDropdownOpen(false); }}>Jira</li></ul></div>)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {projectsAI.map((project) => (<div key={project.name} className="border rounded-xl p-4 flex flex-col cursor-pointer transition-shadow bg-slate-50/50 shadow-sm"><h3 className="font-semibold mb-4 text-left w-fit text-slate-800">{project.name}</h3><div className="space-y-5 text-sm flex-grow flex flex-col"><div className="flex flex-col gap-2"><div className="flex justify-between items-center"><span className="text-slate-600">Predicted Delay%</span><span className="font-medium text-slate-800">{project.delay}</span></div><div className="relative w-full h-1.5 bg-slate-200 rounded-full"><div className="absolute top-0 left-0 h-full bg-[#00254D] rounded-full" style={{ width: project.delay }}><div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#00254D] border-2 border-white rounded-full shadow"></div></div></div></div><div className="grid grid-cols-3 items-center"><span className="text-slate-600">Confidence :</span><span className="col-span-2 font-medium text-slate-800">{project.confidence}</span></div><div className="grid grid-cols-3 items-center"><span className="text-slate-600">Risk</span><span className="col-span-2 font-medium text-slate-800">{project.risk}</span></div><div className="flex-grow"></div><Link to={aiSource === "Google" ? "/dashboard/insights/google-summary" : "/dashboard/insights/jira-summary"} className="inline-block w-full mt-auto px-4 py-2 rounded-md bg-[#00254D] text-white text-center font-semibold transition hover:bg-opacity-90">Show Summary</Link></div></div>))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* --- RIGHT COLUMN --- */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            <Card className="bg-[#f3f7f6]">
                                <CardHeader><CardTitle>Budget vs. Spend Summary</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4 mb-4">{budgetBarsData.map((bar) => (<div key={bar.label} className="flex justify-between items-center gap-4"><div className="w-3/5 bg-gray-200 rounded-sm"><div className={`text-white text-xs font-semibold text-left py-2 px-3 rounded-sm whitespace-nowrap ${bar.barColorClass}`} style={{ width: `${bar.barWidthPercent}%` }}>{bar.label}</div></div><div className="text-right font-bold text-lg text-gray-800">{bar.value}</div></div>))}</div>
                                    <div className="bg-gray-100 border-t border-b border-blue-200 text-center py-1.5 my-5"><h3 className="text-sm font-semibold text-blue-700">Forecasted Spend</h3></div>
                                    <div className="flex justify-around items-start pt-2">{forecastsData.map((forecast) => (<Gauge key={forecast.label} {...forecast} />))}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-[#f3f7f6]"><CardHeader><CardTitle>Risk Factors</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{riskFactors.map((factor) => { const Icon = factor.icon; return (<div key={factor.label} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50"><div className="flex items-center space-x-3"><Icon className={`w-6 h-6 ${factor.color}`} /><div><div className="font-medium text-sm text-gray-800">{factor.label}</div><div className="text-xs text-gray-500">{factor.sublabel}</div></div></div><span className="font-bold text-lg text-gray-800">{factor.count}</span></div>); })}</div></CardContent></Card>
                            <Card className="bg-[#f3f7f6]">
                                <CardHeader><CardTitle>Historical Slippage Trend</CardTitle></CardHeader>
                                <CardContent>
                                    <div style={{ height: 250 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={slippageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit="%" /><Tooltip /><Legend wrapperStyle={{fontSize: "12px"}} /><Line type="monotone" dataKey="plan" name="Planned" stroke="#006685" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="actual" name="Actual" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} /><Line type="monotone" dataKey="forecast" name="Forecasted" stroke="#006685" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-center text-sm text-gray-600 mt-2 font-medium">Actual Slippage</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="h-[430px] bg-[#f3f7f6]">
                                <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        {financialOverviewItems.map((item) => {
                                            const isSelected = selectedFinancialOverview === item;
                                            return (
                                                <div key={item} onClick={() => setSelectedFinancialOverview(item)} className={`flex justify-between items-center p-3 rounded-md transition-all duration-200 cursor-pointer bg-white ${isSelected ? "shadow-lg  border-b-4 border-[#006685]" : "hover:shadow-md border-l-4 border-transparent"}`}>
                                                    <span className={`text-sm ${isSelected ? "text-black font-semibold" : "text-gray-700"}`}>{item}</span>
                                                    <button className={`text-xl font-light rounded-full h-6 w-6 flex items-center justify-center ${isSelected ? "text-blue-600" : "text-gray-500"}`}>{isSelected ? "−" : "+"}</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                            {renderFinancialDetailCard()}
                            <Card className="bg-[#f3f7f6]">
                                <CardHeader><CardTitle>Project Status (RAG)</CardTitle></CardHeader>
                                <CardContent>
                                    <div style={{ height: 200 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} paddingAngle={5} labelLine={false} label={({ cx, cy, midAngle, outerRadius, value }) => { const RADIAN = Math.PI / 180; const radius = outerRadius * 0.6; const x = cx + radius * Math.cos(-midAngle * RADIAN); const y = cy + radius * Math.sin(-midAngle * RADIAN); return (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-base font-bold">{value}</text>); }}>
                                                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index]} stroke="white" strokeWidth={4} />))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm">{pieData.map((entry, index) => (<div key={entry.name} className="flex items-center"><span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: PIE_COLORS[index] }}></span><span className="text-gray-700">{entry.name}</span></div>))}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;
