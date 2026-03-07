import type { Voucher } from '@/shared/types'
import { fmtVND, fmtDate } from '@/components/layout/staff/managerstaff/vouchertable/VoucherTdata'
import { VoucherDiscountType } from '@/shared/utils/enums/voucher.enum'

interface Props {
  voucher: Voucher
}

export default function VoucherTicketSpecification({ voucher: v }: Props) {
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

        .ticket-container {
          position: relative;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.12));
          width: fit-content;
          margin: 0 auto;
          font-family: "Montserrat", sans-serif;
          transform-style: preserve-3d;
        }

        .spec-tag {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #2d4f45;
          color: white;
          font-size: 10px;
          font-weight: 900;
          padding: 5px 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom-right-radius: 10px;
          z-index: 20;
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
        }

        .ticket {
          display: flex;
          width: 820px;
          height: 280px;
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
          border-radius: 6px;
        }

        .bg-pattern {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 15px,
            #e3f4f0 15px,
            #e3f4f0 16px
          );
          opacity: 0.6;
        }

        .bg-gradient {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 20%,
            white 90%
          );
          z-index: 2;
        }

        .vt-edge {
          position: absolute;
          top: 0;
          width: 16px;
          height: 100%;
          background-image: radial-gradient(
            circle,
            #1e3d6e 8px,
            transparent 9px
          );
          background-size: 32px 32px;
          background-position: center;
          z-index: 10;
        }
        .vt-edge-left { left: -8px; }
        .vt-edge-right { right: -8px; }

        .main-border {
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border: 1.5px solid #2d4f45;
          z-index: 5;
          display: flex;
        }

        .content-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          border-right: 3px dashed #404343;
        }

        .system-name {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 5px;
          color: #1a3d34;
          text-transform: uppercase;
          margin-top: 10px;
          text-align: center;
        }

        .discount-title {
          text-align: center;
          color: #2d4f45;
        }

        .val {
          font-size: 85px;
          font-weight: 900;
          line-height: 0.8;
          display: block;
          text-shadow: 4px 4px 0px #e3f4f0;
        }
        .lbl {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 10px;
          display: block;
          margin-top: 10px;
          opacity: 0.9;
        }

        .date-box {
          font-family: "Playfair Display", serif;
          font-style: italic;
          font-size: 18px;
          color: #2d4f45;
          border-top: 1px solid #cbd5d1;
          padding-top: 10px;
          width: 80%;
          text-align: center;
        }

        .content-right {
          width: 220px;
          display: flex;
          padding: 10px;
          box-sizing: border-box;
          align-items: center;
          justify-content: center;
        }

        .barcode-wrapper {
          display: flex;
          height: 100%;
          position: relative;
          align-items: stretch;
        }

        .bars {
          width: 55px;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            #2d4f45,
            #2d4f45 2px,
            transparent 2px,
            transparent 5px
          );
          opacity: 0.8;
        }

        .barcode-numbers {
          writing-mode: vertical-rl;
          font-size: 7.5px;
          font-weight: 700;
          color: #2d4f45;
          display: flex;
          justify-content: space-between;
          height: 100%;
          margin-left: 10px;
          letter-spacing: 0.5px;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .admit-text {
          writing-mode: vertical-rl;
          font-size: 32px;
          font-weight: 900;
          color: #2d4f45;
          letter-spacing: 3px;
          margin-left: 20px;
          text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>

      <div className="ticket-container scale-[0.85] origin-top">
        <div className="spec-tag">Specification</div>

        <div className="vt-edge vt-edge-left"></div>
        <div className="vt-edge vt-edge-right"></div>

        <div className="ticket">
          <div className="bg-pattern"></div>
          <div className="bg-gradient"></div>

          <div className="main-border">
            <div className="content-left">
              <div className="system-name">{v.name}</div>

              <div className="discount-title">
                <span className="val">
                  {isPerc ? `${v.value}%` : fmtVND(v.value)}
                </span>
                <span className="lbl">DISCOUNT</span>
              </div>

              <div className="date-box">{dateRange}</div>
            </div>

            <div className="content-right">
              <div className="barcode-wrapper">
                <div className="bars"></div>
                <div className="barcode-numbers font-mono">
                  <span>SPEC-{v.code.slice(0, 4)}</span>
                  <span className="opacity-40">{v._id}</span>
                  <span>{v.code}</span>
                </div>
              </div>
              <div className="admit-text">OPTIC VIEW</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
