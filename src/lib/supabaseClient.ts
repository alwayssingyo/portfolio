import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl = "https://ybbwzcbpfnwlbmcbnhlb.supabase.co";
const publishableAPIKey = import.meta.env.VITE_PUBLISHABLE_API_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, publishableAPIKey);
