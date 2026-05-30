export type TransactionStatus = "pago" | "pendente";

export type TransactionType = "receita" | "despesa";

export type Transaction = {
  id?: string;
  user_id?: string;
  import_id?: string;
  date: string;
  category: string;
  client: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  created_at?: string;
  visible_fields?: {
  date: boolean;
  category: boolean;
  client: boolean;
  description: boolean;
  status: boolean;
};
};