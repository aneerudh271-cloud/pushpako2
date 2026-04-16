"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LeaderCard from './LeaderCard'

const TeamCarousel = ({ members }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 1 },
            '(min-width: 1024px)': { slidesToScroll: 1 },
            '(min-width: 1280px)': { slidesToScroll: 1 }
        }
    })

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback((emblaApi) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect)
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    return (
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 mb-24">
            {/* Navigation Buttons - Absolute positioning for larger screens, standard for mobile */}
            <div className="hidden lg:block">
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 rounded-full w-12 h-12 border-white/10 bg-black/50 backdrop-blur-sm hover:bg-[#07C5EB] hover:text-white hover:border-[#07C5EB] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                    onClick={scrollPrev}
                    disabled={prevBtnDisabled}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 rounded-full w-12 h-12 border-white/10 bg-black/50 backdrop-blur-sm hover:bg-[#07C5EB] hover:text-white hover:border-[#07C5EB] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                    onClick={scrollNext}
                    disabled={nextBtnDisabled}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="overflow-hidden p-4 -m-4" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom -ml-4 md:-ml-6 xl:-ml-8">
                    {members.map((member, index) => (
                        <div
                            key={member.id || index}
                            className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] min-w-0 pl-4 md:pl-6 xl:pl-8"
                        >
                            <div className="h-full">
                                <LeaderCard member={member} index={index} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile/Tablet Controls underneath */}
            <div className="flex justify-center gap-4 mt-8 lg:hidden">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-white/10 bg-white/5 hover:bg-[#07C5EB] hover:text-white hover:border-[#07C5EB] transition-all disabled:opacity-30"
                    onClick={scrollPrev}
                    disabled={prevBtnDisabled}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-white/10 bg-white/5 hover:bg-[#07C5EB] hover:text-white hover:border-[#07C5EB] transition-all disabled:opacity-30"
                    onClick={scrollNext}
                    disabled={nextBtnDisabled}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}

export default TeamCarousel
