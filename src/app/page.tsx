import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center grow">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
        Odkryj świat najlepszych alkoholi
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl">
        Zamawiaj ulubione trunki z dostawą, poznawaj ich historię i stwórz własne, niestandardowe zamówienie prosto z naszej destylarni.
      </p>
      
      {/* Kafelki centrowane przez Flexbox */}
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        <Tile icon="🍷" title="Sklep / Katalog" desc="Przeglądaj i zamawiaj gotowe trunki" />
        <Tile icon="🛒" title="Koszyk" desc="Twój aktualny koszyk" />
        <Tile icon="🚚" title="Status zamówienia" desc="Sprawdź gdzie jest Twoja paczka" />
        <Tile icon="📚" title="Historia alkoholi" desc="Poznaj gatunki i tradycje" />
        <Tile icon="🧪" title="Zamówienie własne" desc="Skomponuj własny trunek" />
        <Tile icon="❓" title="FAQ" desc="Najczęściej zadawane pytania" />
      </div>
    </div>
  );
}

// Komponent kafelka
function Tile({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <Link href="#" className="flex flex-col items-center justify-center w-64 h-40 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{title}</h2>
      <p className="text-xs text-slate-500 text-center px-4">{desc}</p>
    </Link>
  );
}