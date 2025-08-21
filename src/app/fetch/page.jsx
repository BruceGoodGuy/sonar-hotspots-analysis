"use client";

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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Server,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Database,
  Activity,
  Zap,
  TrendingUp,
  Users,
  Bug,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import ServerFetch from "@/features/fetch/server";

// Mock fetch history data
const fetchHistory = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:25",
    server: "sonar.company.com",
    project: "main-application",
    status: "completed",
    duration: "2m 34s",
    hotspots: 1234,
    errors: 0,
  },
  {
    id: 2,
    timestamp: "2024-01-14 09:15:12",
    server: "sonar.company.com",
    project: "api-service",
    status: "completed",
    duration: "1m 45s",
    hotspots: 567,
    errors: 0,
  },
  {
    id: 3,
    timestamp: "2024-01-13 16:22:08",
    server: "sonar.company.com",
    project: "frontend-app",
    status: "failed",
    duration: "0m 23s",
    hotspots: 0,
    errors: 1,
  },
];


export default function FetchPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [serverUrl, setServerUrl] = useState("https://sonar.company.com");
  const [apiToken, setApiToken] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("2m 30s");
  const [fetchedCount, setFetchedCount] = useState(0);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [fetchResults, setFetchResults] = useState(null);

  // Simulate fetching progress
  useEffect(() => {
    if (isFetching) {
      const interval = setInterval(() => {
        setFetchProgress((prev) => {
          if (prev >= 100) {
            setIsFetching(false);
            setFetchCompleted(true);
            setFetchResults({
              totalHotspots: 1234,
              highSeverity: 89,
              mediumSeverity: 234,
              lowSeverity: 456,
              infoSeverity: 455,
              authors: 23,
              projects: 5,
              newIssues: 156,
              resolvedIssues: 89,
              avgResolutionTime: "3.2 days",
              topAuthor: "john.doe",
              criticalFiles: 12,
              securityHotspots: 89,
              duplicateCode: "15.2%",
              codeSmells: 567,
              bugs: 23,
              vulnerabilities: 12,
            });
            return 100;
          }
          return prev + 2;
        });
        setFetchedCount((prev) => prev + Math.floor(Math.random() * 10));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isFetching]);

  // Rotate facts during fetching
  useEffect(() => {
    if (isFetching) {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % fetchFacts.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isFetching]);

  const handleStartFetch = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setFetchedCount(0);
    setCurrentStep(0);
  };

  const handleTestConnection = () => {
    setIsConnected(true);
    // Simulate connection test
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "default",
      failed: "destructive",
      "in-progress": "secondary",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-sans mb-3">
          Fetch Data
        </h1>
        <p className="text-lg text-muted-foreground">
          Connect to your SonarQube server and fetch hotspots data
        </p>
      </div>

      <ServerFetch />

      {/* Fetch History */}
      <Card className="mt-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6 text-purple-600" />
            Fetch History
          </CardTitle>
          <CardDescription className="text-base">
            Previous data fetching operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Hotspots</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchHistory.map((fetch) => (
                  <TableRow key={fetch.id}>
                    <TableCell className="font-mono text-sm">
                      {fetch.timestamp}
                    </TableCell>
                    <TableCell>{fetch.server}</TableCell>
                    <TableCell>{fetch.project}</TableCell>
                    <TableCell>{getStatusBadge(fetch.status)}</TableCell>
                    <TableCell>{fetch.duration}</TableCell>
                    <TableCell>{fetch.hotspots.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
