export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          order_number: string
          rider_id: string | null
          customer_name: string | null
          customer_phone: string | null
          address: string | null
          cod_amount: number
          status: 'pending' | 'en_route' | 'arrived' | 'payment' | 'completed'
          payment_method: string | null
          payment_status: 'unpaid' | 'pending' | 'paid' | 'failed'
          payrex_payment_id: string | null
          qr_string: string | null
          qr_expires_at: string | null
          pod_photo_url: string | null
          pod_signed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          rider_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          address?: string | null
          cod_amount: number
          status?: 'pending' | 'en_route' | 'arrived' | 'payment' | 'completed'
          payment_method?: string | null
          payment_status?: 'unpaid' | 'pending' | 'paid' | 'failed'
          payrex_payment_id?: string | null
          qr_string?: string | null
          qr_expires_at?: string | null
          pod_photo_url?: string | null
          pod_signed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          rider_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          address?: string | null
          cod_amount?: number
          status?: 'pending' | 'en_route' | 'arrived' | 'payment' | 'completed'
          payment_method?: string | null
          payment_status?: 'unpaid' | 'pending' | 'paid' | 'failed'
          payrex_payment_id?: string | null
          qr_string?: string | null
          qr_expires_at?: string | null
          pod_photo_url?: string | null
          pod_signed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      riders: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          last_seen: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          phone?: string | null
          last_seen?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          last_seen?: string | null
          created_at?: string
        }
      }
      payment_events: {
        Row: {
          id: string
          provider: string | null
          provider_event_id: string | null
          order_id: string | null
          payload: Json | null
          status: string | null
          processed_at: string | null
        }
        Insert: {
          id?: string
          provider?: string | null
          provider_event_id?: string | null
          order_id?: string | null
          payload?: Json | null
          status?: string | null
          processed_at?: string | null
        }
        Update: {
          id?: string
          provider?: string | null
          provider_event_id?: string | null
          order_id?: string | null
          payload?: Json | null
          status?: string | null
          processed_at?: string | null
        }
      }
    }
  }
}
