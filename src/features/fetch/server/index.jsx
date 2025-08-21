import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Bug,
  Shield,
  Users,
  TrendingUp,
  Clock,
  Server,
  Download,
  Zap,
  Play,
  AlertCircle,
  Activity,
  Database,
  Pause,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import FetchButton from "@/features/fetch/fetch-button";
import ProgressStep from "@/features/fetch/progress-step";

const fetchFacts = [
  "SonarQube API supports pagination with up to 500 items per request",
  "Hotspots are categorized into 4 severity levels: High, Medium, Low, Info",
  "Each hotspot contains author, creation date, and resolution status",
  "API rate limit: 1000 requests per hour per token",
  "Data includes file path, line number, and security category",
];




export default function ServerFetch() {
  const [isConnected, setIsConnected] = useState(false);

  const [fetchProgress, setFetchProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [serverUrl, setServerUrl] = useState("https://sonar.company.com");
  const [apiToken, setApiToken] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("2m 30s");
  const [fetchedCount, setFetchedCount] = useState(0);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [fetchResults, setFetchResults] = useState(null);

  const [projects, setProjects] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStream, setFetchStream] = useState({});
  const [stateStep, setStateStep] = useState({ status: '', step: '', duration: 0 });
  const [duration, setDuration] = useState({ connect: 0.1, fetch: 0.1, store: 0.1 });

  const handleStartFetch = async () => {
    setIsFetching(true);
    setStateStep({ status: 'pending', step: 'connect' });
    let startTime = Date.now();
    try {
      const res = await fetch("/api/fetch",
        {
          method: "POST",
          body: JSON.stringify({ projectKey: selectedProject })
        }
      );
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      for (; ;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // Process complete NDJSON lines
        const lines = buf.split("\n");
        buf = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const progress = JSON.parse(line);
          if (progress.step !== "error") {
            const { payload } = progress;
            if (payload.status === 'failed') {
              setStateStep({ status: 'failed', step: progress.step });
              throw new Error(payload.detail);
            }
            if (payload.status === 'done') {
              const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
              setDuration((prev) => ({ ...prev, [progress.step]: elapsedTime }));
              startTime = Date.now();
            }
            setStateStep({ status: payload.status, step: progress.step });
          }
        }
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to start fetch";
      toast.error(errorMessage);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchProject = async () => {
    setLoading(true);
    try {
      const reponse = await fetch('/api/projects');
      if (!reponse.ok) {
        throw Error("Can't fetch projects");
      }
      const { data: { projects } } = await reponse.json();
      setProjects(projects);
    } catch (error) {
      console.log(error);
      toast.error("Can't fetch project!");
      return;
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject();
  }, [])


  return (
    <>
      {fetchCompleted && fetchResults && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
                <CheckCircle className="h-8 w-8" />
                Fetch Completed Successfully
              </CardTitle>
              <CardDescription className="text-base">
                Data fetching completed at {new Date().toLocaleString()}. Here's
                your comprehensive analysis summary:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Bug className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {fetchResults.totalHotspots}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Hotspots
                  </div>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Shield className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {fetchResults.highSeverity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    High Severity
                  </div>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {fetchResults.authors}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contributors
                  </div>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {fetchResults.newIssues}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    New Issues
                  </div>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {fetchResults.resolvedIssues}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>

                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {fetchResults.avgResolutionTime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Resolution
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Code Smells</span>
                      <Badge variant="outline">{fetchResults.codeSmells}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bugs</span>
                      <Badge variant="destructive">{fetchResults.bugs}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Vulnerabilities
                      </span>
                      <Badge variant="destructive">
                        {fetchResults.vulnerabilities}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Duplicate Code
                      </span>
                      <Badge variant="secondary">
                        {fetchResults.duplicateCode}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Project Insights</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Projects Analyzed
                      </span>
                      <Badge variant="outline">{fetchResults.projects}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Critical Files
                      </span>
                      <Badge variant="destructive">
                        {fetchResults.criticalFiles}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Top Contributor
                      </span>
                      <Badge variant="default">{fetchResults.topAuthor}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Security Hotspots
                      </span>
                      <Badge variant="destructive">
                        {fetchResults.securityHotspots}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Resolution Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Resolution Rate
                      </span>
                      <Badge variant="default">
                        {Math.round(
                          (fetchResults.resolvedIssues /
                            fetchResults.newIssues) *
                          100
                        )}
                        %
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Pending Review
                      </span>
                      <Badge variant="outline">
                        {fetchResults.newIssues - fetchResults.resolvedIssues}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        High Priority
                      </span>
                      <Badge variant="destructive">
                        {fetchResults.highSeverity}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Last Updated
                      </span>
                      <Badge variant="outline">Just now</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Server className="h-6 w-6 text-blue-600" />
                Server Configuration
              </CardTitle>
              <CardDescription className="text-base">
                Configure your SonarQube server connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                {!isLoading ?
                  <Select
                    value={selectedProject}
                    disabled={isFetching}
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        projects.map(project => <SelectItem key={project.id} value={project.id}>{project.value}</SelectItem>)
                      }
                    </SelectContent>
                  </Select>
                  :
                  <Skeleton className="h-[30px] w-[120px] rounded-md" />}
              </div>
              <Separator />

              <FetchButton
                isLoading={isLoading}
                selectedProject={selectedProject}
                isFetching={isFetching}
                handleStartFetch={handleStartFetch}
              />

            </CardContent>
          </Card>
        </div>

        {/* Fetching Progress */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Download className="h-6 w-6 text-emerald-600" />
                Fetching Progress
              </CardTitle>
              <CardDescription className="text-base">
                Real-time progress of data fetching operation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressStep state={stateStep} duration={duration} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
