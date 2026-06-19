export type ViewState = "dashboard" | "daily-check-in" | "global-forge" | "analytics" | "settings";
export type SettingsTab = "account" | "preferences" | "billing" | "notifications";

export type EngineType = "volume" | "routine" | "pipeline" | "siege" | "";

export type RoutineFrequency =
  | { type: 'flexible'; count: number; period: 'week' | 'month' }
  | { type: 'fixed'; days: string[] }; // ['Saturday', 'Sunday', 'last-month']

export interface Goal {
    id: string;
    title: string;
    type: EngineType;
    deadline: string;
    startDate?: string;
    priority: string;
    volumeTarget?: string;
    volumeUnit?: string;
    routineFreq?: RoutineFrequency | null;
    pipelineTasks?: { id: number, text: string }[];
    siegeNotes?: string;
    progress?: number;
}

export interface ForgeTarget {
    id: string;
    creator_id: string;
    creator_name?: string;
    creator_avatar?: string;
    title: string;
    description: string;
    notes?: string;
    engine_type: EngineType;
    type?: EngineType; // Fallback
    is_official: boolean;
    target_value?: number;
    target_unit?: string;
    volume_target?: string;
    volume_unit?: string;
    routine_freq?: RoutineFrequency;
    frequency?: RoutineFrequency;
    tasks?: { id: number, text: string }[];
    pipeline_tasks?: { id: number, text: string }[];
    deadline_days: number;
    tags: string[];
    created_at: string;
    joined_count: number;
    cloned_count?: number;
}

export interface ForgeMember {
    user_id: string;
    username: string;
    avatar_url?: string;
    is_online?: boolean;
    joined_at: string;
}
