import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

function isMobile(): boolean {
  return /android|iphone|ipad|ios/i.test(navigator.userAgent);
}

async function install(update: Update): Promise<void> {
  await update.downloadAndInstall();
  await relaunch();
}

export async function checkForUpdates(): Promise<void> {
  if (isMobile()) return;
  try {
    const update = await check();
    if (update) void install(update);
  } catch {
    // Sin updater configurado (dev / sin release publicado): ignorar.
  }
}
