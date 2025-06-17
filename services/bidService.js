const supabase = require("../config/supabase");

const placeBid = async (bidData) => {
  const { data, error } = await supabase
    .from("bids")
    .insert([bidData])
    .select(); // ensures returning inserted row

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  return data[0]; // now safe — always exists
};

const getBidsByMemeId = async (memeId) => {
  const { data, error } = await supabase
    .from("bids")
    .select("*") // SELECT once only
    .eq("memeid", memeId) // WHERE memeId = ?
    .order("credits", { ascending: false }); // order by credits desc

  if (error) throw new Error(error.message);
  return data;
};

// Get Top Memes by upvotes
const getTopMemes = async (limit = 5) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("upvotes", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
};

module.exports = {
  placeBid,
  getBidsByMemeId,
  getTopMemes,
};
