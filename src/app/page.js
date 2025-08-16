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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Area,
  AreaChart,
} from "recharts";
import {
  Bug,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Database,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useState } from "react";

// Mock data for demonstration
const severityData = [
  { name: "High", value: 89, color: "hsl(var(--chart-3))" },
  { name: "Medium", value: 234, color: "hsl(var(--chart-5))" },
  { name: "Low", value: 456, color: "hsl(var(--chart-4))" },
  { name: "Info", value: 455, color: "hsl(var(--chart-1))" },
];

const trendData = [
  { date: "2024-01-01", hotspots: 1200, resolved: 890 },
  { date: "2024-01-08", hotspots: 1180, resolved: 920 },
  { date: "2024-01-15", hotspots: 1234, resolved: 945 },
  { date: "2024-01-22", hotspots: 1190, resolved: 980 },
  { date: "2024-01-29", hotspots: 1156, resolved: 1010 },
  { date: "2024-02-05", hotspots: 1089, resolved: 1045 },
];

const authorData = [
  { author: "john.doe", hotspots: 145, resolved: 89 },
  { author: "jane.smith", hotspots: 123, resolved: 98 },
  { author: "mike.wilson", hotspots: 98, resolved: 76 },
  { author: "sarah.jones", hotspots: 87, resolved: 65 },
  { author: "alex.brown", hotspots: 76, resolved: 54 },
];

const chartConfig = {
  hotspots: {
    label: "Hotspots",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-2))",
  },
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("2weeks");
  const [dataSource, setDataSource] = useState("all");

  const getTimeRangeData = () => {
    switch (timeRange) {
      case "1week":
        return { newHotspots: 234, resolved: 189, total: 1234 };
      case "2weeks":
        return { newHotspots: 456, resolved: 378, total: 1234 };
      case "1month":
        return { newHotspots: 789, resolved: 612, total: 1234 };
      default:
        return { newHotspots: 456, resolved: 378, total: 1234 };
    }
  };

  const getDataSourceStats = () => {
    switch (dataSource) {
      case "fetch1":
        return {
          totalHotspots: 1234,
          highSeverity: 89,
          newIssues: 156,
          resolved: 89,
          projects: 5,
        };
      case "fetch2":
        return {
          totalHotspots: 987,
          highSeverity: 67,
          newIssues: 123,
          resolved: 98,
          projects: 3,
        };
      case "fetch3":
        return {
          totalHotspots: 1456,
          highSeverity: 112,
          newIssues: 189,
          resolved: 134,
          projects: 7,
        };
      default:
        return {
          totalHotspots: 3677,
          highSeverity: 268,
          newIssues: 468,
          resolved: 321,
          projects: 15,
        };
    }
  };

  const timeRangeData = getTimeRangeData();
  const dataSourceStats = getDataSourceStats();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground font-[family-name:var(--font-inter)]">
            Overview of your SonarQube hotspots analysis
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6 sm:mt-0">
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger className="w-52 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-200">
              <Database className="w-4 h-4 mr-2 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <SelectItem value="all">All Fetched Data</SelectItem>
              <SelectItem value="fetch1">Latest Fetch (Jan 15)</SelectItem>
              <SelectItem value="fetch2">Previous Fetch (Jan 14)</SelectItem>
              <SelectItem value="fetch3">Fetch (Jan 13)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-44 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-200">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <SelectItem value="1week">Last Week</SelectItem>
              <SelectItem value="2weeks">Last 2 Weeks</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/80 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hotspots
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
              <Bug className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              {dataSourceStats.totalHotspots.toLocaleString()}
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 mr-1 text-chart-4" />
              <span className="text-chart-4 font-medium">+12%</span>
              <span className="text-muted-foreground ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/80 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Severity
            </CardTitle>
            <div className="p-2 bg-chart-3/10 rounded-lg group-hover:bg-chart-3/20 transition-colors duration-200">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              {dataSourceStats.highSeverity}
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Activity className="w-3 h-3 mr-1 text-chart-4" />
              <span className="text-chart-4 font-medium">-5%</span>
              <span className="text-muted-foreground ml-1">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/80 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Issues
            </CardTitle>
            <div className="p-2 bg-chart-5/10 rounded-lg group-hover:bg-chart-5/20 transition-colors duration-200">
              <Clock className="h-5 w-5 text-chart-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              {dataSourceStats.newIssues}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              In selected time range
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/80 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
            <div className="p-2 bg-chart-4/10 rounded-lg group-hover:bg-chart-4/20 transition-colors duration-200">
              <CheckCircle className="h-5 w-5 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              {dataSourceStats.resolved}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(
                (dataSourceStats.resolved / dataSourceStats.newIssues) * 100
              )}
              % resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Severity Distribution */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-[family-name:var(--font-space-grotesk)] font-semibold">
              Hotspots by Severity
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Distribution of hotspots across different severity levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                high: { label: "High", color: "hsl(var(--chart-3))" },
                medium: { label: "Medium", color: "hsl(var(--chart-5))" },
                low: { label: "Low", color: "hsl(var(--chart-4))" },
                info: { label: "Info", color: "hsl(var(--chart-1))" },
              }}
              className="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trends Over Time */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-[family-name:var(--font-space-grotesk)] font-semibold">
              Trends Over Time
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Hotspots detection and resolution trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="hotspots"
                    stackId="1"
                    stroke="var(--color-hotspots)"
                    fill="var(--color-hotspots)"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="var(--color-resolved)"
                    fill="var(--color-resolved)"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Author Statistics */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-[family-name:var(--font-space-grotesk)] font-semibold">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            Top Contributors
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Hotspots by author with resolution rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={authorData} layout="horizontal">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.3}
                />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  dataKey="author"
                  type="category"
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hotspots"
                  fill="var(--color-hotspots)"
                  name="Total Hotspots"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="resolved"
                  fill="var(--color-resolved)"
                  name="Resolved"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
