import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function MovieDetailPage(props: {
  params: { id: string };
}) {
  const params = await props.params;
  const movieId = parseInt(params.id, 10);
  const movie = await getMovieDetails(movieId);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">
        <Image
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          width={500}
          height={750}
          className="rounded-lg"
        />
      </div>
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-lg mb-4">公開日：{movie.release_date}</p>
        <p className="text-lg mb-4">
          評価： {movie.vote_average.toFixed(1)}/ 10
        </p>
        <h2 className="text-2xl font-bold mb-2">あらすじ</h2>
        <p>{movie.overview}</p>
      </div>
    </div>
  );
}
