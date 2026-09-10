import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16">
        {/* Left: Message & Back Button */}
        <div className="flex flex-col items-start space-y-4 text-left">
          <span className="text-xl font-medium text-slate-500">Oops...</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm">
            The page you are looking for might have been removed had its name changed or is temporarily unavailable.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C02586] hover:bg-[#A81F74] text-white text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>

        {/* Right: Whimsical Scarecrow Illustration */}
        <div className="flex justify-center items-center">
          <svg
            viewBox="0 0 420 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md h-auto drop-shadow-sm select-none"
          >
            {/* Soft decorative background circles & stars */}
            <circle cx="160" cy="110" r="14" fill="#FCE7F3" opacity="0.6" />
            <circle cx="280" cy="190" r="8" fill="#EDE9FE" opacity="0.8" />
            {/* Sparkle 1 */}
            <path
              d="M130 90 Q130 100 120 100 Q130 100 130 110 Q130 100 140 100 Q130 100 130 90 Z"
              fill="#FBBF24"
            />
            {/* Sparkle 2 */}
            <path
              d="M310 80 Q310 90 300 90 Q310 90 310 100 Q310 90 320 90 Q310 90 310 80 Z"
              fill="#F472B6"
            />

            {/* Vertical Wood Pole (Post) */}
            <rect x="202" y="160" width="16" height="170" rx="3" fill="#D97706" />
            <rect x="207" y="160" width="6" height="170" fill="#F59E0B" />
            {/* Pole Base / Ground */}
            <ellipse cx="210" cy="335" rx="45" ry="8" fill="#E2E8F0" />
            <ellipse cx="210" cy="335" rx="30" ry="5" fill="#CBD5E1" />

            {/* Horizontal Outstretched Wood Crossbar */}
            <rect x="65" y="172" width="290" height="14" rx="4" fill="#D97706" />
            <rect x="65" y="174" width="290" height="5" fill="#F59E0B" />

            {/* Hanging Tags / Documents from Arms */}
            {/* String 1 & Tag */}
            <line x1="110" y1="186" x2="110" y2="208" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="98" y="208" width="24" height="32" rx="3" fill="#38BDF8" />
            <rect x="103" y="213" width="14" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="103" y="219" width="10" height="2.5" rx="1" fill="white" opacity="0.8" />
            <circle cx="110" cy="204" r="2" fill="#64748B" />

            {/* String 2 & Tag */}
            <line x1="150" y1="186" x2="150" y2="218" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="138" y="218" width="24" height="34" rx="3" fill="#818CF8" />
            <rect x="143" y="224" width="14" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="143" y="230" width="10" height="2.5" rx="1" fill="white" opacity="0.8" />
            <circle cx="150" cy="214" r="2" fill="#64748B" />

            {/* String 3 & Tag (Right side) */}
            <line x1="270" y1="186" x2="270" y2="212" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="258" y="212" width="24" height="32" rx="3" fill="#C02586" />
            <rect x="263" y="217" width="14" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="263" y="223" width="10" height="2.5" rx="1" fill="white" opacity="0.8" />
            <circle cx="270" cy="208" r="2" fill="#64748B" />

            {/* String 4 & Tag (Far right) */}
            <line x1="310" y1="186" x2="310" y2="222" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="298" y="222" width="24" height="34" rx="3" fill="#34D399" />
            <rect x="303" y="228" width="14" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="303" y="234" width="10" height="2.5" rx="1" fill="white" opacity="0.8" />
            <circle cx="310" cy="218" r="2" fill="#64748B" />

            {/* Straw Tufts at Sleeve Ends */}
            {/* Left Straw */}
            <path d="M68 174 L48 166 L64 179 L44 178 L65 184 L50 190 L70 186 Z" fill="#FCD34D" />
            {/* Right Straw */}
            <path d="M352 174 L372 166 L356 179 L376 178 L355 184 L370 190 L350 186 Z" fill="#FCD34D" />

            {/* Sleeves (Purple/Berry coat arms) */}
            <path d="M80 170 L170 162 L170 194 L80 188 Z" fill="#6B21A8" />
            <path d="M250 162 L340 170 L340 188 L250 194 Z" fill="#6B21A8" />
            {/* Sleeve Cuffs */}
            <rect x="74" y="168" width="8" height="22" rx="2" fill="#C02586" />
            <rect x="338" y="168" width="8" height="22" rx="2" fill="#C02586" />

            {/* Scarecrow Straw at Bottom Coat */}
            <path d="M190 260 L180 295 L195 265 L200 300 L210 265 L220 300 L225 265 L240 295 L230 260 Z" fill="#FCD34D" />

            {/* Scarecrow Coat / Body */}
            <path
              d="M165 160 Q210 152 255 160 L250 265 Q210 275 170 265 Z"
              fill="#581C87"
            />
            {/* Coat Lapels & Accents */}
            <path d="M185 160 L210 215 L235 160 Z" fill="#C02586" />
            <path d="M195 160 L210 195 L225 160 Z" fill="#FDF2F8" />
            {/* Coat Buttons */}
            <circle cx="210" cy="225" r="3.5" fill="#FCD34D" />
            <circle cx="210" cy="242" r="3.5" fill="#FCD34D" />

            {/* Head (Cute violet sphere) */}
            <circle cx="210" cy="120" r="32" fill="#7C3AED" />

            {/* Straw Hair Peeking Out */}
            <path d="M182 110 L168 112 L180 120" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
            <path d="M238 110 L252 112 L240 120" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />

            {/* Face details */}
            {/* Eyes */}
            <circle cx="198" cy="116" r="7.5" fill="white" />
            <circle cx="222" cy="116" r="7.5" fill="white" />
            <circle cx="200" cy="116" r="4" fill="#0F172A" />
            <circle cx="224" cy="116" r="4" fill="#0F172A" />
            <circle cx="201" cy="114" r="1.5" fill="white" />
            <circle cx="225" cy="114" r="1.5" fill="white" />

            {/* Rosy Cheeks */}
            <circle cx="190" cy="125" r="5" fill="#F472B6" opacity="0.6" />
            <circle cx="230" cy="125" r="5" fill="#F472B6" opacity="0.6" />

            {/* Stitched Smile */}
            <path
              d="M202 130 Q210 137 218 130"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Stitch Marks */}
            <line x1="205" y1="129" x2="205" y2="133" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="215" y1="129" x2="215" y2="133" stroke="#0F172A" strokeWidth="1.5" />

            {/* Cute Scarecrow / Wizard Hat */}
            {/* Hat Brim */}
            <ellipse
              cx="210"
              cy="98"
              rx="48"
              ry="12"
              fill="#4C1D95"
              transform="rotate(-5 210 98)"
            />
            {/* Hat Ribbon / Band */}
            <path
              d="M185 92 Q210 88 235 94 L232 82 Q210 76 188 80 Z"
              fill="#C02586"
            />
            {/* Hat Cone with playful bend */}
            <path
              d="M188 82 Q200 40 250 32 Q230 52 232 84 Z"
              fill="#4C1D95"
            />
            {/* Hat Buckle / Star Accent */}
            <circle cx="208" cy="85" r="4" fill="#FBBF24" />
          </svg>
        </div>
      </div>
    </div>
  );
}
