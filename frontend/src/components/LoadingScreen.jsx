// Full-page loading screen with FiftyFlowers branding
import logoMain from '../assets/images/logo-main.png';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient background - matches login page */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a4a] via-[#3d7a6a] to-[#4a9380]" />

      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d32]/50 via-transparent to-[#5ab89d]/20" />

      {/* Organic geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='0' cy='40' r='3'/%3E%3Ccircle cx='80' cy='40' r='3'/%3E%3Ccircle cx='40' cy='0' r='3'/%3E%3Ccircle cx='40' cy='80' r='3'/%3E%3Cpath d='M40 20c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0 2c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z' opacity='.5'/%3E%3Cpath d='M20 40c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9zm-2 0c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7 7-3.13 7-7z' opacity='.5'/%3E%3Cpath d='M80 40c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9zm-2 0c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7 7-3.13 7-7z' opacity='.5'/%3E%3Cpath d='M40 60c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0 2c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z' opacity='.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo with pulse animation */}
        <div className="mb-8 animate-pulse">
          <img
            src={logoMain}
            alt="FiftyFlowers"
            className="h-24 w-auto drop-shadow-lg"
          />
        </div>

        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 rounded-full border-4 border-white/20" />
          {/* Spinning arc */}
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-white animate-spin" />
        </div>

        {/* Loading text */}
        <p className="mt-6 text-white/70 text-sm font-medium tracking-wide">
          Loading...
        </p>
      </div>

      {/* Bottom text */}
      <div className="relative pb-8">
        <p className="text-center text-white/30 text-xs">
          Proposal Manager
        </p>
      </div>
    </div>
  );
}
