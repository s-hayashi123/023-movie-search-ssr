import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">映画検索</h1>
      <form action="/search" method="GET" className="flex-fap-2">
        <input
          type="text"
          name="query"
          placeholder="映画のタイトルを入力..."
          required
          className="px-4 py-2 border rounded-md w-80"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          検索
        </button>
      </form>
    </div>
  );
}
