import type { Voucher } from '@/shared/types'
import {
  fmtVND,
  fmtDate
} from '@/components/layout/staff/manager-staff/voucher-table/VoucherTdata.utils'
import { VoucherDiscountType } from '@/shared/utils/enums/voucher.enum'

interface Props {
  voucher: Voucher
}

export default function VoucherTicket({ voucher: v }: Props) {
  const isPerc = v.typeDiscount === VoucherDiscountType.PERCENTAGE
  const dateRange = `${fmtDate(v.startedDate)} — ${fmtDate(v.endedDate)}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600;800;900&family=Playfair+Display:ital,wght@1,500&display=swap');

        @keyframes voucher-pop {
          0% {
            transform: scale(0.6) rotateX(45deg) translateY(40px);
            opacity: 0;
            filter: blur(10px);
          }
          60% {
            transform: scale(1.05) rotateX(-10deg) translateY(-10px);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: scale(1) rotateX(0) translateY(0);
            opacity: 1;
            filter: blur(0);
          }
        }

        .animate-voucher-pop {
          animation: voucher-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          perspective: 1000px;
        }

        .voucher-ticket-container {
            position: relative;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.12));
            width: fit-content;
            margin: 0 auto;
            font-family: 'Montserrat', sans-serif;
            transform-style: preserve-3d;
        }

        /* Răng cưa màu xanh nước biển */
        .vt-edge {
            position: absolute;
            top: 0;
            width: 16px;
            height: 100%;
            background-image: radial-gradient(circle, #1e3d6e 8px, transparent 9px);
            background-size: 32px 32px;
            background-position: center;
            z-index: 10;
        }
        .vt-edge-left { left: -8px; }
        .vt-edge-right { right: -8px; }

        .vt-voucher {
            display: flex;
            width: 820px;
            height: 280px;
            background-color: #dcf2ec;
            position: relative;
            overflow: hidden;
            border-radius: 4px;
        }

        /* Nền 3 vòng tròn đè lên nhau sang trọng */
        .vt-bg-circles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .vt-circle {
            position: absolute;
            border-radius: 50%;
        }
        .vt-c1 { width: 450px; height: 450px; top: -150px; left: -80px; background: #c8e8df; }
        .vt-c2 { width: 400px; height: 400px; bottom: -120px; right: 80px; background: #bfe3d9; }
        .vt-c3 { width: 280px; height: 280px; top: 30px; left: 180px; background: #d3ede5; }

        .vt-main-border {
            position: absolute;
            top: 15px; left: 15px; right: 15px; bottom: 15px;
            border: 1.5px solid #2d4f45;
            z-index: 5;
            display: flex;
        }

        .vt-content-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-right: 2px dashed #2d4f45;
        }

        .vt-system-name {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 5px;
            color: #1a3d34;
            text-transform: uppercase;
            margin-top: 5px;
            text-align: center;
        }

        .vt-discount-title {
            text-align: center;
            color: #1a3d34;
        }

        .vt-val { font-size: 80px; font-weight: 900; line-height: 0.8; display: block; }
        .vt-lbl { font-size: 20px; font-weight: 700; letter-spacing: 10px; display: block; margin-top: 10px; }

        .vt-date-box {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 18px;
            color: #2d4f45;
            border-top: 1px solid #2d4f45;
            padding-top: 10px;
            width: 85%;
            text-align: center;
        }

        .vt-content-right {
            width: 200px;
            display: flex;
            padding: 10px;
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
        }

        .vt-barcode-area {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .vt-barcode-wrapper {
            display: flex;
            height: 100%;
            position: relative;
            align-items: stretch;
        }

        .vt-bars {
            width: 50px;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                #2d4f45,
                #2d4f45 2px,
                transparent 2px,
                transparent 5px
            );
        }

        .vt-barcode-numbers {
            writing-mode: vertical-rl;
            font-size: 7px;
            font-weight: 700;
            color: #2d4f45;
            display: flex;
            justify-content: space-between;
            height: 100%;
            margin-left: 6px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .vt-admit-text {
            writing-mode: vertical-rl;
            font-size: 30px;
            font-weight: 900;
            color: #2d4f45;
            letter-spacing: 3px;
            margin-left: 15px;
            text-transform: uppercase;
            white-space: nowrap;
        }
      `}</style>

      <div className="voucher-ticket-container scale-[0.85] origin-top">
        <div className="vt-edge vt-edge-left"></div>
        <div className="vt-edge vt-edge-right"></div>

        <div className="vt-voucher">
          <div className="vt-bg-circles">
            <div className="vt-circle vt-c1"></div>
            <div className="vt-circle vt-c2"></div>
            <div className="vt-circle vt-c3"></div>
          </div>

          <div className="vt-main-border">
            <div className="vt-content-left">
              <div className="vt-system-name">{v.name}</div>

              <div className="vt-discount-title">
                <span className="vt-val">{isPerc ? `${v.value}%` : fmtVND(v.value)}</span>
                <span className="vt-lbl">DISCOUNT</span>
              </div>

              <div className="vt-date-box">{dateRange}</div>
            </div>

            <div className="vt-content-right">
              <div className="vt-barcode-area">
                <div className="vt-barcode-wrapper">
                  <div className="vt-bars"></div>
                  <div className="vt-barcode-numbers font-mono">
                    <span>{v.code.slice(0, 5)}</span>
                    <span className="opacity-50">{v._id}</span>
                    <span>{v.code}</span>
                  </div>
                </div>
              </div>
              <div className="vt-admit-text">OPTIC VIEW</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
