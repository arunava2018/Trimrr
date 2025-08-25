import supabase from "./supabase";

// This function fetches clicks for given url IDs
export async function getClicks(urlIds) {
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", urlIds);
    if (error) throw new Error(error.message);
    return data;
}
