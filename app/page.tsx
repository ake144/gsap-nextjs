"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import Link from "next/link"
import { ArrowUpRight, Code2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ProjectsData } from "@/lib/data"
import ModernButton from "@/components/button"

gsap.registerPlugin(ScrollTrigger)

const ModernScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main horizontal scroll animation
      const totalProjects = ProjectsData.length
      const totalWidth = isMobile ? totalProjects * 100 : (totalProjects - 1) * 80

      const pin = gsap.fromTo(
        sectionRef.current,
        {
          x: "0",
        },
        {
          x: `-${totalWidth}vw`,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${totalProjects * 1000}`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              // Update progress bar
              if (progressRef.current) {
                gsap.to(progressRef.current, {
                  width: `${self.progress * 100}%`,
                  duration: 0.1,
                })
              }

              // Update active index
              const newIndex = Math.min(Math.floor(self.progress * totalProjects), totalProjects - 1)
              setActiveIndex(newIndex)
            },
          },
        },
      )

      // Parallax effect for each project card
      gsap.utils.toArray(".project-card").forEach((card: any, i) => {
        gsap.fromTo(
          card.querySelector(".project-image"),
          {
            scale: 1.1,
            y: 0,
          },
          {
            scale: 1,
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: pin,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        )

        // Fade in text elements with slight delay
        gsap.fromTo(
          card.querySelector(".project-content"),
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: pin,
              start: "left center",
              end: "center center",
              scrub: true,
            },
          },
        )
      })

      return () => pin.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  const scrollToProject = (index: number) => {
    if (!triggerRef.current) return

    const scrollTrigger = ScrollTrigger.getById("project-scroll")
    if (scrollTrigger) {
      const progress = index / (ProjectsData.length - 1)
      scrollTrigger.scroll(scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * progress)
    } else {
      // Fallback if ScrollTrigger isn't available
      const totalHeight = triggerRef.current.scrollHeight - window.innerHeight
      const targetScroll = (index / (ProjectsData.length - 1)) * totalHeight
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-800 z-50">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-0"></div>
      </div>

      {/* Navigation dots */}
      {/* <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {ProjectsData.map((_, index) => (
          <button
            key={`nav-${index}`}
            onClick={() => scrollToProject(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeIndex === index ? "bg-white scale-125" : "bg-zinc-600 hover:bg-zinc-400",
            )}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Section title */}
      <div className="fixed left-8 top-8 mb-15 z-40 mix-blend-difference">
        <h2 className="text-xl font-bold tracking-tight">
          <span className="text-white/70">Featured</span> Projects
        </h2>
      </div>

      {/* Mobile navigation buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-4 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToProject(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="bg-black/50 backdrop-blur-md border-zinc-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToProject(Math.min(ProjectsData.length - 1, activeIndex + 1))}
          disabled={activeIndex === ProjectsData.length - 1}
          className="bg-black/50 backdrop-blur-md border-zinc-700"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div ref={triggerRef} className="h-screen">
        <div
          ref={sectionRef}
          className="flex h-screen items-center"
          style={{ width: `${ProjectsData.length * 100}vw` }}
        >
          {ProjectsData.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "project-card w-screen md:w-[80vw] h-screen flex items-center justify-center px-4 md:px-12 lg:px-24",
                index === activeIndex ? "opacity-100" : "opacity-80",
              )}
            >
              <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                {/* Project image with parallax effect */}
                <div className="project-image relative w-full md:w-3/5 h-[40vh] md:h-[60vh] overflow-hidden rounded-2xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />

                  {/* Floating tags */}
                  {/* <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {project.tag?.map((tag, i) => (
                      <Badge key={i} className="bg-black/60 backdrop-blur-md text-white border-0 px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div> */}

                  {/* Hover overlay with links */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link
                      href={project.gitUrl}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-all"
                    >
                      <Code2 className="h-3 w-4" />
                      <span className="text-xs mr-7 ">Code</span>
                    </Link>
                    <Link
                      href={project.previewUrl}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="text-xs pr-7">Preview</span>
                    </Link>
                  </div>
                </div>

                {/* Project content */}
                <div className="project-content w-full md:w-2/5 space-y-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {project.title}
                    </h3>
                    <p className="text-lg text-zinc-400 max-w-md">{project.description}</p>
                  </div>

                  {/* Project details */}
                  <div className="space-y-20">
                    {/* {project.description && (
                      <div className="space-y-2">
                        <h4 className="text-sm uppercase tracking-wider text-zinc-500">Key Features</h4>
                        <ul className="grid grid-cols-2 gap-2">
                          {project.description.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-zinc-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}

                    <div className="flex items-center gap-4 my-19"> 
                      <ModernButton   
                        children="Explore Project"
                        onClick={() => scrollToProject(index)}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModernScrollSection
