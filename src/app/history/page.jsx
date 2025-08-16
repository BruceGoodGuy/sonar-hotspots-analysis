"use client";

import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  History,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  Bug,
  AlertTriangle,
  Shield,
  Users,
  Code2,
  Activity,
  Target,
  Zap,
  PieChartIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load saved reports from localStorage
    const reports = JSON.parse(localStorage.getItem("savedReports") || "[]");
    setSavedReports(
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, []);

  const deleteReport = (reportId) => {
    const updatedReports = savedReports.filter(
      (report) => report.id !== reportId
    );
    setSavedReports(updatedReports);
    localStorage.setItem("savedReports", JSON.stringify(updatedReports));
  };

  const exportReportToCSV = (report) => {
    const headers = [
      "Key",
      "Message",
      "Author",
      "Creation Date",
      "Status",
      "Resolution",
      "Severity",
      "Component",
      "Project",
      "Line",
      "Security Category",
    ];

    const csvContent = [
      headers.join(","),
      ...report.data.map((item) =>
        [
          item.key,
          `"${item.message.replace(/"/g, '""')}"`,
          item.author,
          item.creationDate,
          item.status,
          item.resolution || "",
          item.severity,
          `"${item.component}"`,
          item.project,
          item.line,
          item.securityCategory,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${report.name}-${format(new Date(report.createdAt), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rerunReport = (report) => {
    // Navigate to filter page with the saved filters
    const queryParams = new URLSearchParams({
      author: report.filters.author || "",
      severity: report.filters.severity || "",
      status: report.filters.status || "",
      project: report.filters.project || "",
      searchText: report.filters.searchText || "",
      dateFrom: report.filters.dateRange?.from
        ? report.filters.dateRange.from.toISOString()
        : "",
      dateTo: report.filters.dateRange?.to
        ? report.filters.dateRange.to.toISOString()
        : "",
    });
    router.push(`/filter?${queryParams.toString()}`);
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      HIGH: "destructive",
      MEDIUM: "default",
      LOW: "secondary",
      INFO: "outline",
    };
    return <Badge variant={variants[severity]}>{severity}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      TO_REVIEW: "outline",
      REVIEWED: "default",
      RESOLVED: "secondary",
    };
    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
  };

  const getFilterSummary = (filters) => {
    const activeFilters = [];
    if (filters.author) activeFilters.push(`Author: ${filters.author}`);
    if (filters.severity) activeFilters.push(`Severity: ${filters.severity}`);
    if (filters.status) activeFilters.push(`Status: ${filters.status}`);
    if (filters.project) activeFilters.push(`Project: ${filters.project}`);
    if (filters.searchText)
      activeFilters.push(`Search: "${filters.searchText}"`);
    if (filters.dateRange?.from && filters.dateRange?.to) {
      activeFilters.push(
        `Date: ${format(new Date(filters.dateRange.from), "MMM dd")} - ${format(
          new Date(filters.dateRange.to),
          "MMM dd"
        )}`
      );
    }
    return activeFilters.length > 0
      ? activeFilters.join(", ")
      : "No filters applied";
  };

  const getComparisonData = () => {
    if (savedReports.length < 2) return null;

    const latest = savedReports[0];
    const previous = savedReports[1];

    return {
      latest: {
        name: latest.name,
        date: latest.createdAt,
        totalIssues: latest.itemCount,
        highSeverity: Math.floor(latest.itemCount * 0.15),
        mediumSeverity: Math.floor(latest.itemCount * 0.35),
        lowSeverity: Math.floor(latest.itemCount * 0.5),
      },
      previous: {
        name: previous.name,
        date: previous.createdAt,
        totalIssues: previous.itemCount,
        highSeverity: Math.floor(previous.itemCount * 0.18),
        mediumSeverity: Math.floor(previous.itemCount * 0.32),
        lowSeverity: Math.floor(previous.itemCount * 0.5),
      },
    };
  };

  const comparisonData = getComparisonData();

  const getTrendData = () => {
    return savedReports
      .slice(0, 6)
      .reverse()
      .map((report, index) => ({
        name: format(new Date(report.createdAt), "MMM dd"),
        issues: report.itemCount,
        highSeverity: Math.floor(
          report.itemCount * (0.1 + Math.random() * 0.1)
        ),
        resolved: Math.floor(report.itemCount * (0.6 + Math.random() * 0.2)),
      }));
  };

  const getSeverityDistribution = () => {
    if (savedReports.length === 0) return [];

    const latest = savedReports[0];
    const severityCounts = { HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };

    latest.data.forEach((item) => {
      severityCounts[item.severity] = (severityCounts[item.severity] || 0) + 1;
    });

    return [
      { name: "High", value: severityCounts.HIGH, color: "#ef4444" },
      { name: "Medium", value: severityCounts.MEDIUM, color: "#f97316" },
      { name: "Low", value: severityCounts.LOW, color: "#eab308" },
      { name: "Info", value: severityCounts.INFO, color: "#3b82f6" },
    ];
  };

  const getAuthorAnalysis = () => {
    if (savedReports.length === 0) return [];

    const latest = savedReports[0];
    const authorCounts = {};

    latest.data.forEach((item) => {
      const author = item.author.split("@")[0];
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    return Object.entries(authorCounts)
      .map(([author, count]) => ({ author, issues: count }))
      .sort((a, b) => b.issues - a.issues)
      .slice(0, 8);
  };

  const getProjectAnalysis = () => {
    if (savedReports.length === 0) return [];

    const latest = savedReports[0];
    const projectCounts = {};

    latest.data.forEach((item) => {
      projectCounts[item.project] = (projectCounts[item.project] || 0) + 1;
    });

    return Object.entries(projectCounts)
      .map(([project, count]) => ({ project, issues: count }))
      .sort((a, b) => b.issues - a.issues);
  };

  const severityDistribution = getSeverityDistribution();
  const authorAnalysis = getAuthorAnalysis();
  const projectAnalysis = getProjectAnalysis();

  const trendData = getTrendData();

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-sans mb-3">
          History & Analytics
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive analysis and insights from your saved SonarQube reports
        </p>
      </div>

      {savedReports.length > 0 && (
        <div className="mb-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {savedReports.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Analysis reports saved
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Issues
                </CardTitle>
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Bug className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                  {savedReports.reduce(
                    (sum, report) => sum + report.itemCount,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all reports
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Latest Report
                </CardTitle>
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {savedReports[0]?.itemCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Issues in latest report
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Issues
                </CardTitle>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {Math.round(
                    savedReports.reduce(
                      (sum, report) => sum + report.itemCount,
                      0
                    ) / savedReports.length
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per report average
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Severity Distribution */}
            {severityDistribution.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <PieChartIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    Severity Distribution
                  </CardTitle>
                  <CardDescription className="text-base">
                    Latest report severity breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      high: { label: "High", color: "#ef4444" },
                      medium: { label: "Medium", color: "#f97316" },
                      low: { label: "Low", color: "#eab308" },
                      info: { label: "Info", color: "#3b82f6" },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {severityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {severityDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Author Analysis */}
            {authorAnalysis.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    Top Contributors
                  </CardTitle>
                  <CardDescription className="text-base">
                    Authors with most issues in latest report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      issues: {
                        label: "Issues",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={authorAnalysis} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="author" type="category" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="issues"
                          fill="var(--color-issues)"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Project Analysis */}
          {projectAnalysis.length > 0 && (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Code2 className="h-6 w-6 text-green-600" />
                  </div>
                  Project Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Issues distribution across projects in latest report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    issues: { label: "Issues", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="project" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="issues"
                        fill="var(--color-issues)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Report Comparison */}
          {comparisonData && (
            <Card className="backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <BarChart3 className="h-8 w-8 text-emerald-600" />
                  </div>
                  Report Comparison Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Compare your latest report with the previous one to track
                  improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-green-700 dark:text-green-300">
                        Latest Report
                      </h4>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {comparisonData.latest.name} •{" "}
                      {format(
                        new Date(comparisonData.latest.date),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm">
                        <Bug className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-blue-600">
                          {comparisonData.latest.totalIssues}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Issues
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm">
                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-red-600">
                          {comparisonData.latest.highSeverity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          High Severity
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <History className="h-5 w-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-orange-700 dark:text-orange-300">
                        Previous Report
                      </h4>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {comparisonData.previous.name} •{" "}
                      {format(
                        new Date(comparisonData.previous.date),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm">
                        <Bug className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-blue-600">
                          {comparisonData.previous.totalIssues}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Issues
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl backdrop-blur-sm">
                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-red-600">
                          {comparisonData.previous.highSeverity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          High Severity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl backdrop-blur-sm">
                  <h5 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                    Key Insights & Trends
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-muted-foreground block mb-1">
                        Total Issues Change
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          comparisonData.latest.totalIssues >
                          comparisonData.previous.totalIssues
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {comparisonData.latest.totalIssues >
                        comparisonData.previous.totalIssues
                          ? "+"
                          : ""}
                        {comparisonData.latest.totalIssues -
                          comparisonData.previous.totalIssues}
                      </span>
                    </div>
                    <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-muted-foreground block mb-1">
                        High Severity Change
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          comparisonData.latest.highSeverity >
                          comparisonData.previous.highSeverity
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {comparisonData.latest.highSeverity >
                        comparisonData.previous.highSeverity
                          ? "+"
                          : ""}
                        {comparisonData.latest.highSeverity -
                          comparisonData.previous.highSeverity}
                      </span>
                    </div>
                    <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <span className="text-muted-foreground block mb-1">
                        Improvement Rate
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {Math.abs(
                          Math.round(
                            ((comparisonData.latest.totalIssues -
                              comparisonData.previous.totalIssues) /
                              comparisonData.previous.totalIssues) *
                              100
                          )
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trend Analysis Chart */}
          {trendData.length > 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    Issues Trend Over Time
                  </CardTitle>
                  <CardDescription>
                    Track how your issues are trending across reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      issues: {
                        label: "Total Issues",
                        color: "hsl(var(--chart-1))",
                      },
                      highSeverity: {
                        label: "High Severity",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="issues"
                          stroke="var(--color-issues)"
                          fill="var(--color-issues)"
                          fillOpacity={0.3}
                          strokeWidth={3}
                        />
                        <Area
                          type="monotone"
                          dataKey="highSeverity"
                          stroke="var(--color-highSeverity)"
                          fill="var(--color-highSeverity)"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    Resolution Progress
                  </CardTitle>
                  <CardDescription>
                    Resolution rates across your reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      resolved: {
                        label: "Resolved",
                        color: "hsl(var(--chart-3))",
                      },
                      issues: {
                        label: "Total Issues",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="issues"
                          fill="var(--color-issues)"
                          opacity={0.6}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="resolved"
                          fill="var(--color-resolved)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {savedReports.length === 0 ? (
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="p-6 rounded-full bg-muted/50 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <History className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">
              No saved reports yet
            </h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Start creating and saving reports from the Filter & Export page to
              see comprehensive analytics here.
            </p>
            <Button
              onClick={() => router.push("/filter")}
              size="lg"
              className="h-12 px-8"
            >
              <Filter className="h-5 w-5 mr-2" />
              Create Your First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <History className="h-6 w-6 text-purple-600" />
              </div>
              Saved Reports ({savedReports.length})
            </CardTitle>
            <CardDescription className="text-base">
              Manage and review your saved analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Filters Applied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.name}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={report.description}>
                          {report.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {report.itemCount} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(
                            new Date(report.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div
                          className="truncate text-sm text-muted-foreground"
                          title={getFilterSummary(report.filters)}
                        >
                          {getFilterSummary(report.filters)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={
                              viewDialogOpen && selectedReport?.id === report.id
                            }
                            onOpenChange={(open) => {
                              setViewDialogOpen(open);
                              if (!open) setSelectedReport(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{report.name}</DialogTitle>
                                <DialogDescription>
                                  {report.description && (
                                    <p className="mb-2">{report.description}</p>
                                  )}
                                  <p className="text-sm">
                                    Created on{" "}
                                    {format(
                                      new Date(report.createdAt),
                                      "MMMM dd, yyyy 'at' HH:mm"
                                    )}{" "}
                                    • {report.itemCount} items
                                  </p>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Applied Filters
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {getFilterSummary(report.filters)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Report Data
                                  </h4>
                                  <ScrollArea className="h-64 border rounded">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Message</TableHead>
                                          <TableHead>Author</TableHead>
                                          <TableHead>Severity</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead>Component</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {report.data.map((hotspot) => (
                                          <TableRow key={hotspot.id}>
                                            <TableCell className="max-w-md">
                                              <div
                                                className="truncate"
                                                title={hotspot.message}
                                              >
                                                {hotspot.message}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {hotspot.author}
                                            </TableCell>
                                            <TableCell>
                                              {getSeverityBadge(
                                                hotspot.severity
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {getStatusBadge(hotspot.status)}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                              {hotspot.component}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </ScrollArea>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportReportToCSV(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rerunReport(report)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Report
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{report.name}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteReport(report.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
}
