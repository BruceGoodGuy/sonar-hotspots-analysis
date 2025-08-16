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
  Pause,
} from "lucide-react";
import { useState, useEffect } from "react";
export default function ServerFetch() {
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

  const handleTestConnection = () => {
    setIsConnected(true);
    // Simulate connection test
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  const handleStartFetch = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setFetchedCount(0);
    setCurrentStep(0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "in-progress":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

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
                <Label htmlFor="server-url">Server URL</Label>
                <Input
                  id="server-url"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://sonar.company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-token">API Token</Label>
                <Input
                  id="api-token"
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Enter your API token"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-app">Main Application</SelectItem>
                    <SelectItem value="api-service">API Service</SelectItem>
                    <SelectItem value="frontend">Frontend App</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={!serverUrl || !apiToken}
                  className="flex-1 bg-transparent"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                {isConnected && (
                  <CheckCircle className="h-5 w-5 text-primary mt-2" />
                )}
              </div>

              <Button
                onClick={handleStartFetch}
                disabled={!isConnected || !selectedProject || isFetching}
                className="w-full"
              >
                {isFetching ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Fetch
                  </>
                )}
              </Button>
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
              {isFetching && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{fetchProgress}%</span>
                    </div>
                    <Progress value={fetchProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {fetchedCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hotspots Fetched
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{estimatedTime}</div>
                      <div className="text-sm text-muted-foreground">
                        Estimated Time
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4/6</div>
                      <div className="text-sm text-muted-foreground">
                        Steps Complete
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Processing Steps</h4>
                    {fetchSteps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <span className="flex-1">{step.name}</span>
                        {step.duration && (
                          <span className="text-sm text-muted-foreground">
                            {step.duration}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Did you know?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {fetchFacts[currentFact]}
                    </p>
                  </div>
                </>
              )}

              {!isFetching && (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Configure your server connection and click "Start Fetch" to
                    begin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
