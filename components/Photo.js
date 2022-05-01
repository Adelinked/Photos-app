export default function Photo({
  urls: { regular },
  alt_description,
  likes,
  user: {
    name,
    portfolio_url,
    profile_image: { medium },
  },
}) {
  return (
    <div className="photo-pad">
      <img className="image" src={regular} alt={alt_description} />

      <div className="photo-title">
        <div>
          <h4>{name}</h4>
          <p>{likes}&nbsp;likes</p>
        </div>
        <img className="avatar" src={medium}></img>
      </div>
    </div>
  );
}
