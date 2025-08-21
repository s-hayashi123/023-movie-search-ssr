export default function Home() {
  return (
    <div className="min-h-[60vh] flex items-center">
      <div className="w-full container-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-2">映画検索</h1>{" "}
            <p className="muted">TMDBデータベースから映画を検索できます。</p>{" "}
          </div>
          <div className="flex-1">
            <form action="/search" method="GET" className="flex gap-3">
              <input
                type="text"
                name="query"
                placeholder="映画のタイトルを入力..."
                required
                className="input flex-1"
              />
              <button
                type="submit"
                className="bg-gray-700 px-4 py-2 text-white cursor-pointer rounded-lg hover:bg-gray-900"
              >
                検索
              </button>
            </form>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
