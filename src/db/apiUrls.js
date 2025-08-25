import supabase from "./supabase";
import { supabaseUrl } from "./supabase";
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
export async function getLongUrl(id) {
  let {data: shortLinkData, error: shortLinkError} = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

export async function getUrl({id, user_id}) {
  const {data, error} = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function deleteUrl(id) {
  if (!id) throw new Error("No URL id provided for deletion");
  const { data, error } = await supabase.from("urls").delete().eq("id", id);
  if (error) {
    console.log(error.message);
    throw new Error("Unable to load URLS");
  }
  return data;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrCode
) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;

  const { error: storageError } = await supabase.storage
    .from("QRS")
    .upload(fileName, qrCode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/QRS/${fileName}`;
  const { data, error } = await supabase.from("urls").insert([
    {
        title,
        original_url:longUrl,
        custom_url:customUrl || null,
        user_id,
        short_url,
        qr,
    }
  ]).select();
  if (error) {
    console.log(error.message);
    throw new Error("Error creating short url");
  }
  return data;
}
