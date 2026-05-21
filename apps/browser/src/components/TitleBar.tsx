import { Maximize2, Minus, X } from "lucide-react";
import { IconButton } from "@browser/ui";

export function TitleBar() {
  return (
    <header className="titlebar-drag flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] bg-ink-950/[0.68] px-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-aurora-cyan/30 bg-aurora-cyan/[0.15] text-xs font-bold text-aurora-cyan shadow-glow">
          B
        </div>
        <div>
          <div className="text-sm font-semibold text-white">BROWSER</div>
          <div className="text-[11px] text-white/40">AI-first workspace browser</div>
        </div>
      </div>
      <div className="no-drag flex items-center gap-1">
        <IconButton label="Minimize" onClick={() => window.browserAPI.window.minimize()}>
          <Minus size={15} />
        </IconButton>
        <IconButton label="Maximize" onClick={() => window.browserAPI.window.maximize()}>
          <Maximize2 size={14} />
        </IconButton>
        <IconButton
          className="hover:bg-rose-500/[0.18] hover:text-rose-100"
          label="Close"
          onClick={() => window.browserAPI.window.close()}
        >
          <X size={16} />
        </IconButton>
      </div>
    </header>
  );
}
