export default function StyleTest() {
  return (
    <main className="min-h-screen bg-snow dark:bg-surface p-10 font-body">

      <h1 className="font-display text-4xl font-bold text-ink dark:text-chalk mb-1">
        VidMetrics
      </h1>

      <p className="label-caps mb-8">color + font + component verification</p>

 
      <p className="label-caps mb-3">colors</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "snow",    cls: "bg-snow border border-gray-200" },
          { label: "mint",    cls: "bg-mint" },
          { label: "grove",   cls: "bg-grove" },
          { label: "forest",  cls: "bg-forest" },
          { label: "ink",     cls: "bg-ink" },
          { label: "surface", cls: "bg-surface" },
          { label: "panel",   cls: "bg-panel" },
          { label: "fog",     cls: "bg-fog" },
          { label: "gold",    cls: "bg-gold" },
          { label: "rose",    cls: "bg-rose" },
          { label: "sky",     cls: "bg-sky" }
        ].map((swatch) => (
          <div key={swatch.label} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-xl ${swatch.cls}`} />
            <span className="text-xs text-fog font-mono">{swatch.label}</span>
          </div>
        ))}
      </div>

  
      <p className="label-caps mb-3">buttons</p>
      <div className="flex gap-3 mb-8">
        <button className="btn-primary">Analyze Channel</button>
        <button className="btn-ghost">Export CSV</button>
      </div>


      <p className="label-caps mb-2">input</p>
      <div className="max-w-md mb-8">
        <input
          className="input-base"
          placeholder="Paste YouTube channel URL here..."
        />
      </div>

   
      <p className="label-caps mb-3">cards</p>
      <div className="flex gap-4 mb-8">
        <div className="card p-6 w-48">
          <p className="label-caps mb-1">subscribers</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-chalk">
            1.2M
          </p>
        </div>
        <div className="card p-6 w-48">
          <p className="label-caps mb-1">total views</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-chalk">
            48.3M
          </p>
        </div>
      </div>

  
      <p className="label-caps mb-3">badges</p>
      <div className="flex gap-2">
        <span className="badge bg-mint text-forest">🥇 Top Video</span>
        <span className="badge bg-gold/20 text-gold">🔥 Trending</span>
        <span className="badge bg-sky/20 text-forest dark:text-sky">⚡ Spike</span>
        <span className="badge bg-rose/20 text-rose">Poor</span>
      </div>

    </main>
  );
}