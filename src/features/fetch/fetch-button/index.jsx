import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
export default function FetchButton({ isLoading, selectedProject, isFetching, handleStartFetch }) {
    const isBtnDisabled = isLoading || !selectedProject || isFetching;
    let btnIcon, btnText;
    if (isLoading) {
        btnIcon = <Pause className="h-4 w-4 mr-2" />;
        btnText = "Loading...";
    } else if (!isFetching) {
        btnIcon = <Play className="h-4 w-4 mr-2" />;
        btnText = "Start Fetch";
    } else {
        btnIcon = <Pause className="h-4 w-4 mr-2" />;
        btnText = "Fetching...";
    }

    return (
        <Button
            onClick={handleStartFetch}
            disabled={isBtnDisabled}
            className="w-full"
        >
            {btnIcon}
            {btnText}
        </Button>
    );
}