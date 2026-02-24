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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      disputes: {
        Row: {
          created_at: string
          evidence_urls: string[] | null
          id: string
          opened_by: string
          reason: string
          rental_id: string
          resolution: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          opened_by: string
          reason: string
          rental_id: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          opened_by?: string
          reason?: string
          rental_id?: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          category: string
          conditions: string | null
          created_at: string
          deposit: number
          description: string
          id: string
          images: string[] | null
          location: string | null
          min_days: number
          owner_id: string
          price_per_day: number
          rating: number | null
          reviews_count: number | null
          status: Database["public"]["Enums"]["item_status"]
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          category: string
          conditions?: string | null
          created_at?: string
          deposit: number
          description?: string
          id?: string
          images?: string[] | null
          location?: string | null
          min_days?: number
          owner_id: string
          price_per_day: number
          rating?: number | null
          reviews_count?: number | null
          status?: Database["public"]["Enums"]["item_status"]
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          category?: string
          conditions?: string | null
          created_at?: string
          deposit?: number
          description?: string
          id?: string
          images?: string[] | null
          location?: string | null
          min_days?: number
          owner_id?: string
          price_per_day?: number
          rating?: number | null
          reviews_count?: number | null
          status?: Database["public"]["Enums"]["item_status"]
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          rental_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          rental_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          rental_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          rating: number | null
          rentals_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          rentals_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          rentals_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rental_photos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          photo_url: string
          rental_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          photo_url: string
          rental_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          photo_url?: string
          rental_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_photos_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          created_at: string
          deposit_amount: number
          end_date: string
          id: string
          item_id: string
          owner_id: string
          platform_fee: number
          renter_id: string
          start_date: string
          status: Database["public"]["Enums"]["rental_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deposit_amount: number
          end_date: string
          id?: string
          item_id: string
          owner_id: string
          platform_fee?: number
          renter_id: string
          start_date: string
          status?: Database["public"]["Enums"]["rental_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number
          end_date?: string
          id?: string
          item_id?: string
          owner_id?: string
          platform_fee?: number
          renter_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["rental_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          rental_id: string
          reviewer_id: string
          target_user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          rental_id: string
          reviewer_id: string
          target_user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          rental_id?: string
          reviewer_id?: string
          target_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dispute_status: "open" | "resolved_owner" | "resolved_renter" | "closed"
      item_status: "draft" | "active" | "paused" | "archived"
      photo_type: "before" | "after"
      rental_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
        | "disputed"
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
    Enums: {
      dispute_status: ["open", "resolved_owner", "resolved_renter", "closed"],
      item_status: ["draft", "active", "paused", "archived"],
      photo_type: ["before", "after"],
      rental_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "disputed",
      ],
    },
  },
} as const
