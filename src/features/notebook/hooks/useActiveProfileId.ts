import { useEffect, useState } from "react";
import { getDefaultProfile } from "@/lib/storage";

/** Wrapper síncrono sobre `getDefaultProfile()` (promesa memoizada) para usar en componentes. */
export function useActiveProfileId(): string | null {
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const profile = await getDefaultProfile();
      if (alive) setProfileId(profile.id);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return profileId;
}
