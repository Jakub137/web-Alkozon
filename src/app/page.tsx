export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
        Odkryj świat najlepszych alkoholi
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl">
        Zamawiaj ulubione trunki z dostawą, poznawaj ich historię i stwórz własne, niestandardowe zamówienie prosto z naszej destylarni.
      </p>
      
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition">
          Przejdź do sklepu
        </button>
        <button className="bg-slate-100 text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">
          Dowiedz się więcej
        </button>
      </div>
    </div>
  );
}