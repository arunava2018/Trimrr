import supabase from "./supabase";
//this function will fetch the current user from our local storage
export async function getClicks(urlIds){
    const {data, error} = await supabase.from("clicks").select("*").in("url_id",urlIds);
    if(!session.session) return null;
    if(error) throw new Error(error.message);
    return data;
}
