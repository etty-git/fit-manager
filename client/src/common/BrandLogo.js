import { FaDumbbell } from "react-icons/fa";

export default function BrandLogo({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-sm">
        <FaDumbbell className="text-xl" />
      </div>
      {!compact && (
        <div>
          <p className={`text-lg font-black leading-none ${light ? "text-white" : "text-slate-950"}`}>
            FitManager
          </p>
          <p className={`mt-1 text-xs font-bold uppercase tracking-[0.22em] ${light ? "text-emerald-200" : "text-emerald-700"}`}>
            Athletic Club
          </p>
        </div>
      )}
    </div>
  );
}
