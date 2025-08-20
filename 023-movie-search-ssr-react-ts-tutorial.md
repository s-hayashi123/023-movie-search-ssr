# 【React & TypeScript】映画情報検索サイト(SSR)で作る！映画情報検索サイト開発チュートリアル (023)

## 導入 (The "Why")

このチュートリアルでは、外部APIと連携し、Next.jsのサーバーサイドレンダリング（SSR）を駆使して、動的な映画情報検索サイトを構築します。ユーザーの入力に応じてリアルタイムでデータを取得し、常に最新の情報を提供するウェブアプリケーションの開発に挑戦しましょう！

**完成形のイメージ:**
(ここに完成した映画検索サイトのスクリーンショットやGIFアニメーションを挿入)

このプロジェクトを通じて、あなたは単にAPIからデータを表示するだけでなく、SSRの仕組み、動的ルーティング、そして外部APIとの安全な連携方法など、より高度で実践的なWeb開発のスキルを習得できます。SSGとの違いを体感し、適切な場面で適切なレンダリング手法を選択できるエンジニアを目指しましょう。

## 環境構築

このプロジェクトでは、以下の技術を使用します。

*   **Next.js (App Router)**
*   **TypeScript**
*   **Tailwind CSS**
*   **The Movie Database (TMDB) API**

まずは、Next.jsとTailwind CSSの環境をセットアップしてください。公式ドキュメントが最良のガイドです。

*   [Next.js](https://nextjs.org/)
*   [Tailwind CSS](https://tailwindcss.com/)

次に、映画情報を取得するために[The Movie Database (TMDB)](https://www.themoviedb.org/)のアカウントを作成し、APIキーを取得してください。このAPIキーは後ほどプロジェクトで利用します。

## 【最重要】超詳細なステップバイステップ開発手順

### Step 1: プロジェクト作成とAPIキーの設定

#### Step 1: このステップのゴールを明確に
Next.jsプロジェクトをセットアップし、取得したTMDBのAPIキーを安全に設定します。

#### The How: 具体的なコードと手順
1.  **プロジェクト作成:**
    ```bash
    npx create-next-app@latest 023-movie-search-ssr --typescript --eslint --tailwind --src-dir --app --import-alias "@/*"
    ```
2.  **環境変数ファイル作成:**
    プロジェクトのルートに`.env.local`というファイルを作成し、以下のようにAPIキーを記述します。

    **`.env.local`**
    ```
    TMDB_API_KEY=ここにあなたのTMDB_APIキーを貼り付け
    ```

#### The Why: なぜ、それが必要なのか？（コードの逐条解説）
*   `.env.local`: このファイルに記述された環境変数は、Next.jsによって自動的に読み込まれます。`.local`という接尾辞がついているため、Gitの管理対象からデフォルトで除外されます。APIキーのような機密情報をコードリポジトリに直接含めることなく、安全に管理するためのベストプラクティスです。

### Step 2: APIラッパーと型定義の作成

#### Step 2: このステップのゴールを明確に
TMDB APIへのリクエストロジックをカプセル化する「APIラッパー」と、APIレスポンスの型を定義するファイルを作成します。

#### The How: 具体的なコードと手順
1.  **型定義ファイル作成:**
    `src`ディレクトリに`types`フォルダを作成し、`tmdb.ts`というファイルを作成します。

    **`src/types/tmdb.ts`**
    ```typescript
    export interface Movie {
      id: number;
      title: string;
      poster_path: string | null;
      release_date: string;
      vote_average: number;
      overview: string;
    }

    export interface MovieSearchResult {
      results: Movie[];
    }
    ```

2.  **APIラッパー作成:**
    `src`ディレクトリに`lib`フォルダを作成し、`tmdb.ts`というファイルを作成します。

    **`src/lib/tmdb.ts`**
    ```typescript
    import { Movie, MovieSearchResult } from "@/types/tmdb";

    const BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = process.env.TMDB_API_KEY;

    export const searchMovies = async (query: string): Promise<Movie[]> => {
      if (!API_KEY) throw new Error("TMDB_API_KEY is not defined");
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=ja-JP`);
      if (!response.ok) throw new Error("Failed to search movies");
      const data: MovieSearchResult = await response.json();
      return data.results;
    };

    export const getMovieDetails = async (id: number): Promise<Movie> => {
      if (!API_KEY) throw new Error("TMDB_API_KEY is not defined");
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ja-JP`);
      if (!response.ok) throw new Error("Failed to get movie details");
      const data: Movie = await response.json();
      return data;
    };
    ```

#### The Why: なぜ、それが必要なのか？（コードの逐条解説）
*   **カプセル化:** APIとの通信ロジックを`lib/tmdb.ts`にまとめることで、コンポーネント側は「どの関数を呼べば良いか」だけを意識すればよくなります。APIのエンドポイントやキーの管理といった詳細を隠蔽し、コードの見通しと再利用性を高めます。
*   **型定義:** `types/tmdb.ts`でAPIレスポンスの型を定義しておくことで、TypeScriptの型チェックの恩恵を最大限に受けることができます。プロパティ名のタイポを防いだり、エディタの自動補完が効いたりと、開発効率が格段に向上します。

### Step 3: トップページの作成（検索フォーム）

#### Step 3: このステップのゴールを明確に
ユーザーが映画タイトルを検索するためのフォームを持つトップページを作成します。

#### The How: 具体的なコードと手順
`src/app/page.tsx`を以下のように編集します。

**`src/app/page.tsx`**
```tsx
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">映画検索</h1>
      <form action="/search" method="GET" className="flex gap-2">
        <input
          type="text"
          name="query"
          placeholder="映画のタイトルを入力..."
          className="px-4 py-2 border rounded-md w-80"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          検索
        </button>
      </form>
    </div>
  );
}
```

#### The Why: なぜ、それが必要なのか？（コードの逐条解説）
*   **`<form action="/search" method="GET">`**: このフォームが送信されると、ブラウザは`/search`ページに遷移します。`method="GET"`なので、`input`フィールドの内容はURLのクエリパラメータとして渡されます。例えば、「Inception」と入力して検索すると、`/search?query=Inception`というURLに遷移します。これはSSRページにユーザーの入力を渡す最もシンプルで基本的な方法です。

### Step 4: 検索結果ページの作成（SSR）

#### Step 4: このステップのゴールを明確に
URLクエリを元にAPIで映画を検索し、結果をサーバーサイドでレンダリングして表示するページを作成します。

#### The How: 具体的なコードと手順
`src/app/search/page.tsx`を新規に作成します。

**`src/app/search/page.tsx`**
```tsx
import { searchMovies } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  const query = searchParams.query;
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
```

#### The Why: なぜ、それが必要なのか？（コードの逐条解説）
*   **`async function SearchPage(...)`**: ページコンポーネントを`async`にすることで、コンポーネント内で`await`を使って非同期処理（APIリクエストなど）を直接行えるようになります。これがサーバーコンポーネントの強力な機能です。
*   **`searchParams`**: `page.tsx`は`searchParams`というpropsを受け取ることができ、これを通じてURLのクエリパラメータ（`?query=...`）にアクセスできます。
*   **SSRの実現**: このページはリクエストがあるたびにサーバーサイドで実行されます。`searchMovies(query)`が実行され、APIから最新のデータを取得し、そのデータを含んだHTMLが生成されてからクライアントに送信されます。これにより、ユーザーは常に最新の検索結果を見ることができ、検索エンジンも内容をクロールできます。

### Step 5: 映画詳細ページの作成（動的ルート & SSR）

#### Step 5: このステップのゴールを明確に
映画のIDに基づいて動的に生成される、映画の詳細情報ページを作成します。

#### The How: 具体的なコードと手順
`src/app/movie/[id]/page.tsx`というパスでファイルを新規作成します。

**`src/app/movie/[id]/page.tsx`**
```tsx
import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
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
        <p className="text-lg mb-4">公開日: {movie.release_date}</p>
        <p className="text-lg mb-4">評価: {movie.vote_average.toFixed(1)} / 10</p>
        <h2 className="text-2xl font-bold mb-2">あらすじ</h2>
        <p>{movie.overview}</p>
      </div>
    </div>
  );
}
```

#### The Why: なぜ、それが必要なのか？（コードの逐条解説）
*   **動的セグメント `[id]`**: フォルダ名を角括弧で囲む（`[id]`）ことで、動的なルートを作成できます。`/movie/123`や`/movie/456`のようなURLにアクセスすると、`params.id`として`123`や`456`という文字列がコンポーネントに渡されます。
*   **`params`**: `page.tsx`は`params`というpropsを受け取り、これを通じて動的セグメントの値にアクセスできます。
*   **ここでもSSR**: このページもリクエストごとにサーバーサイドでレンダリングされます。URLのIDに基づいて`getMovieDetails`が実行され、特定の映画の最新情報を含んだHTMLが生成されます。

## 深掘りコラム (Deep Dive)

*   **SSR vs SSG**: SSRはリクエストごとにHTMLを生成するのに対し、SSGはビルド時にHTMLを生成します。ユーザーの入力に依存するページや、頻繁に更新されるデータを見せるページにはSSRが、ブログ記事やドキュメントのように内容が静的なページにはSSGが適しています。
*   **`fetch`のキャッシュ制御**: Next.jsは`fetch`APIを拡張し、結果を積極的にキャッシュしようとします。SSRのように毎回最新のデータを取得したい場合は、`fetch(url, { cache: 'no-store' })`のようにオプションを指定する必要があります。今回はAPIラッパー内でこの制御はしていませんが、より厳密なキャッシュ戦略が必要な場合に重要になります。

## 挑戦課題 (Challenges)

*   **Easy:** 関連映画の一覧を詳細ページに表示してみましょう。（TMDBには関連映画を取得するAPIもあります）
*   **Medium:** 検索結果ページにページネーション機能を追加してみましょう。
*   **Hard:** 検索履歴を`localStorage`に保存し、トップページに表示する機能を追加してみましょう。

## メモ (Memo)

ここに、学習中に気づいたことや疑問に思ったことを自由に書き留めてください。

---

## 結論

お疲れ様でした！このチュートリアルでは、Next.jsのSSRをフル活用して、外部APIと連携する動的なWebアプリケーションを構築しました。サーバーコンポーネントでのデータフェッチ、動的ルーティング、環境変数によるAPIキーの安全な管理など、実務レベルの開発で必須となる多くのスキルを体験できたはずです。

ここからさらに、UIを洗練させたり、お気に入りの映画を保存する機能を追加したりと、あなただけの映画情報サイトへと発展させてみてください！
