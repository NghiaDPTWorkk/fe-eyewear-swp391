import LogoEyewearIcon from '@/shared/components/ui/logoeyewear/LogoEyewearIcon'
import { useNavigate } from 'react-router-dom'
export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fcfb] p-4">
      {}
      <style>
        {`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            100% { transform: translate(1px, 1px) rotate(0deg); }
          }
          .shake-hover:hover {
            animation: shake 0.5s infinite;
          }
          .logo-icon::before {
            content: ""; position: absolute; width: 16px; height: 4px;
            background: white; border-radius: 2px; top: 10px; left: 8px;
          }
          .logo-icon::after {
            content: ""; position: absolute; width: 16px; height: 4px;
            background: white; border-radius: 2px; bottom: 10px; left: 8px;
          }
        `}
      </style>

      <div className="max-w-[500px] w-full bg-white p-10 rounded-[12px] text-center border border-[#77cbb2] shadow-[0px_4px_20px_rgba(119,203,178,0.15)]">
        {}
        <div className="flex items-center justify-center gap-[10px] mb-5 text-mint-600 font-bold text-2xl">
          <LogoEyewearIcon />
          Optic Eyewear
        </div>

        {}
        <div className="error-code shake-hover text-[8rem] font-extrabold text-[#b40a0a] leading-none cursor-help inline-block transition-transform duration-200">
          404
        </div>

        <p className="text-[1.1rem] leading-[1.6] mb-[30px] italic text-[#666]">
          "Huhu, you're looking for something that doesn't exist here. <br /> Stop trying so hard,
          it's empty. Time to head back!"
        </p>

        {}
        <div className="flex gap-[15px] justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-[14px] bg-mint-600 text-white font-bold rounded-lg border border-mint-800 hover:bg-mint-900 hover:scale-[1.03] transition-all duration-300"
          >
            Về Trang Chủ
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-[14px] bg-[#f1f3f5] text-[#2d3436] font-bold rounded-lg border border-[#ced4da] hover:bg-[#e2e6ea] hover:border-[#adb5bd] transition-all duration-300"
          >
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  )
}
