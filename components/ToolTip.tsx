import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ToolTip({ aiAnswer }: { aiAnswer: { category: string } }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">🔍 Besoin d&apos;aide ?</Button>
      </TooltipTrigger>
      <TooltipContent className="font-bold">
        L&apos;erreur est un(e) {aiAnswer.category}
      </TooltipContent>
    </Tooltip>
  );
}
