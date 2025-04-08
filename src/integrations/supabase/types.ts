export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company_settings: {
        Row: {
          city: string
          country: string
          created_at: string
          email: string
          id: string
          name: string
          street: string
          user_id: string
          zip_code: string
        }
        Insert: {
          city?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          street?: string
          user_id: string
          zip_code?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          street?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client: Json
          company: Json
          created_at: string
          date: string
          deleted: boolean | null
          deleted_at: string | null
          due_date: string
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          status: string
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          user_id: string
        }
        Insert: {
          client: Json
          company: Json
          created_at?: string
          date: string
          deleted?: boolean | null
          deleted_at?: string | null
          due_date: string
          id?: string
          invoice_number: string
          items: Json
          notes?: string | null
          status: string
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount: number
          user_id: string
        }
        Update: {
          client?: Json
          company?: Json
          created_at?: string
          date?: string
          deleted?: boolean | null
          deleted_at?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          status?: string
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_eu: boolean | null
          logo: string | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string
          tax_id: string | null
          user_id: string | null
          vat_number: string | null
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_eu?: boolean | null
          logo?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code: string
          tax_id?: string | null
          user_id?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_eu?: boolean | null
          logo?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string
          tax_id?: string | null
          user_id?: string | null
          vat_number?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
