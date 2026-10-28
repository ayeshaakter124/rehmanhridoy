/**
 * Global Cloud Database Synchronization Client
 * Supports Supabase & REST Cloud Storage with auto-sync and local caching fallback.
 */

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

const STORAGE_KEYS = {
  CLOUD_CONFIG: "rh_portfolio_cloud_config_v1",
};

export const DEFAULT_SUPABASE_URL = "https://vvmtwfllqurvjhpstyxt.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_tMZNkQnnWo-nudlHjp1C1Q_ngKclLYu";

const DEFAULT_CLOUD_CONFIG: CloudConfig = {
  supabaseUrl: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL,
  supabaseAnonKey: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY,
  autoSync: true,
};

const cleanUrl = (raw?: string) => {
  if (!raw) return "";
  return raw.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
};

let lastConnectionState: { isOnline: boolean; lastChecked: number; errorMessage?: string } = {
  isOnline: false,
  lastChecked: 0,
};

export const cloudStore = {
  getConfig(): CloudConfig {
    try {
      const envUrl = cleanUrl((typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "") || DEFAULT_SUPABASE_URL;
      const envKey = ((typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "").trim() || DEFAULT_SUPABASE_ANON_KEY;
      const saved = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG) : null;
      const parsed = saved ? JSON.parse(saved) : {};

      const rawUrl = cleanUrl(parsed.supabaseUrl);
      const supabaseUrl = (rawUrl && rawUrl.includes("supabase.co")) ? rawUrl : envUrl;
      const rawKey = (parsed.supabaseAnonKey || "").trim();
      const isKeyValid = Boolean(rawKey && (rawKey.startsWith("sb_") || rawKey.startsWith("eyJ")));
      const supabaseAnonKey = isKeyValid ? rawKey : envKey;
      const autoSync = parsed.autoSync !== undefined ? parsed.autoSync : true;

      return {
        supabaseUrl,
        supabaseAnonKey,
        autoSync,
        lastSyncedAt: parsed.lastSyncedAt,
      };
    } catch {
      return DEFAULT_CLOUD_CONFIG;
    }
  },

  saveConfig(config: Partial<CloudConfig>): CloudConfig {
    const current = this.getConfig();
    const updated = { 
      ...current, 
      ...config,
      supabaseUrl: config.supabaseUrl !== undefined ? cleanUrl(config.supabaseUrl) : current.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey !== undefined ? config.supabaseAnonKey.trim() : current.supabaseAnonKey,
    };
    localStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(updated));
    window.dispatchEvent(new Event("rh_cloud_config_updated"));
    // Trigger health check on save
    this.checkHealth();
    return updated;
  },

  isConfigured(): boolean {
    const config = this.getConfig();
    return Boolean(config.supabaseUrl && config.supabaseAnonKey);
  },

  async checkHealth(): Promise<{ isOnline: boolean; message: string }> {
    const config = this.getConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      lastConnectionState = { isOnline: false, lastChecked: Date.now(), errorMessage: "Credentials missing" };
      window.dispatchEvent(new CustomEvent("rh_cloud_health_updated", { detail: lastConnectionState }));
      return { isOnline: false, message: "Supabase credentials not configured." };
    }
    const res = await this.testConnection(config.supabaseUrl, config.supabaseAnonKey);
    lastConnectionState = {
      isOnline: res.success,
      lastChecked: Date.now(),
      errorMessage: res.success ? undefined : res.message,
    };
    window.dispatchEvent(new CustomEvent("rh_cloud_health_updated", { detail: lastConnectionState }));
    return { isOnline: res.success, message: res.message };
  },

  getLastConnectionState() {
    return lastConnectionState;
  },

  async testConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
    const testUrl = cleanUrl(url || this.getConfig().supabaseUrl);
    const testKey = (key || this.getConfig().supabaseAnonKey).trim();

    if (!testUrl || !testKey) {
      return { success: false, message: "Please provide both Supabase URL and Anon Key." };
    }

    try {
      const res = await fetch(`${testUrl}/rest/v1/portfolio_data?select=id&limit=1`, {
        method: "GET",
        headers: {
          apikey: testKey,
          Authorization: `Bearer ${testKey}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        return { success: true, message: "Connected successfully to Supabase Cloud Database! 🟢" };
      } else if (res.status === 404 || res.status === 400) {
        // Table might not exist yet
        return { 
          success: false, 
          message: `Connected to Supabase, but 'portfolio_data' table is missing. Run the SQL schema script provided below in Supabase SQL Editor.` 
        };
      } else {
        const text = await res.text();
        return { success: false, message: `Connection failed (Status ${res.status}): ${text}` };
      }
    } catch (err: any) {
      return { success: false, message: `Network error: ${err.message || "Failed to reach Supabase"}` };
    }
  },

  async fetchAllRemote(): Promise<any | null> {
    const config = this.getConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

    const baseUrl = config.supabaseUrl.replace(/\/$/, "");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try { controller.abort(); } catch {}
    }, 7000);

    try {
      const res = await fetch(`${baseUrl}/rest/v1/portfolio_data?select=id,data`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;

      const rows: Array<{ id: string; data: any }> = await res.json();
      const bundle: Record<string, any> = {};
      rows.forEach(r => {
        bundle[r.id] = r.data;
      });

      return bundle;
    } catch (err) {
      clearTimeout(timeoutId);
      return null;
    }
  },

  async pushAllLocal(data: Record<string, any>): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return { success: false, message: "Cloud Database credentials are not configured yet." };
    }

    const baseUrl = config.supabaseUrl.replace(/\/$/, "");
    const records = Object.entries(data).map(([key, val]) => ({
      id: key,
      data: val,
      updated_at: new Date().toISOString(),
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${baseUrl}/rest/v1/portfolio_data`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(records),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.saveConfig({ lastSyncedAt: new Date().toISOString() });
        return { success: true, message: "All portfolio data successfully pushed to Cloud Database! 🚀" };
      } else {
        const text = await res.text();
        return { success: false, message: `Push failed (Status ${res.status}): ${text}` };
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      return { success: false, message: `Error syncing to cloud: ${err.message}` };
    }
  },

  async syncKey(key: string, data: any): Promise<boolean> {
    const config = this.getConfig();
    if (!config.autoSync || !config.supabaseUrl || !config.supabaseAnonKey) return false;

    const baseUrl = config.supabaseUrl.replace(/\/$/, "");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${baseUrl}/rest/v1/portfolio_data`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify([
          { id: key, data, updated_at: new Date().toISOString() }
        ]),
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        lastConnectionState = {
          isOnline: false,
          lastChecked: Date.now(),
          errorMessage: `HTTP ${res.status}`,
        };
        window.dispatchEvent(new CustomEvent("rh_cloud_health_updated", { detail: lastConnectionState }));
        console.warn(`Cloud sync failed for ${key}: HTTP ${res.status}`);
        return false;
      }
      lastConnectionState = {
        isOnline: true,
        lastChecked: Date.now(),
      };
      window.dispatchEvent(new CustomEvent("rh_cloud_health_updated", { detail: lastConnectionState }));
      return true;
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastConnectionState = {
        isOnline: false,
        lastChecked: Date.now(),
        errorMessage: err.message || "Network error",
      };
      window.dispatchEvent(new CustomEvent("rh_cloud_health_updated", { detail: lastConnectionState }));
      console.warn(`Background sync failed for ${key}:`, err);
      return false;
    }
  }
};

export const SUPABASE_SQL_SETUP = `-- Copy and paste this into Supabase SQL Editor:

-- 1. Create table for portfolio collections
create table if not exists public.portfolio_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.portfolio_data enable row level security;

-- 3. Allow public visitors to read data
create policy "Allow Public Read" on public.portfolio_data
  for select using (true);

-- 4. Allow insert & update
create policy "Allow Public Write" on public.portfolio_data
  for all using (true);
`;
