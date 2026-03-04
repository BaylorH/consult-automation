import { useAuth } from '../hooks/useAuth';

// FiftyFlowers logo (bundled asset)
import logoMain from '../assets/images/logo-main.png';

export default function Login() {
  const { login, error, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient background - warm greens inspired by FiftyFlowers brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a4a] via-[#3d7a6a] to-[#4a9380]" />

      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d32]/50 via-transparent to-[#5ab89d]/20" />

      {/* Organic geometric pattern - petal/leaf inspired */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='0' cy='40' r='3'/%3E%3Ccircle cx='80' cy='40' r='3'/%3E%3Ccircle cx='40' cy='0' r='3'/%3E%3Ccircle cx='40' cy='80' r='3'/%3E%3Cpath d='M40 20c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0 2c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z' opacity='.5'/%3E%3Cpath d='M20 40c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9zm-2 0c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7 7-3.13 7-7z' opacity='.5'/%3E%3Cpath d='M80 40c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9zm-2 0c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7 7-3.13 7-7z' opacity='.5'/%3E%3Cpath d='M40 60c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0 2c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z' opacity='.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft radial glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* White Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with logo */}
            <div className="px-8 pt-10 pb-8 text-center">
              <div className="inline-block mb-6">
                <img
                  src={logoMain}
                  alt="FiftyFlowers"
                  className="h-20 w-auto"
                />
              </div>
              <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">
                Proposal Manager
              </h1>
              <p className="mt-2 text-[#666] text-sm">
                FiftyFlowers Consultation Tool
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#e6e6e6] to-transparent mx-8" />

            {/* Body */}
            <div className="px-8 py-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <svg className="w-5 h-5 text-[#4a9380] animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-3 text-[#666] text-sm">Signing in...</span>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="group w-full flex items-center justify-center gap-3 bg-[#4a9380] hover:bg-[#3d7a6a] text-white font-medium py-3.5 px-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-[#f9fafa] border-t border-[#e6e6e6]">
              <p className="text-center text-[#999] text-xs">
                Restricted to @fiftyflowers.com accounts
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-8 text-center text-white/50 text-xs">
            Powered by FiftyFlowers
          </p>
        </div>
      </div>
    </div>
  );
}
