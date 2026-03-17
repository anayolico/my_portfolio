import React, { useEffect, useRef } from 'react'

/*
 BackgroundParticles.jsx

 A lightweight, dependency-free canvas particles background.
 - Fixed full-screen canvas
 - Small glowing neon dots
 - Smooth floating motion
 - Subtle connecting lines between nearby particles
 - Pointer-events disabled so it doesn't interfere with UI
 - Optimized: particle count scales with screen size, frame skipping to cap FPS

 Usage: place <BackgroundParticles /> once (e.g. inside Layout) so it stays behind content.
*/
export default function BackgroundParticles(){
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const resizeTimer = useRef(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight
    let DPR = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * DPR)
    canvas.height = Math.floor(height * DPR)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(DPR, DPR)

    // Settings
    const baseCount = Math.round((width * height) / 90000) // ~1 per 300x300 area
    const PARTICLE_COUNT = Math.max(30, Math.min(160, baseCount))
    const MAX_DISTANCE = 120 // px to draw connecting line

    // Colors: neon cyan and purple gradient mix
    const colors = [ 'rgba(0,240,255,0.95)', 'rgba(192,132,252,0.95)' ]

    // Particle data
    const particles = []
    for(let i=0;i<PARTICLE_COUNT;i++){
      particles.push({
        x: Math.random()*width,
        y: Math.random()*height,
        r: 0.8 + Math.random()*1.6, // radius
        vx: (Math.random()-0.5) * 0.3, // slow horizontal drift
        vy: (Math.random()-0.5) * 0.3, // slow vertical drift
        hue: Math.random(),
      })
    }

    // Performance: target 45 FPS
    const TARGET_FPS = 45
    const FRAME_INTERVAL = 1000 / TARGET_FPS
    let lastTime = performance.now()

    function draw(now){
      rafRef.current = requestAnimationFrame(draw)
      const delta = now - lastTime
      if(delta < FRAME_INTERVAL) return // skip frame
      lastTime = now

      // clear
      ctx.clearRect(0,0,width,height)
      // dark background (transparent so underlying tailwind bg shows)
      // ctx.fillStyle = 'rgba(10,10,12,1)'
      // ctx.fillRect(0,0,width,height)

      // draw particles
      for(let p of particles){
        // Motion with slight wandering using small acceleration
        p.x += p.vx
        p.y += p.vy

        // slow noise-like movement
        p.vx += (Math.random()-0.5) * 0.02
        p.vy += (Math.random()-0.5) * 0.02

        // keep within bounds with soft wrapping
        if(p.x < -20) p.x = width + 20
        if(p.x > width + 20) p.x = -20
        if(p.y < -20) p.y = height + 20
        if(p.y > height + 20) p.y = -20

        // draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*12)
        const c = interpolateColor(colors[0], colors[1], p.hue)
        gradient.addColorStop(0, withAlpha(c, 0.85))
        gradient.addColorStop(0.4, withAlpha(c, 0.25))
        gradient.addColorStop(1, withAlpha(c, 0))
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r*8, 0, Math.PI*2)
        ctx.fill()

        // core
        ctx.fillStyle = withAlpha(c, 1)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fill()
      }

      // draw lines between close particles
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if(dist < MAX_DISTANCE){
            const t = 1 - dist / MAX_DISTANCE
            const alpha = t * 0.18
            // mix colors
            const mix = interpolateColor(colors[0], colors[1], (a.hue + b.hue)/2)
            ctx.strokeStyle = withAlpha(mix, alpha)
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw)

    // resize handler with debounce
    function handleResize(){
      clearTimeout(resizeTimer.current)
      resizeTimer.current = setTimeout(()=>{
        width = window.innerWidth
        height = window.innerHeight
        DPR = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.floor(width * DPR)
        canvas.height = Math.floor(height * DPR)
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.setTransform(DPR,0,0,DPR,0,0)
        // reinitialize particles count to suit new size (simple approach)
        const newCount = Math.max(30, Math.min(160, Math.round((width * height) / 90000)))
        while(particles.length < newCount) particles.push({x:Math.random()*width,y:Math.random()*height,r:0.8+Math.random()*1.6,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,hue:Math.random()})
        while(particles.length > newCount) particles.pop()
      }, 150)
    }

    window.addEventListener('resize', handleResize)

    return ()=>{
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer.current)
    }
  }, [])

  // helpers
  function withAlpha(rgbaStr, a){
    // input like 'rgba(r,g,b,a)'
    try{
      const inner = rgbaStr.slice(rgbaStr.indexOf('(')+1, rgbaStr.lastIndexOf(')')).split(',')
      return `rgba(${inner[0].trim()},${inner[1].trim()},${inner[2].trim()},${a})`
    }catch(e){
      return rgbaStr
    }
  }

  function interpolateColor(a,b,t){
    // a,b are rgba strings, t in [0,1]
    const pa = a.replace(/rgba?\(|\s|\)/g,'').split(',').map(Number)
    const pb = b.replace(/rgba?\(|\s|\)/g,'').split(',').map(Number)
    const r = Math.round(pa[0] + (pb[0]-pa[0])*t)
    const g = Math.round(pa[1] + (pb[1]-pa[1])*t)
    const bl = Math.round(pa[2] + (pb[2]-pa[2])*t)
    return `rgba(${r},${g},${bl},1)`
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 w-full h-full"
      aria-hidden="true"
    />
  )
}
