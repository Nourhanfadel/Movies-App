
import React from "react";

function ActorCard({ actor }) {
  return (
<div className="w-32 flex-shrink-0 flex flex-col items-center">
  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800">
    <img
      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
      alt={actor.name}
      className="w-full h-full object-cover"
    />
  </div>
  <div className="mt-2 text-center">
    <h3 className="font-semibold text-white">{actor.name}</h3>
  </div>
</div>

  );
}

export default ActorCard;
