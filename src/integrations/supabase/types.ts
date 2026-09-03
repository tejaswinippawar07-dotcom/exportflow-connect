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
      ai_classifications: {
        Row: {
          buyer_id: string
          classification: Database["public"]["Enums"]["lead_classification"]
          created_at: string
          id: string
          model: string | null
          owner_id: string
          priority: Database["public"]["Enums"]["lead_priority"]
          reason: string
        }
        Insert: {
          buyer_id: string
          classification: Database["public"]["Enums"]["lead_classification"]
          created_at?: string
          id?: string
          model?: string | null
          owner_id: string
          priority: Database["public"]["Enums"]["lead_priority"]
          reason: string
        }
        Update: {
          buyer_id?: string
          classification?: Database["public"]["Enums"]["lead_classification"]
          created_at?: string
          id?: string
          model?: string | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["lead_priority"]
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_classifications_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          campaign_id: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          owner_id: string
          storage_path: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          owner_id: string
          storage_path?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          owner_id?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      buyers: {
        Row: {
          business_type: string | null
          buyer_name: string | null
          classification:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name: string | null
          contact_status: Database["public"]["Enums"]["contact_status"]
          country: string | null
          created_at: string
          email: string | null
          id: string
          is_demo: boolean
          last_contacted_at: string | null
          normalized_email: string | null
          owner_id: string
          priority: Database["public"]["Enums"]["lead_priority"] | null
          product: string | null
          product_category: string | null
          profile_url: string | null
          source_platform: string | null
          updated_at: string
          validation_notes: string | null
          validation_status: Database["public"]["Enums"]["validation_status"]
          website: string | null
        }
        Insert: {
          business_type?: string | null
          buyer_name?: string | null
          classification?:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name?: string | null
          contact_status?: Database["public"]["Enums"]["contact_status"]
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_demo?: boolean
          last_contacted_at?: string | null
          normalized_email?: string | null
          owner_id: string
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          product?: string | null
          product_category?: string | null
          profile_url?: string | null
          source_platform?: string | null
          updated_at?: string
          validation_notes?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status"]
          website?: string | null
        }
        Update: {
          business_type?: string | null
          buyer_name?: string | null
          classification?:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name?: string | null
          contact_status?: Database["public"]["Enums"]["contact_status"]
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_demo?: boolean
          last_contacted_at?: string | null
          normalized_email?: string | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          product?: string | null
          product_category?: string | null
          profile_url?: string | null
          source_platform?: string | null
          updated_at?: string
          validation_notes?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status"]
          website?: string | null
        }
        Relationships: []
      }
      campaign_targets: {
        Row: {
          buyer_id: string
          campaign_id: string
          created_at: string
          id: string
          owner_id: string
        }
        Insert: {
          buyer_id: string
          campaign_id: string
          created_at?: string
          id?: string
          owner_id: string
        }
        Update: {
          buyer_id?: string
          campaign_id?: string
          created_at?: string
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_targets_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_targets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          body: string
          completed_at: string | null
          created_at: string
          delay_seconds: number
          id: string
          is_demo: boolean
          name: string
          owner_id: string
          product_category: string | null
          product_id: string | null
          product_name: string
          sending_limit: number
          started_at: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subject: string
          target_audience: string[]
          target_countries: string[]
          updated_at: string
        }
        Insert: {
          body: string
          completed_at?: string | null
          created_at?: string
          delay_seconds?: number
          id?: string
          is_demo?: boolean
          name: string
          owner_id: string
          product_category?: string | null
          product_id?: string | null
          product_name: string
          sending_limit?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject: string
          target_audience?: string[]
          target_countries?: string[]
          updated_at?: string
        }
        Update: {
          body?: string
          completed_at?: string | null
          created_at?: string
          delay_seconds?: number
          id?: string
          is_demo?: boolean
          name?: string
          owner_id?: string
          product_category?: string | null
          product_id?: string | null
          product_name?: string
          sending_limit?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string
          target_audience?: string[]
          target_countries?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          attachment_used: boolean
          buyer_id: string | null
          buyer_name: string | null
          campaign_id: string | null
          classification:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          error_message: string | null
          id: string
          owner_id: string
          product: string | null
          sent_at: string | null
          source_platform: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject: string | null
        }
        Insert: {
          attachment_used?: boolean
          buyer_id?: string | null
          buyer_name?: string | null
          campaign_id?: string | null
          classification?:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          id?: string
          owner_id: string
          product?: string | null
          sent_at?: string | null
          source_platform?: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject?: string | null
        }
        Update: {
          attachment_used?: boolean
          buyer_id?: string | null
          buyer_name?: string | null
          campaign_id?: string | null
          classification?:
            | Database["public"]["Enums"]["lead_classification"]
            | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          id?: string
          owner_id?: string
          product?: string | null
          sent_at?: string | null
          source_platform?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          customization_options: string | null
          export_availability: string | null
          id: string
          is_demo: boolean
          minimum_order_quantity: string | null
          name: string
          owner_id: string
          shipping_availability: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          customization_options?: string | null
          export_availability?: string | null
          id?: string
          is_demo?: boolean
          minimum_order_quantity?: string | null
          name: string
          owner_id: string
          shipping_availability?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          customization_options?: string | null
          export_availability?: string | null
          id?: string
          is_demo?: boolean
          minimum_order_quantity?: string | null
          name?: string
          owner_id?: string
          shipping_availability?: string | null
          updated_at?: string
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
      campaign_status:
        | "draft"
        | "ready"
        | "running"
        | "completed"
        | "paused"
        | "failed"
      contact_status:
        | "not_contacted"
        | "queued"
        | "sending"
        | "sent"
        | "failed"
        | "skipped"
      email_status:
        | "queued"
        | "sending"
        | "sent"
        | "failed"
        | "skipped"
        | "already_contacted"
      lead_classification:
        | "business_buyer"
        | "individual_buyer"
        | "importer"
        | "distributor"
        | "wholesaler"
        | "retailer"
      lead_priority: "high" | "low"
      validation_status:
        | "valid"
        | "invalid"
        | "incomplete"
        | "duplicate"
        | "already_contacted"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      campaign_status: [
        "draft",
        "ready",
        "running",
        "completed",
        "paused",
        "failed",
      ],
      contact_status: [
        "not_contacted",
        "queued",
        "sending",
        "sent",
        "failed",
        "skipped",
      ],
      email_status: [
        "queued",
        "sending",
        "sent",
        "failed",
        "skipped",
        "already_contacted",
      ],
      lead_classification: [
        "business_buyer",
        "individual_buyer",
        "importer",
        "distributor",
        "wholesaler",
        "retailer",
      ],
      lead_priority: ["high", "low"],
      validation_status: [
        "valid",
        "invalid",
        "incomplete",
        "duplicate",
        "already_contacted",
      ],
    },
  },
} as const
