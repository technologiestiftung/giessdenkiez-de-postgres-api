export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      }
      radolan_data: {
        Row: {
          measured_at: string | null
          value: number | null
          geom_id: number | null
          id: number
        }
        Insert: {
          measured_at?: string | null
          value?: number | null
          geom_id?: number | null
          id?: number
        }
        Update: {
          measured_at?: string | null
          value?: number | null
          geom_id?: number | null
          id?: number
        }
      }
      radolan_geometry: {
        Row: {
          geometry: unknown | null
          centroid: unknown | null
          id: number
        }
        Insert: {
          geometry?: unknown | null
          centroid?: unknown | null
          id?: number
        }
        Update: {
          geometry?: unknown | null
          centroid?: unknown | null
          id?: number
        }
      }
      radolan_harvester: {
        Row: {
          collection_date: string | null
          start_date: string | null
          end_date: string | null
          id: number
        }
        Insert: {
          collection_date?: string | null
          start_date?: string | null
          end_date?: string | null
          id?: number
        }
        Update: {
          collection_date?: string | null
          start_date?: string | null
          end_date?: string | null
          id?: number
        }
      }
      radolan_temp: {
        Row: {
          geometry: unknown | null
          value: number | null
          measured_at: string | null
          id: number
        }
        Insert: {
          geometry?: unknown | null
          value?: number | null
          measured_at?: string | null
          id?: number
        }
        Update: {
          geometry?: unknown | null
          value?: number | null
          measured_at?: string | null
          id?: number
        }
      }
      trees: {
        Row: {
          id: string
          lat: string | null
          lng: string | null
          artdtsch: string | null
          artbot: string | null
          gattungdeutsch: string | null
          gattung: string | null
          strname: string | null
          hausnr: string | null
          zusatz: string | null
          pflanzjahr: string | null
          standalter: string | null
          kronedurch: string | null
          stammumfg: string | null
          type: string | null
          baumhoehe: string | null
          bezirk: string | null
          eigentuemer: string | null
          adopted: string | null
          watered: string | null
          radolan_sum: number | null
          radolan_days: number[] | null
          geom: unknown | null
          standortnr: string | null
          kennzeich: string | null
          caretaker: string | null
          gmlid: string | null
        }
        Insert: {
          id: string
          lat?: string | null
          lng?: string | null
          artdtsch?: string | null
          artbot?: string | null
          gattungdeutsch?: string | null
          gattung?: string | null
          strname?: string | null
          hausnr?: string | null
          zusatz?: string | null
          pflanzjahr?: string | null
          standalter?: string | null
          kronedurch?: string | null
          stammumfg?: string | null
          type?: string | null
          baumhoehe?: string | null
          bezirk?: string | null
          eigentuemer?: string | null
          adopted?: string | null
          watered?: string | null
          radolan_sum?: number | null
          radolan_days?: number[] | null
          geom?: unknown | null
          standortnr?: string | null
          kennzeich?: string | null
          caretaker?: string | null
          gmlid?: string | null
        }
        Update: {
          id?: string
          lat?: string | null
          lng?: string | null
          artdtsch?: string | null
          artbot?: string | null
          gattungdeutsch?: string | null
          gattung?: string | null
          strname?: string | null
          hausnr?: string | null
          zusatz?: string | null
          pflanzjahr?: string | null
          standalter?: string | null
          kronedurch?: string | null
          stammumfg?: string | null
          type?: string | null
          baumhoehe?: string | null
          bezirk?: string | null
          eigentuemer?: string | null
          adopted?: string | null
          watered?: string | null
          radolan_sum?: number | null
          radolan_days?: number[] | null
          geom?: unknown | null
          standortnr?: string | null
          kennzeich?: string | null
          caretaker?: string | null
          gmlid?: string | null
        }
      }
      trees_adopted: {
        Row: {
          uuid: string | null
          tree_id: string
          id: number
        }
        Insert: {
          uuid?: string | null
          tree_id: string
          id?: number
        }
        Update: {
          uuid?: string | null
          tree_id?: string
          id?: number
        }
      }
      trees_watered: {
        Row: {
          time: string
          uuid: string | null
          amount: number | null
          timestamp: string | null
          username: string | null
          tree_id: string
          id: number
        }
        Insert: {
          time: string
          uuid?: string | null
          amount?: number | null
          timestamp?: string | null
          username?: string | null
          tree_id: string
          id?: number
        }
        Update: {
          time?: string
          uuid?: string | null
          amount?: number | null
          timestamp?: string | null
          username?: string | null
          tree_id?: string
          id?: number
        }
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
  }
}

