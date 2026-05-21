import { Maximize2, Minus, X } from "lucide-react";
import { IconButton } from "@browser/ui";

export function TitleBar() {
  return (
    <header className="titlebar-drag flex h-12 shrink-0 items-center justify-between border-b border-[#e7c989]/[0.10] bg-[#070604]/[0.80] px-3.5 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e7c989]/[0.25] bg-[#e7c989]/[0.10] text-xs font-semibold text-[#e7c989] shadow-[0_12px_40px_rgba(231,201,137,0.10)]">
          N
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[0.03em] text-[#f4ecdc]">Noema</div>
          <div className="text-[11px] text-[#f4ecdc]/[0.42]">Browse with a mind beside you</div>
        </div>
      </div>
      <div className="no-drag flex items-center gap-1.5 rounded-xl border border-[#e7c989]/[0.10] bg-black/[0.20] p-1">
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          label="Minimize"
          onClick={() => window.browserAPI.window.minimize()}
        >
          <Minus size={15} />
        </IconButton>
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#f4ecdc]/[0.08]"
          label="Maximize"
          onClick={() => window.browserAPI.window.maximize()}
        >
          <Maximize2 size={14} />
        </IconButton>
        <IconButton
          className="h-8 w-8 rounded-lg hover:bg-[#b95d50]/[0.20] hover:text-[#ffe8df]"
          label="Close"
          onClick={() => window.browserAPI.window.close()}
        >
          <X size={16} />
        </IconButton>
      </div>
    </header>
  );
}
