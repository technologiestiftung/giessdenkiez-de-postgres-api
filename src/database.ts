export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
        Relationships: []
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
        Relationships: []
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
          centroid: unknown
          geometry: unknown
          id: number
        }
        Insert: {
          centroid?: unknown
          geometry?: unknown
          id?: number
        }
        Update: {
          centroid?: unknown
          geometry?: unknown
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
          geometry: unknown
          id: number
          measured_at: string | null
          value: number | null
        }
        Insert: {
          geometry?: unknown
          id?: number
          measured_at?: string | null
          value?: number | null
        }
        Update: {
          geometry?: unknown
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
          geom: unknown
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
          geom?: unknown
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
          geom?: unknown
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
      most_frequent_tree_species: {
        Row: {
          gattung_deutsch: string | null
          percentage: number | null
        }
        Relationships: []
      }
      total_tree_species_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
      trees_count: {
        Row: {
          count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accumulated_weather_per_month: {
        Args: { limit_monts: number }
        Returns: {
          avg_cloud_cover_percentage: number
          avg_dew_point_celcius: number
          avg_pressure_msl: number
          avg_relative_humidity_percentage: number
          avg_temperature_celsius: number
          avg_visibility_m: number
          avg_wind_direction_deg: number
          avg_wind_gust_direction_deg: number
          avg_wind_gust_speed_kmh: number
          avg_wind_speed_kmh: number
          measure_day: string
          sum_precipitation_mm_per_sqm: number
          sum_sunshine_minutes: number
        }[]
      }
      calculate_adoptions: {
        Args: never
        Returns: {
          total_adoptions: number
          very_thirsty_adoptions: number
        }[]
      }
      calculate_avg_waterings_per_month: {
        Args: never
        Returns: {
          avg_amount_per_watering: number
          month: string
          total_sum: number
          watering_count: number
        }[]
      }
      calculate_top_tree_species: {
        Args: never
        Returns: {
          gattung_deutsch: string
          percentage: number
        }[]
      }
      count_by_age: {
        Args: { end_year: number; start_year: number }
        Returns: number
      }
      get_monthly_weather: {
        Args: never
        Returns: {
          avg_temperature_celsius: number
          max_temperature_celsius: number
          month: string
          total_rainfall_liters: number
        }[]
      }
      get_user_data_for_id: {
        Args: { u_id: string }
        Returns: {
          email: string
          id: string
        }[]
      }
      get_watered_and_adopted: {
        Args: never
        Returns: {
          adopted: number
          tree_id: string
          watered: number
        }[]
      }
      get_waterings_with_location: {
        Args: never
        Returns: {
          amount: number
          id: string
          lat: number
          lng: number
          timestamp: string
        }[]
      }
      is_username_taken: { Args: { given_username: string }; Returns: boolean }
      remove_account: { Args: never; Returns: undefined }
      watered_today: {
        Args: never
        Returns: {
          total_amount: number
          tree_id: string
        }[]
      }
      waterings_for_tree: {
        Args: { t_id: string }
        Returns: {
          amount: number
          id: number
          timestamp: string
          tree_id: string
          username: string
        }[]
      }
      waterings_for_user: {
        Args: { u_id: string }
        Returns: {
          amount: number
          id: number
          timestamp: string
          tree_id: string
          username: string
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const

