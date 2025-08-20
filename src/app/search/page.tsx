import { searchMovies } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function SearchPage(props: {
  searchParams: { query: string };
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
      <h1 className="text-3xl font-bold mb-8">検索結果: {query}</h1>
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">{movie.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>検索結果が見つかりませんでした。</p>
      )}
    </div>
  );
}
