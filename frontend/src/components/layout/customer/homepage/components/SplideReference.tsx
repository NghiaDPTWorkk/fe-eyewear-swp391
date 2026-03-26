import { useEffect } from 'react'
import Splide from '@splidejs/splide'
import '@splidejs/splide/css'

export const SplideReference = () => {
  useEffect(() => {
    const outerSlider = new Splide('#outer-slider', {
      type: 'loop',
      height: '20rem',
      pagination: true,
      arrows: true
    })

    const innerSlider = new Splide('#inner-slider', {
      type: 'loop',
      height: '10rem',
      perPage: 2,
      gap: '1rem',
      pagination: true,
      arrows: true
    })

    outerSlider.mount()
    innerSlider.mount()

    // 3. Cleanup on unmount
    return () => {
      outerSlider.destroy()
      innerSlider.destroy()
    }
  }, [])

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-black mb-8 tracking-tight">Nested Slider</h2>

        {/* Documentation Style Wrapper */}
        <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="p-12 md:p-20 flex flex-col items-center justify-center">
            {/* Outer Splide (ID: outer-slider) */}
            <div
              id="outer-slider"
              className="splide w-full border border-white/10 rounded-lg p-8 bg-[#151515]"
            >
              <div className="splide__track">
                <ul className="splide__list">
                  <li className="splide__slide flex items-center justify-center">
                    {/* Inner Splide (ID: inner-slider) */}
                    <div id="inner-slider" className="splide w-full">
                      <div className="splide__track">
                        <ul className="splide__list">
                          <li className="splide__slide">
                            <div className="h-full bg-[#bada55] rounded-md flex items-center justify-center">
                              <span className="text-8xl font-black text-black/20 select-none">
                                01
                              </span>
                            </div>
                          </li>
                          <li className="splide__slide">
                            <div className="h-full bg-[#444] rounded-md flex items-center justify-center">
                              <span className="text-8xl font-black text-white/10 select-none">
                                02
                              </span>
                            </div>
                          </li>
                          <li className="splide__slide">
                            <div className="h-full bg-[#bada55] rounded-md flex items-center justify-center">
                              <span className="text-8xl font-black text-black/20 select-none">
                                03
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Docs Tab bar */}
          <div className="bg-[#111] border-t border-white/5 px-6 py-4 flex justify-end gap-8 text-[13px] font-bold text-gray-500 uppercase tracking-widest">
            <button className="hover:text-white transition-colors cursor-pointer">Code</button>
            <button className="text-white border-b-2 border-[#bada55] pb-3 -mb-4 transition-all cursor-pointer">
              Preview
            </button>
          </div>
        </div>

        {/* Visual Styling Overrides to match exactly the screenshot */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          #outer-slider, #inner-slider {
            max-width: 100%;
          }
          
          /* Dot styling (neon green badge color #bada55) */
          .splide__pagination__page.is-active {
            background: #bada55 !important;
            transform: scale(1.2);
          }
          .splide__pagination__page {
            background: #555;
            opacity: 1;
            margin: 3px;
          }
          
          /* Arrow styling */
          .splide__arrow {
            background: transparent !important;
            opacity: 1;
          }
          .splide__arrow svg {
            fill: #aaa !important;
            width: 2rem;
            height: 2rem;
          }
          .splide__arrow:hover svg {
            fill: white !important;
          }

          /* Spacing pagination */
          #inner-slider .splide__pagination {
            bottom: -2.5rem !important;
          }
          #outer-slider > .splide__pagination {
            bottom: -5rem !important;
          }
          
          /* Align arrows for Nested view */
          #outer-slider .splide__arrow--prev { left: -4rem !important; }
          #outer-slider .splide__arrow--next { right: -4rem !important; }
          #inner-slider .splide__arrow--prev { left: -2.5rem !important; }
          #inner-slider .splide__arrow--next { right: -2.5rem !important; }
        `
          }}
        />
      </div>
    </section>
  )
}
