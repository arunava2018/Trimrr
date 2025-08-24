import supabase, {supabaseUrl} from "./supabase";
export async function login({email, password}){
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if(error){
        throw new Error(error.message);
    }
    return data;
}

//this function will fetch the current user from our local storage
export async function getCurrentUser(){
    const {data:session, error} = await supabase.auth.getSession();
    if(!session.session) return null;
    if(error) throw new Error(error.message);
    return session.session?.user;
}


export async function signup({ name, email, password, profile_pic }) {
  try {
    const fileName = `dp-${name.trim().replace(/\s+/g, "-")}-${Date.now()}`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
        },
      },
    });

    if (error) {
      // Log full error object from Supabase
    //   console.error("Signup error:", error);
      throw new Error(error.message || "Unknown signup error");
    }

    // Upload profile picture if provided
    if (profile_pic) {
      const { error: storageError } = await supabase.storage
        .from("profile_pic")
        .upload(fileName, profile_pic);

      if (storageError) {
        // console.error("Storage upload error:", storageError);
        throw new Error(storageError.message);
      }
    }

    return data;
  } catch (err) {
    // console.error("Unexpected error during signup:", err);
    throw err;
  }
}

export async function signout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
