/**
 * Wake Lock API - Prevents screen from turning off during gameplay
 */

let wakeLock: WakeLockSentinel | null = null;

/**
 * Request wake lock to keep screen on
 */
export async function requestWakeLock(): Promise<boolean> {
  if (!('wakeLock' in navigator)) {
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');

    wakeLock.addEventListener('release', () => {
      // Wake lock was released
    });

    return true;
  } catch {
    // Wake lock request failed - probably user denied or browser doesn't support
    return false;
  }
}

/**
 * Release wake lock (allow screen to turn off)
 */
export async function releaseWakeLock(): Promise<void> {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
    } catch {
      // Silent fail
    }
  }
}

/**
 * Check if wake lock is active
 */
export function isWakeLockActive(): boolean {
  return wakeLock !== null && !wakeLock.released;
}

/**
 * Re-request wake lock on visibility change
 * (wake lock is automatically released when page is hidden)
 */
export function setupWakeLockReacquisition(): () => void {
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && wakeLock?.released) {
      await requestWakeLock();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
