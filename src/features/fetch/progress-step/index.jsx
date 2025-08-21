import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

const fetchSteps = [
    {
        id: 0,
        value: "connect",
        name: "Connecting to SonarQube server",
        status: "pending",
    },
    {
        id: 1,
        value: "fetch",
        name: "Fetching hotspots",
        status: "pending",
    },
    { id: 2, value: "store", name: "Storing in local database", status: "pending" },
];

const getStatusIcon = (stepValue, state, idInprogress) => {
    const { status, step } = state;
    if (step === stepValue.value) {
        console.log("voday", step)
        if (status === "failed") {
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        }
        if (status === "done") {
            return <CheckCircle className="h-4 w-4 text-primary" />;
        }
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
    if (step === "error") {
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (stepValue.id < idInprogress) {
        return <CheckCircle className="h-4 w-4 text-primary" />;
    }
    if (stepValue.id > idInprogress) {
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
};
export default function ProgressStep({ state, duration }) {
    const inprogress = fetchSteps.find((s) => s.value === state?.step);
    return (
        <div className="space-y-3">
            <h4 className="font-medium">Processing Steps</h4>
            {fetchSteps.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                    {getStatusIcon(s, state, inprogress?.id)}
                    <span className="flex-1">{s.name}</span>
                    {duration[s.value] && (s.id < inprogress?.id || state?.status === 'done') && (
                        <span className="text-sm text-muted-foreground">
                            {duration[s.value]}s
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
