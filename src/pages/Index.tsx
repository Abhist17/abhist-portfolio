import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { THEMES } from "@/os/data";
import { System, useIsPhone, useSystem } from "@/os/system";
import {
  Dock, DesktopIcons, Intro, LockScreen, MenuBar, Widgets, Windows,
} from "@/os/desktop";
import { Springboard } from "@/os/mobile";
import { BootScreen } from "@/os/boot";

/* Paints the chosen wallpaper by swapping the sky tokens. */
function Wallpaper({ children, phone }: { children: React.ReactNode; phone: boolean }) {
  const { theme } = useSystem();
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0];

  return (
    <div
      className={`os ${phone ? "os-phone" : ""}`}
      style={{
        ["--sky-0" as string]: t.sky[0],
        ["--sky-1" as string]: t.sky[1],
        ["--sky-2" as string]: t.sky[2],
        ["--sky-3" as string]: t.sky[3],
      }}>
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
      <AnimatePresence mode="wait">
        {phase === "boot" && <BootScreen key="boot" />}
        {phase === "lock" && <LockScreen key="lock" />}
      </AnimatePresence>

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
