export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      daily_checkins: {
        Row: {
          completed_at: string | null
          daily_note: string | null
          date: string
          id: string
          mood: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          daily_note?: string | null
          date: string
          id?: string
          mood?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          daily_note?: string | null
          date?: string
          id?: string
          mood?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      forge_members: {
        Row: {
          id: string
          joined_at: string | null
          target_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          target_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          target_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forge_members_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "public_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_logs: {
        Row: {
          created_at: string | null
          date: string
          execution_notes: string | null
          goal_id: string | null
          id: string
          note: string | null
          notes: string | null
          progress_added: number | null
          updated_at: string | null
          user_id: string | null
          value_added: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          execution_notes?: string | null
          goal_id?: string | null
          id?: string
          note?: string | null
          notes?: string | null
          progress_added?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_added?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          execution_notes?: string | null
          goal_id?: string | null
          id?: string
          note?: string | null
          notes?: string | null
          progress_added?: number | null
          updated_at?: string | null
          user_id?: string | null
          value_added?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_logs_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          end_date: string
          id: string
          start_date: string
          status: string | null
          target_value: number
          title: string
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          end_date: string
          id?: string
          start_date: string
          status?: string | null
          target_value: number
          title: string
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string | null
          target_value?: number
          title?: string
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          date: string
          habit_id: string | null
          id: string
          note: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          date: string
          habit_id?: string | null
          id?: string
          note?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          date?: string
          habit_id?: string | null
          id?: string
          note?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          frequency_days: number[] | null
          frequency_type: string
          icon: string | null
          id: string
          is_active: boolean | null
          rest_days: number[] | null
          title: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          frequency_days?: number[] | null
          frequency_type: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          rest_days?: number[] | null
          title: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          frequency_days?: number[] | null
          frequency_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          rest_days?: number[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_feedback: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          status: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          status?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          status?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      platform_reviews: {
        Row: {
          created_at: string
          id: string
          rating: number
          review_text: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review_text: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review_text?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          full_name: string | null
          github_url: string | null
          id: string
          timezone: string | null
          twitter_url: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          timezone?: string | null
          twitter_url?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          timezone?: string | null
          twitter_url?: string | null
          username?: string
        }
        Relationships: []
      }
      public_blueprints: {
        Row: {
          cloned_count: number | null
          created_at: string | null
          creator_id: string | null
          creator_name: string | null
          description: string | null
          engine_type: string
          id: string
          pipeline_tasks: Json | null
          routine_freq: number | null
          title: string
          volume_target: string | null
          volume_unit: string | null
        }
        Insert: {
          cloned_count?: number | null
          created_at?: string | null
          creator_id?: string | null
          creator_name?: string | null
          description?: string | null
          engine_type: string
          id?: string
          pipeline_tasks?: Json | null
          routine_freq?: number | null
          title: string
          volume_target?: string | null
          volume_unit?: string | null
        }
        Update: {
          cloned_count?: number | null
          created_at?: string | null
          creator_id?: string | null
          creator_name?: string | null
          description?: string | null
          engine_type?: string
          id?: string
          pipeline_tasks?: Json | null
          routine_freq?: number | null
          title?: string
          volume_target?: string | null
          volume_unit?: string | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          cloned_from: string | null
          created_at: string
          deadline: string | null
          id: string
          is_public: boolean | null
          pipeline_tasks: Json | null
          priority: string | null
          progress: number | null
          radar_notes: string | null
          routine_freq: number | null
          status: string | null
          title: string
          user_id: string
          volume_target: string | null
          volume_unit: string | null
        }
        Insert: {
          cloned_from?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          is_public?: boolean | null
          pipeline_tasks?: Json | null
          priority?: string | null
          progress?: number | null
          radar_notes?: string | null
          routine_freq?: number | null
          status?: string | null
          title: string
          user_id: string
          volume_target?: string | null
          volume_unit?: string | null
        }
        Update: {
          cloned_from?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          is_public?: boolean | null
          pipeline_tasks?: Json | null
          priority?: string | null
          progress?: number | null
          radar_notes?: string | null
          routine_freq?: number | null
          status?: string | null
          title?: string
          user_id?: string
          volume_target?: string | null
          volume_unit?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
