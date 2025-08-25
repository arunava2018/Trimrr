import supabase from "./supabase";

// This function fetches all URLs for a given user_id
export async function getUrls(user_id) {
    if (!user_id) return [];
    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user_id);
    if (error) throw new Error(error.message);
    return data;
}


export async function deleteUrl(id){
    if (!id) throw new Error("No URL id provided for deletion");
    const {data, error} = await supabase
        .from("urls")
        .delete()
        .eq("id", id);
    if(error) {
        console.log(error.message);
        throw new Error("Unable to load URLS");
    }
    return data;
}
