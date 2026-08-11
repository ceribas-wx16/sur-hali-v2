const SUPABASE_URL = "https://lhltolrtgnfkbwfkpaex.supabase.co";

const SUPABASE_KEY = "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase bağlantısı hazır.");
console.log("supabaseClient:", typeof supabaseClient);
