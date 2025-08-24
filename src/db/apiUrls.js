import supabase from "./supabase";
//this function will fetch the current user from our local storage
export async function getUrls(user_id){
    const {data, error} = await supabase.from("urls").select("*").eq("user_id",user_id);
    if(!session.session) return null;
    if(error) throw new Error(error.message);
    return data;
}
