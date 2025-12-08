import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ActorCard from "./ActorCard";

export default function ActorsSlider({ actors }) {
  return (
    <div className="my-8 px-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-pink-900">Top Actors</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => {
            document.getElementById("actors-container")
              .scrollBy({ left: -300, behavior: "smooth" });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full"
        >
          <FaArrowLeft />
        </button>

        <div
          id="actors-container"
          className="flex gap-4 overflow-x-hidden bg-black p-4 rounded-md scrollbar-hide"
        >
          {actors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>

        <button
          onClick={() => {
            document.getElementById("actors-container")
              .scrollBy({ left: 300, behavior: "smooth" });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
