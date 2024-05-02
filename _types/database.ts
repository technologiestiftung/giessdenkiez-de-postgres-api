export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					username: string | null;
				};
				Insert: {
					id: string;
					username?: string | null;
				};
				Update: {
					id?: string;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_users_profiles";
						columns: ["id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			radolan_data: {
				Row: {
					geom_id: number | null;
					id: number;
					measured_at: string | null;
					value: number | null;
				};
				Insert: {
					geom_id?: number | null;
					id?: number;
					measured_at?: string | null;
					value?: number | null;
				};
				Update: {
					geom_id?: number | null;
					id?: number;
					measured_at?: string | null;
					value?: number | null;
				};
				Relationships: [];
			};
			radolan_geometry: {
				Row: {
					centroid: unknown | null;
					geometry: unknown | null;
					id: number;
				};
				Insert: {
					centroid?: unknown | null;
					geometry?: unknown | null;
					id?: number;
				};
				Update: {
					centroid?: unknown | null;
					geometry?: unknown | null;
					id?: number;
				};
				Relationships: [];
			};
			radolan_harvester: {
				Row: {
					collection_date: string | null;
					end_date: string | null;
					id: number;
					start_date: string | null;
				};
				Insert: {
					collection_date?: string | null;
					end_date?: string | null;
					id?: number;
					start_date?: string | null;
				};
				Update: {
					collection_date?: string | null;
					end_date?: string | null;
					id?: number;
					start_date?: string | null;
				};
				Relationships: [];
			};
			radolan_temp: {
				Row: {
					geometry: unknown | null;
					id: number;
					measured_at: string | null;
					value: number | null;
				};
				Insert: {
					geometry?: unknown | null;
					id?: number;
					measured_at?: string | null;
					value?: number | null;
				};
				Update: {
					geometry?: unknown | null;
					id?: number;
					measured_at?: string | null;
					value?: number | null;
				};
				Relationships: [];
			};
			trees: {
				Row: {
					adopted: string | null;
					art_bot: string | null;
					art_dtsch: string | null;
					baumhoehe: string | null;
					bezirk: string | null;
					caretaker: string | null;
					eigentuemer: string | null;
					gattung: string | null;
					gattung_deutsch: string | null;
					geom: unknown | null;
					gml_id: string | null;
					hausnr: string | null;
					id: string;
					kennzeich: string | null;
					kronedurch: string | null;
					lat: string | null;
					lng: string | null;
					pflanzjahr: number | null;
					radolan_days: number[] | null;
					radolan_sum: number | null;
					stammumfg: string | null;
					standalter: string | null;
					standortnr: string | null;
					strname: string | null;
					type: string | null;
					watered: string | null;
					zusatz: string | null;
				};
				Insert: {
					adopted?: string | null;
					art_bot?: string | null;
					art_dtsch?: string | null;
					baumhoehe?: string | null;
					bezirk?: string | null;
					caretaker?: string | null;
					eigentuemer?: string | null;
					gattung?: string | null;
					gattung_deutsch?: string | null;
					geom?: unknown | null;
					gml_id?: string | null;
					hausnr?: string | null;
					id: string;
					kennzeich?: string | null;
					kronedurch?: string | null;
					lat?: string | null;
					lng?: string | null;
					pflanzjahr?: number | null;
					radolan_days?: number[] | null;
					radolan_sum?: number | null;
					stammumfg?: string | null;
					standalter?: string | null;
					standortnr?: string | null;
					strname?: string | null;
					type?: string | null;
					watered?: string | null;
					zusatz?: string | null;
				};
				Update: {
					adopted?: string | null;
					art_bot?: string | null;
					art_dtsch?: string | null;
					baumhoehe?: string | null;
					bezirk?: string | null;
					caretaker?: string | null;
					eigentuemer?: string | null;
					gattung?: string | null;
					gattung_deutsch?: string | null;
					geom?: unknown | null;
					gml_id?: string | null;
					hausnr?: string | null;
					id?: string;
					kennzeich?: string | null;
					kronedurch?: string | null;
					lat?: string | null;
					lng?: string | null;
					pflanzjahr?: number | null;
					radolan_days?: number[] | null;
					radolan_sum?: number | null;
					stammumfg?: string | null;
					standalter?: string | null;
					standortnr?: string | null;
					strname?: string | null;
					type?: string | null;
					watered?: string | null;
					zusatz?: string | null;
				};
				Relationships: [];
			};
			trees_adopted: {
				Row: {
					id: number;
					tree_id: string;
					uuid: string | null;
				};
				Insert: {
					id?: number;
					tree_id: string;
					uuid?: string | null;
				};
				Update: {
					id?: number;
					tree_id?: string;
					uuid?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_trees_adopted_trees";
						columns: ["tree_id"];
						isOneToOne: false;
						referencedRelation: "trees";
						referencedColumns: ["id"];
					}
				];
			};
			trees_watered: {
				Row: {
					amount: number;
					id: number;
					timestamp: string;
					tree_id: string;
					username: string | null;
					uuid: string | null;
				};
				Insert: {
					amount: number;
					id?: number;
					timestamp: string;
					tree_id: string;
					username?: string | null;
					uuid?: string | null;
				};
				Update: {
					amount?: number;
					id?: number;
					timestamp?: string;
					tree_id?: string;
					username?: string | null;
					uuid?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_trees_watered_trees";
						columns: ["tree_id"];
						isOneToOne: false;
						referencedRelation: "trees";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			count_by_age: {
				Args: {
					start_year: number;
					end_year: number;
				};
				Returns: number;
			};
			get_watered_and_adopted: {
				Args: Record<PropertyKey, never>;
				Returns: {
					tree_id: string;
					adopted: number;
					watered: number;
				}[];
			};
			remove_account: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					owner_id: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					owner_id: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "objects_bucketId_fkey";
						columns: ["bucket_id"];
						isOneToOne: false;
						referencedRelation: "buckets";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database["public"]["Tables"] & Database["public"]["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
			Database["public"]["Views"])
	? (Database["public"]["Tables"] &
			Database["public"]["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof Database["public"]["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
	? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof Database["public"]["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
	? Database["public"]["Enums"][PublicEnumNameOrOptions]
	: never;
