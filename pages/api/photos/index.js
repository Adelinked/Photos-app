import axios from "axios";

const apiKey = process.env.AccessKey;

export default async function handler(req, res) {
  const { title, page } = req.query;
  //console.log(title);
  let url = title
    ? `https://api.unsplash.com/search/photos/`
    : `https://api.unsplash.com/photos/`;
  const query = title ? `&query=${title}` : ``;

  url = `${url}?client_id=${apiKey}&page=${page}${query}`;
  console.log(url);
  try {
    const data = await axios.get(`${url}`);
    res.status(200).json({ msg: data.data });
  } catch (error) {
    res.status(400).json(error.response.data);
  }
}
