export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "vendor" | "courier" | "admin";
export type OrderStatus = "pending" | "accepted" | "delivering" | "completed" | "cancelled";
export type PaymentMethodType = "airtel_money" | "moov_money" | "cash_on_delivery" | "card";
export type PaymentStatusType = "unpaid" | "paid" | "refunded";
export type VehicleTypeEnum = "moto" | "voiture" | "velo" | "a_pied";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          slug: string;
          bio: string | null;
          category: string;
          logo_url: string | null;
          banner_url: string | null;
          province: string;
          city: string;
          district: string;
          address_landmark: string;
          is_verified: boolean;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          slug: string;
          bio?: string | null;
          category: string;
          logo_url?: string | null;
          banner_url?: string | null;
          province?: string;
          city?: string;
          district: string;
          address_landmark: string;
          is_verified?: boolean;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          slug?: string;
          bio?: string | null;
          category?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          province?: string;
          city?: string;
          district?: string;
          address_landmark?: string;
          is_verified?: boolean;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string | null;
          price_xaf: number;
          stock: number;
          category: string;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description?: string | null;
          price_xaf: number;
          stock?: number;
          category: string;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string | null;
          price_xaf?: number;
          stock?: number;
          category?: string;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          store_id: string;
          courier_id: string | null;
          status: OrderStatus;
          total_amount_xaf: number;
          delivery_fee_xaf: number;
          payment_method: PaymentMethodType;
          payment_status: PaymentStatusType;
          delivery_address_landmark: string;
          delivery_district: string;
          delivery_city: string;
          delivery_phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          store_id: string;
          courier_id?: string | null;
          status?: OrderStatus;
          total_amount_xaf: number;
          delivery_fee_xaf?: number;
          payment_method?: PaymentMethodType;
          payment_status?: PaymentStatusType;
          delivery_address_landmark: string;
          delivery_district: string;
          delivery_city?: string;
          delivery_phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          store_id?: string;
          courier_id?: string | null;
          status?: OrderStatus;
          total_amount_xaf?: number;
          delivery_fee_xaf?: number;
          payment_method?: PaymentMethodType;
          payment_status?: PaymentStatusType;
          delivery_address_landmark?: string;
          delivery_district?: string;
          delivery_city?: string;
          delivery_phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_xaf: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_xaf: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price_xaf?: number;
          created_at?: string;
        };
      };
      courier_profiles: {
        Row: {
          id: string;
          is_active_duty: boolean;
          vehicle_type: VehicleTypeEnum;
          id_document_url: string | null;
          verified_by_admin: boolean;
          base_delivery_rate_xaf: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          is_active_duty?: boolean;
          vehicle_type?: VehicleTypeEnum;
          id_document_url?: string | null;
          verified_by_admin?: boolean;
          base_delivery_rate_xaf?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          is_active_duty?: boolean;
          vehicle_type?: VehicleTypeEnum;
          id_document_url?: string | null;
          verified_by_admin?: boolean;
          base_delivery_rate_xaf?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      custom_districts: {
        Row: {
          id: string;
          province: string;
          city: string;
          district_name: string;
          is_approved: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          province?: string;
          city?: string;
          district_name: string;
          is_approved?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          province?: string;
          city?: string;
          district_name?: string;
          is_approved?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_method_type: PaymentMethodType;
      payment_status_type: PaymentStatusType;
      vehicle_type_enum: VehicleTypeEnum;
    };
  };
}
