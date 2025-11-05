/**
 * Presentation State Sync Utility
 * 
 * Manages reliable IPC communication between presenter and audience windows
 * with retry logic, debouncing, and error handling
 * 
 * Created: Phase 4 of presentation system overhaul
 */

interface SyncOptions {
  maxRetries?: number;
  retryDelay?: number;
  debounceMs?: number;
}

const DEFAULT_OPTIONS: Required<SyncOptions> = {
  maxRetries: 3,
  retryDelay: 300,
  debounceMs: 50
};

/**
 * Debounce helper
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sync presentation state with retry logic
 * 
 * @param state - Presentation state to sync
 * @param options - Sync options
 * @returns Promise that resolves when sync is confirmed
 */
export async function syncPresentationState(
  state: any,
  options: SyncOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!window.electron?.presentation?.syncState) {
    console.error('❌ IPC sync not available');
    throw new Error('IPC presentation.syncState not available');
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < opts.maxRetries) {
    try {
      console.log(`📡 Sync attempt ${attempt + 1}/${opts.maxRetries}`);
      
      await window.electron.presentation.syncState(state);
      
      console.log('✅ State synced successfully');
      return; // Success!
      
    } catch (error) {
      lastError = error as Error;
      attempt++;
      
      if (attempt < opts.maxRetries) {
        console.warn(`⚠️  Sync attempt ${attempt} failed, retrying in ${opts.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
      }
    }
  }

  // All retries failed
  console.error('❌ Failed to sync state after', opts.maxRetries, 'attempts:', lastError);
  throw new Error(`Failed to sync presentation state: ${lastError?.message}`);
}

/**
 * Create a debounced sync function
 * Useful for rapid state updates (e.g., during keyboard navigation)
 * 
 * @param debounceMs - Milliseconds to debounce
 * @returns Debounced sync function
 */
export function createDebouncedSync(debounceMs: number = 50) {
  return debounce((state: any) => {
    syncPresentationState(state, { debounceMs: 0 })
      .catch(error => {
        console.error('Debounced sync failed:', error);
      });
  }, debounceMs);
}

/**
 * Sync with initial delay for audience window loading
 * Sends state immediately, then retries after delays to ensure audience receives it
 * 
 * @param state - Presentation state to sync
 * @param delays - Array of delay times in ms (e.g., [0, 300, 1000])
 */
export async function syncWithRetrySchedule(
  state: any,
  delays: number[] = [0, 300, 1000]
): Promise<void> {
  console.log(`📡 Syncing with retry schedule: ${delays.join(', ')}ms`);
  
  for (const delay of delays) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      await syncPresentationState(state, { maxRetries: 1, debounceMs: 0 });
      // If successful, log but continue with remaining scheduled syncs
      // This ensures audience has state even if it loads slowly
    } catch (error) {
      console.warn(`Sync at ${delay}ms delay failed (this is okay, will retry)`, error);
    }
  }
  
  console.log('✅ Retry schedule complete');
}

/**
 * Check if IPC presentation API is available
 * 
 * @returns True if API is ready
 */
export function isPresentationIPCReady(): boolean {
  return !!(
    typeof window.electron?.presentation?.syncState === 'function' &&
    typeof window.electron?.presentation?.onStateUpdate === 'function'
  );
}

/**
 * Wait for presentation IPC to become ready
 * 
 * @param timeoutMs - Maximum time to wait in milliseconds
 * @returns Promise that resolves when ready or rejects on timeout
 */
export async function waitForPresentationIPC(timeoutMs: number = 5000): Promise<void> {
  const startTime = Date.now();
  
  while (!isPresentationIPCReady()) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Timeout waiting for presentation IPC to be ready');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Presentation IPC ready');
}
