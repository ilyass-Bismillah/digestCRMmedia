export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Glow */}
        <div className="absolute w-20 h-20 rounded-full bg-berry/15 animate-ping" />

        {/* Rotating border spinner */}
        <div className="w-16 h-16 rounded-full border-2 border-slate-100 border-t-berry animate-spin" />

        {/* Central Brand DM Monogram */}
        <div className="absolute w-10 h-10 rounded-full bg-berry flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold text-sm tracking-tight select-none">
            DM
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400 tracking-wider uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}
