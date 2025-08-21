import { searchMovies } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function SearchPage(props: {
  searchParams: Promise<{ query: string }>;
}) {
  const { searchParams } = props;
  const params = await searchParams;
  const query = params.query;
  if (!query) {
    return <p>検索クエリがありません。</p>;
  }

  const movies = await searchMovies(query);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">検索結果: {query}</h1>
        <p className="muted">{movies.length} 件</p>
      </div>

      {movies.length > 0 ? (
        <div className="card-grid">
          {movies.map((movie) => (
            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card container-card hover:shadow-2xl transition"
            >
              <div>
                <div className="w-full h-[300px] relative">
                  <Image
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg truncate">
                    {movie.title}
                  </h2>
                  <p className="muted text-sm">{movie.release_date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="container-card p-6">
          検索結果が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
