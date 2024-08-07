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
      contact_requests: {
        Row: {
          contact_id: string
          contact_mail_id: string | null
          contact_message: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          contact_mail_id?: string | null
          contact_message?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          contact_mail_id?: string | null
          contact_message?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_weather_data: {
        Row: {
          avg_cloud_cover_percentage: number | null
          avg_dew_point_celcius: number | null
          avg_pressure_msl: number | null
          avg_relative_humidity_percentage: number | null
          avg_temperature_celsius: number | null
          avg_visibility_m: number | null
          avg_wind_direction_deg: number | null
          avg_wind_gust_direction_deg: number | null
          avg_wind_gust_speed_kmh: number | null
          avg_wind_speed_kmh: number | null
          created_at: string
          day_finished: boolean
          id: number
          measure_day: string
          source_dwd_station_ids: string[] | null
          sum_precipitation_mm_per_sqm: number | null
          sum_sunshine_minutes: number | null
        }
        Insert: {
          avg_cloud_cover_percentage?: number | null
          avg_dew_point_celcius?: number | null
          avg_pressure_msl?: number | null
          avg_relative_humidity_percentage?: number | null
          avg_temperature_celsius?: number | null
          avg_visibility_m?: number | null
          avg_wind_direction_deg?: number | null
          avg_wind_gust_direction_deg?: number | null
          avg_wind_gust_speed_kmh?: number | null
          avg_wind_speed_kmh?: number | null
          created_at?: string
          day_finished?: boolean
          id?: number
          measure_day: string
          source_dwd_station_ids?: string[] | null
          sum_precipitation_mm_per_sqm?: number | null
          sum_sunshine_minutes?: number | null
        }
        Update: {
          avg_cloud_cover_percentage?: number | null
          avg_dew_point_celcius?: number | null
          avg_pressure_msl?: number | null
          avg_relative_humidity_percentage?: number | null
          avg_temperature_celsius?: number | null
          avg_visibility_m?: number | null
          avg_wind_direction_deg?: number | null
          avg_wind_gust_direction_deg?: number | null
          avg_wind_gust_speed_kmh?: number | null
          avg_wind_speed_kmh?: number | null
          created_at?: string
          day_finished?: boolean
          id?: number
          measure_day?: string
          source_dwd_station_ids?: string[] | null
          sum_precipitation_mm_per_sqm?: number | null
          sum_sunshine_minutes?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string | null
        }
        Insert: {
          id: string
          username?: string | null
        }
        Update: {
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_profiles"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      radolan_data: {
        Row: {
          geom_id: number | null
          id: number
          measured_at: string | null
          value: number | null
        }
        Insert: {
          geom_id?: number | null
          id?: number
          measured_at?: string | null
          value?: number | null
        }
        Update: {
          geom_id?: number | null
          id?: number
          measured_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      radolan_geometry: {
        Row: {
          centroid: unknown | null
          geometry: unknown | null
          id: number
        }
        Insert: {
          centroid?: unknown | null
          geometry?: unknown | null
          id?: number
        }
        Update: {
          centroid?: unknown | null
          geometry?: unknown | null
          id?: number
        }
        Relationships: []
      }
      radolan_harvester: {
        Row: {
          collection_date: string | null
          end_date: string | null
          id: number
          start_date: string | null
        }
        Insert: {
          collection_date?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
        }
        Update: {
          collection_date?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
        }
        Relationships: []
      }
      radolan_temp: {
        Row: {
          geometry: unknown | null
          id: number
          measured_at: string | null
          value: number | null
        }
        Insert: {
          geometry?: unknown | null
          id?: number
          measured_at?: string | null
          value?: number | null
        }
        Update: {
          geometry?: unknown | null
          id?: number
          measured_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      trees: {
        Row: {
          adopted: string | null
          art_bot: string | null
          art_dtsch: string | null
          baumhoehe: string | null
          bezirk: string | null
          caretaker: string | null
          eigentuemer: string | null
          gattung: string | null
          gattung_deutsch: string | null
          geom: unknown | null
          hausnr: string | null
          id: string
          kennzeich: string | null
          kronedurch: string | null
          lat: string | null
          lng: string | null
          pflanzjahr: number | null
          radolan_days: number[] | null
          radolan_sum: number | null
          stammumfg: string | null
          standalter: string | null
          standortnr: string | null
          strname: string | null
          type: string | null
          watered: string | null
          zusatz: string | null
        }
        Insert: {
          adopted?: string | null
          art_bot?: string | null
          art_dtsch?: string | null
          baumhoehe?: string | null
          bezirk?: string | null
          caretaker?: string | null
          eigentuemer?: string | null
          gattung?: string | null
          gattung_deutsch?: string | null
          geom?: unknown | null
          hausnr?: string | null
          id: string
          kennzeich?: string | null
          kronedurch?: string | null
          lat?: string | null
          lng?: string | null
          pflanzjahr?: number | null
          radolan_days?: number[] | null
          radolan_sum?: number | null
          stammumfg?: string | null
          standalter?: string | null
          standortnr?: string | null
          strname?: string | null
          type?: string | null
          watered?: string | null
          zusatz?: string | null
        }
        Update: {
          adopted?: string | null
          art_bot?: string | null
          art_dtsch?: string | null
          baumhoehe?: string | null
          bezirk?: string | null
          caretaker?: string | null
          eigentuemer?: string | null
          gattung?: string | null
          gattung_deutsch?: string | null
          geom?: unknown | null
          hausnr?: string | null
          id?: string
          kennzeich?: string | null
          kronedurch?: string | null
          lat?: string | null
          lng?: string | null
          pflanzjahr?: number | null
          radolan_days?: number[] | null
          radolan_sum?: number | null
          stammumfg?: string | null
          standalter?: string | null
          standortnr?: string | null
          strname?: string | null
          type?: string | null
          watered?: string | null
          zusatz?: string | null
        }
        Relationships: []
      }
      trees_adopted: {
        Row: {
          id: number
          tree_id: string
          uuid: string | null
        }
        Insert: {
          id?: number
          tree_id: string
          uuid?: string | null
        }
        Update: {
          id?: number
          tree_id?: string
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trees_adopted_trees"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "trees"
            referencedColumns: ["id"]
          },
        ]
      }
      trees_watered: {
        Row: {
          amount: number
          id: number
          included_in_map_layer: boolean | null
          timestamp: string
          tree_id: string
          username: string | null
          uuid: string | null
        }
        Insert: {
          amount: number
          id?: number
          included_in_map_layer?: boolean | null
          timestamp: string
          tree_id: string
          username?: string | null
          uuid?: string | null
        }
        Update: {
          amount?: number
          id?: number
          included_in_map_layer?: boolean | null
          timestamp?: string
          tree_id?: string
          username?: string | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trees_watered_trees"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "trees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accumulated_weather_per_month: {
        Args: {
          limit_monts: number
        }
        Returns: {
          measure_day: string
          sum_precipitation_mm_per_sqm: number
          avg_temperature_celsius: number
          avg_pressure_msl: number
          sum_sunshine_minutes: number
          avg_wind_direction_deg: number
          avg_wind_speed_kmh: number
          avg_cloud_cover_percentage: number
          avg_dew_point_celcius: number
          avg_relative_humidity_percentage: number
          avg_visibility_m: number
          avg_wind_gust_direction_deg: number
          avg_wind_gust_speed_kmh: number
        }[]
      }
      calculate_avg_waterings_per_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          watering_count: number
          avg_amount_per_watering: number
        }[]
      }
      calculate_top_tree_species: {
        Args: Record<PropertyKey, never>
        Returns: {
          gattung_deutsch: string
          percentage: number
        }[]
      }
      count_by_age: {
        Args: {
          start_year: number
          end_year: number
        }
        Returns: number
      }
      get_user_data_for_id: {
        Args: {
          u_id: string
        }
        Returns: {
          id: string
          email: string
        }[]
      }
      get_watered_and_adopted: {
        Args: Record<PropertyKey, never>
        Returns: {
          tree_id: string
          adopted: number
          watered: number
        }[]
      }
      remove_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      watered_today: {
        Args: Record<PropertyKey, never>
        Returns: {
          tree_id: string
          total_amount: number
        }[]
      }
      waterings_for_tree: {
        Args: {
          t_id: string
        }
        Returns: {
          amount: number
          timestamp: string
          username: string
          id: number
          tree_id: string
        }[]
      }
      waterings_for_user: {
        Args: {
          u_id: string
        }
        Returns: {
          amount: number
          timestamp: string
          username: string
          id: number
          tree_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

