import { useEffect } from "react";
import { THEMES } from "@/os/data";
import { System, useIsPhone, useSystem } from "@/os/system";
import {
  Dock, DesktopIcons, Intro, LockScreen, MenuBar, Widgets, Windows,
} from "@/os/desktop";
import { Springboard } from "@/os/mobile";
import { BootScreen } from "@/os/boot";
import { Spotlight } from "@/os/spotlight";

/* Paints the chosen wallpaper by swapping the sky tokens. */
function Wallpaper({ children, phone }: { children: React.ReactNode; phone: boolean }) {
  const { theme, windows } = useSystem();
  const hasWindow = windows.some(w => !w.minimised && !w.closing);
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0];

  return (
    <div
      className={`os ${phone ? "os-phone" : ""} ${hasWindow ? "has-window" : ""}`}
      style={{
        ["--sky-0" as string]: t.sky[0],
        ["--sky-1" as string]: t.sky[1],
        ["--sky-2" as string]: t.sky[2],
        ["--sky-3" as string]: t.sky[3],
        ["--wall-filter" as string]: t.filter,
        ["--wall-tint" as string]: t.tint,
        ["--wall-blend" as string]: t.blend,
      }}>
      <div className="os-photo" aria-hidden />
      <div className="os-tint" aria-hidden />
      <div className="os-scrim" aria-hidden />
      {children}
    </div>
  );
}

function Shell() {
  const { phase, setPhase } = useSystem();
  const phone = useIsPhone();

  /* the desktop owns the viewport; the phone layout scrolls normally */
  useEffect(() => {
    document.body.classList.toggle("is-phone", phone);
    return () => document.body.classList.remove("is-phone");
  }, [phone]);

  /* phones skip the kernel log and land straight on the springboard */
  useEffect(() => { if (phone && phase === "boot") setPhase("lock"); }, [phone, phase, setPhase]);

  if (phone) {
    return (
      <Wallpaper phone>
        <Springboard />
      </Wallpaper>
    );
  }

  return (
    <Wallpaper phone={false}>
      {/* These two were an AnimatePresence pair. Its exit never completed on
          the final step, so the lock screen stayed mounted at full opacity on
          z-400 and silently swallowed every click on the desk behind it. They
          are plain conditionals now — mounted or gone, with no third state —
          and each plays its own fade out through CSS before releasing the
          phase, so the transition survives without the guarantee resting on
          an animation callback. */}
      {phase === "boot" && <BootScreen />}
      {phase === "lock" && <LockScreen />}

      {phase === "desktop" && (
        <>
          <MenuBar />
          <div className="surface">
            <div className="surface-main">
              <Intro />
              <DesktopIcons />
            </div>
            <Widgets />
          </div>
          <Windows />
          <Dock />
          <Spotlight />
          <p className="os-credit">© {new Date().getFullYear()} Abhist Kamle · Room 524</p>
        </>
      )}
    </Wallpaper>
  );
}

export default function Index() {
  return (
    <System>
      <Shell />
    </System>
  );
}
