const supabase = require("../config/supabase");

exports.createMemeService = async ({
  title,
  tags,
  ownerId,
  upvotes,
  imageBuffer,
  contentType,
}) => {
  console.log("the_d", {
    title,
    tags,
    ownerId,
    upvotes,
    imageBuffer,
    contentType,
  });

  // Convert buffer to Base64 before inserting
  const base64String = imageBuffer.toString('base64');
  const dataUrl = `data:${contentType};base64,${base64String}`;
  
  const { data, error } = await supabase
    .from("memes")
    .insert([
      {
        title,
        tags: tags.split(",").map((tag) => tag.trim()),
        ownerid: ownerId,
        upvotes,
        imageurl: dataUrl, // ✅ Correct: insert as string
        filetype: contentType,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new Error(error.message || "Failed to insert meme");
  }

  if (!data || data.length === 0) {
    throw new Error("Insert succeeded but no data returned");
  }

  return data[0]; // Return safely
};

// Get All Memes
exports.getAllMemes = async () => {
  const { data, error } = await supabase.from("memes").select("*");
  if (error) throw new Error(error.message);

  // Return as-is because imageUrl is already stored
  return data;
};

// Get Meme By ID
exports.getMemeById = async (id) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  return data; // imageUrl is already usable
};

// Upvote Meme
exports.upvoteMeme = async (id) => {
  console.log("the" , id)
  const { data: meme, error: fetchError } = await supabase
    .from("memes")
    .select("upvotes")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { data, error } = await supabase
    .from("memes")
    .update({ upvotes: meme.upvotes + 1 })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);

  return data;
};

// Downvote Meme
exports.downvoteMeme = async (id) => {
  const { data: meme, error: fetchError } = await supabase
    .from("memes")
    .select("upvotes")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const updatedUpvotes = Math.max(0, meme.upvotes - 1);
  const { data, error } = await supabase
    .from("memes")
    .update({ upvotes: updatedUpvotes })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);

  return data;
};
