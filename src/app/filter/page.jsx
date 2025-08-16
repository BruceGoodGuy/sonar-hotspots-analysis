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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Filter,
  Download,
  Save,
  Search,
  RefreshCw,
  AlertTriangle,
  Shield,
  User,
  Code,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { useState } from "react";
import { addDays, format } from "date-fns";

// Mock hotspots data
const mockHotspots = [
  {
    id: 1,
    key: "AYrQJ8K_123",
    message: "Make sure this SQL query is not vulnerable to injection attacks",
    author: "john.doe@company.com",
    creationDate: "2024-01-15T10:30:00Z",
    updateDate: "2024-01-15T10:30:00Z",
    status: "TO_REVIEW",
    resolution: null,
    severity: "HIGH",
    component: "src/main/java/com/example/UserService.java",
    project: "main-application",
    line: 45,
    securityCategory: "sql-injection",
    vulnerabilityProbability: "HIGH",
  },
  {
    id: 2,
    key: "AYrQJ8K_124",
    message: "Make sure that command line arguments are used safely here",
    author: "jane.smith@company.com",
    creationDate: "2024-01-14T14:20:00Z",
    updateDate: "2024-01-14T14:20:00Z",
    status: "REVIEWED",
    resolution: "SAFE",
    severity: "MEDIUM",
    component: "src/main/java/com/example/FileProcessor.java",
    project: "api-service",
    line: 78,
    securityCategory: "command-injection",
    vulnerabilityProbability: "MEDIUM",
  },
  {
    id: 3,
    key: "AYrQJ8K_125",
    message:
      "Make sure this weak hash algorithm is not used in a security context",
    author: "mike.wilson@company.com",
    creationDate: "2024-01-13T09:15:00Z",
    updateDate: "2024-01-13T09:15:00Z",
    status: "TO_REVIEW",
    resolution: null,
    severity: "LOW",
    component: "src/main/java/com/example/CryptoUtils.java",
    project: "frontend-app",
    line: 23,
    securityCategory: "weak-cryptography",
    vulnerabilityProbability: "LOW",
  },
  {
    id: 4,
    key: "AYrQJ8K_126",
    message: "Review this potentially dangerous use of XPath expression",
    author: "sarah.jones@company.com",
    creationDate: "2024-01-12T16:45:00Z",
    updateDate: "2024-01-12T16:45:00Z",
    status: "TO_REVIEW",
    resolution: null,
    severity: "HIGH",
    component: "src/main/java/com/example/XmlParser.java",
    project: "main-application",
    line: 156,
    securityCategory: "xpath-injection",
    vulnerabilityProbability: "HIGH",
  },
];

export default function FilterPage() {
  const [filteredData, setFilteredData] = useState(mockHotspots);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    authors: [], // Changed from single author to array
    severities: [], // Changed from single severity to array
    status: "",
    project: "",
    dateRange: {
      from: addDays(new Date(), -14),
      to: new Date(),
    },
    searchText: "",
  });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [authorPopoverOpen, setAuthorPopoverOpen] = useState(false);
  const [severityPopoverOpen, setSeverityPopoverOpen] = useState(false);

  const authors = [...new Set(mockHotspots.map((h) => h.author))];
  const projects = [...new Set(mockHotspots.map((h) => h.project))];
  const severities = ["HIGH", "MEDIUM", "LOW", "INFO"];

  const applyFilters = () => {
    let filtered = mockHotspots;

    if (filters.authors.length > 0) {
      filtered = filtered.filter((h) => filters.authors.includes(h.author));
    }
    if (filters.severities.length > 0) {
      filtered = filtered.filter((h) =>
        filters.severities.includes(h.severity)
      );
    }
    if (filters.status) {
      filtered = filtered.filter((h) => h.status === filters.status);
    }
    if (filters.project) {
      filtered = filtered.filter((h) => h.project === filters.project);
    }
    if (filters.searchText) {
      filtered = filtered.filter(
        (h) =>
          h.message.toLowerCase().includes(filters.searchText.toLowerCase()) ||
          h.component.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((h) => {
        const creationDate = new Date(h.creationDate);
        return (
          creationDate >= filters.dateRange.from &&
          creationDate <= filters.dateRange.to
        );
      });
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters({
      authors: [],
      severities: [],
      status: "",
      project: "",
      dateRange: {
        from: addDays(new Date(), -14),
        to: new Date(),
      },
      searchText: "",
    });
    setFilteredData(mockHotspots);
  };

  const exportToCSV = () => {
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
      ...filteredData.map((item) =>
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
      `sonarqube-hotspots-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveReport = () => {
    const report = {
      id: Date.now(),
      name: reportName,
      description: reportDescription,
      filters: filters,
      data: filteredData,
      createdAt: new Date().toISOString(),
      itemCount: filteredData.length,
    };

    // In a real app, this would save to a database
    const savedReports = JSON.parse(
      localStorage.getItem("savedReports") || "[]"
    );
    savedReports.push(report);
    localStorage.setItem("savedReports", JSON.stringify(savedReports));

    setSaveDialogOpen(false);
    setReportName("");
    setReportDescription("");
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      HIGH: {
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        icon: AlertTriangle,
        borderColor: "border-red-200 dark:border-red-800",
      },
      MEDIUM: {
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        icon: Shield,
        borderColor: "border-orange-200 dark:border-orange-800",
      },
      LOW: {
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        icon: Eye,
        borderColor: "border-yellow-200 dark:border-yellow-800",
      },
      INFO: {
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        icon: Eye,
        borderColor: "border-blue-200 dark:border-blue-800",
      },
    };
    return configs[severity] || configs.INFO;
  };

  const getStatusConfig = (status) => {
    const configs = {
      TO_REVIEW: {
        color: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
      },
      REVIEWED: {
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
      },
      RESOLVED: {
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      },
    };
    return configs[status] || configs.TO_REVIEW;
  };

  const toggleAuthor = (author) => {
    setFilters((prev) => ({
      ...prev,
      authors: prev.authors.includes(author)
        ? prev.authors.filter((a) => a !== author)
        : [...prev.authors, author],
    }));
  };

  const toggleSeverity = (severity) => {
    setFilters((prev) => ({
      ...prev,
      severities: prev.severities.includes(severity)
        ? prev.severities.filter((s) => s !== severity)
        : [...prev.severities, severity],
    }));
  };

  const removeAuthor = (author) => {
    setFilters((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a !== author),
    }));
  };

  const removeSeverity = (severity) => {
    setFilters((prev) => ({
      ...prev,
      severities: prev.severities.filter((s) => s !== severity),
    }));
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-sans mb-3">
          Filter & Export
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced filtering and beautiful reporting for your SonarQube hotspots
          analysis
        </p>
      </div>

      <Card className="mb-8 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Filter className="h-5 w-5 text-emerald-600" />
            </div>
            Smart Filters
          </CardTitle>
          <CardDescription className="text-base">
            Apply intelligent filters to discover insights in your security
            hotspots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Authors</Label>
              <Popover
                open={authorPopoverOpen}
                onOpenChange={setAuthorPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={authorPopoverOpen}
                    className="w-full justify-between h-11 bg-transparent"
                  >
                    {filters.authors.length === 0
                      ? "Select authors..."
                      : `${filters.authors.length} author${
                          filters.authors.length > 1 ? "s" : ""
                        } selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search authors..." />
                    <CommandList>
                      <CommandEmpty>No authors found.</CommandEmpty>
                      <CommandGroup>
                        {authors.map((author) => (
                          <CommandItem
                            key={author}
                            onSelect={() => toggleAuthor(author)}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                filters.authors.includes(author)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {author}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {filters.authors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.authors.map((author) => (
                    <Badge key={author} variant="secondary" className="text-xs">
                      {author.split("@")[0]}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeAuthor(author)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Severities</Label>
              <Popover
                open={severityPopoverOpen}
                onOpenChange={setSeverityPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={severityPopoverOpen}
                    className="w-full justify-between h-11 bg-transparent"
                  >
                    {filters.severities.length === 0
                      ? "Select severities..."
                      : `${filters.severities.length} severit${
                          filters.severities.length > 1 ? "ies" : "y"
                        } selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {severities.map((severity) => (
                          <CommandItem
                            key={severity}
                            onSelect={() => toggleSeverity(severity)}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                filters.severities.includes(severity)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {severity}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {filters.severities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.severities.map((severity) => {
                    const config = getSeverityConfig(severity);
                    return (
                      <Badge
                        key={severity}
                        variant="secondary"
                        className={`text-xs ${config.color}`}
                      >
                        {severity}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeSeverity(severity)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Severity</Label>
              <Select
                value={filters.severity}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-severities">All severities</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All statuses</SelectItem>
                  <SelectItem value="TO_REVIEW">To Review</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Project</Label>
              <Select
                value={filters.project}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, project: value }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-projects">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in messages and components..."
                  value={filters.searchText}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchText: e.target.value,
                    }))
                  }
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) =>
                  setFilters((prev) => ({ ...prev, dateRange }))
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={applyFilters} className="h-11 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 px-6 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Results Summary */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Analysis Results</CardTitle>
                  <CardDescription className="text-base">
                    {filteredData.length} security hotspots found
                    {selectedItems.length > 0 &&
                      ` • ${selectedItems.length} selected`}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={filteredData.length === 0}
                  className="h-11 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={filteredData.length === 0}
                      className="h-11"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Report</DialogTitle>
                      <DialogDescription>
                        Save this filtered report for future analysis
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-name">Report Name</Label>
                        <Input
                          id="report-name"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                          placeholder="Enter report name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="report-description">
                          Description (Optional)
                        </Label>
                        <Input
                          id="report-description"
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                          placeholder="Enter report description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSaveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveReport} disabled={!reportName}>
                        Save Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          {/* Quick Stats */}
          {filteredData.length > 0 && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {["HIGH", "MEDIUM", "LOW", "INFO"].map((severity) => {
                  const count = filteredData.filter(
                    (h) => h.severity === severity
                  ).length;
                  const config = getSeverityConfig(severity);
                  const Icon = config.icon;
                  return (
                    <div
                      key={severity}
                      className={`p-4 rounded-xl ${config.bgColor} ${config.borderColor} border`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <div>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground">
                            {severity}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Hotspots Cards */}
        {filteredData.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Security Hotspots Details
              </h3>
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                <Checkbox
                  checked={
                    selectedItems.length === filteredData.length &&
                    filteredData.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  className="mr-2"
                />
                Select All
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredData.map((hotspot) => {
                const severityConfig = getSeverityConfig(hotspot.severity);
                const statusConfig = getStatusConfig(hotspot.status);
                const SeverityIcon = severityConfig.icon;
                const isSelected = selectedItems.includes(hotspot.id);

                return (
                  <Card
                    key={hotspot.id}
                    className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "hover:shadow-md"
                    } backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-sm`}
                    onClick={() => toggleSelectItem(hotspot.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectItem(hotspot.id)}
                          className="mt-1"
                        />

                        <div
                          className={`p-3 rounded-xl ${severityConfig.bgColor} ${severityConfig.borderColor} border`}
                        >
                          <SeverityIcon
                            className={`h-6 w-6 ${severityConfig.color}`}
                          />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${severityConfig.color} border-current`}
                                >
                                  {hotspot.severity}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`${statusConfig.color} border-current`}
                                >
                                  {hotspot.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <h4 className="text-lg font-semibold leading-tight">
                                {hotspot.message}
                              </h4>
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                              #{hotspot.key}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Author:</span>
                              <span className="text-muted-foreground">
                                {hotspot.author}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Project:</span>
                              <span className="text-muted-foreground">
                                {hotspot.project}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Line:</span>
                              <span className="text-muted-foreground">
                                {hotspot.line}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Created:</span>
                              <span className="text-muted-foreground">
                                {format(
                                  new Date(hotspot.creationDate),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-sm">
                              <Code className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded text-xs">
                                {hotspot.component}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No hotspots found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
