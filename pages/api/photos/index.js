import axios from "axios";

const apiKey = process.env.AccessKey;

export default async function handler(req, res) {
  const { title, page } = req.query;
  let url = title
    ? `https://api.unsplash.com/search/photos/`
    : `https://api.unsplash.com/photos/`;

  url = `${url}?client_id=${apiKey}&page=${page}&query=${title}`;
  try {
    const data = await axios.get(`${url}`);
    res.status(200).json({ msg: data.data });
  } catch (error) {}
  //res.status(200).json({ data: "hi" });
}
