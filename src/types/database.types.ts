export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string | null;
          category_id: string | null;
          name: string;
          description: string | null;
          frequency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          category_id?: string | null;
          name: string;
          description?: string | null;
          frequency: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          frequency?: string;
          created_at?: string;
        };
      };
      habit_records: {
        Row: {
          id: string;
          habit_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          date: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          date?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
    };
  };
} 