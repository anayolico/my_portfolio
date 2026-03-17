import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image2 from "../components/ima-and/ima2..jpg";
import image1 from "../components/ima-and/ima1.png";

export default function About(){

	const [currentImage, setCurrentImage] = useState(0)

	const images = [image1, image2]
	// cycle profile images every 3 seconds
	useEffect(()=>{
		const interval = setInterval(()=>{
			setCurrentImage(i => (i + 1) % images.length)
		}, 7000)
		return () => clearInterval(interval)
	}, [images.length])

	return (
		<section id="about" className="py-16 space-y-12">
			{/* Main intro section */}
			<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
				<div className="md:col-span-2">
					<h2 className="text-3xl font-bold text-white mb-4">About Me</h2>
					<p className="text-gray-300 mb-4 leading-relaxed">I'm Anayolico — a passionate Web Developer and Java Programmer dedicated to crafting modern, responsive, and beautifully animated web experiences. With a keen eye for UX/UI and a strong foundation in both frontend and backend development, I transform complex requirements into elegant, performant solutions that users love.</p>
          
					<p className="text-gray-300 mb-4 leading-relaxed">My approach combines technical excellence with creative design thinking. I believe in writing clean, maintainable code and creating interfaces that not only look stunning but are also intuitive and accessible. Every project is an opportunity to learn something new and push my skills further.</p>

					<h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
					<div className="flex flex-wrap gap-2 mb-6">
						{['HTML','CSS','JavaScript','React','Java','Node.js','Git','Next.js'].map(s => (
							<motion.span key={s} whileHover={{y:-2, color: "rgba(192,132,252,0.95)"}} className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 text-neon-cyan rounded text-sm border border-gray-700"	
							>{s}</motion.span>
						))}
					</div>
				</div>

				<div className="flex justify-center md:justify-end">
					<motion.div 
						className="w-56 h-56 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple p-1 flex items-center justify-center" 
						whileHover={{ rotate: 3, scale: 1.02 }} 
						transition={{type:'spring'}}
					>
						<div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
							<AnimatePresence mode="wait">
								<motion.img
									key={currentImage}
									src={images[currentImage]}
									alt="Anayolico"
									className="w-full h-full object-cover"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								/>
							</AnimatePresence>
						</div>
					</motion.div>
				</div>
			</motion.div>

			{/* Experience section */}
			<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-panel p-6 rounded-xl neon-glow">
				<h3 className="text-2xl font-bold text-white mb-4">Experience & Journey</h3>
				<div className="space-y-4">
					<div className="border-l-2 border-neon-cyan pl-4">
						<h4 className="text-lg font-semibold text-neon-cyan">Full Stack Developer</h4>
						
						<p className="text-gray-300 mt-1">Building web applications using React, Node.js, and database technologies. Focus on responsive design, performance optimization, and seamless user experiences.</p>
					</div>
					<div className="border-l-2 border-neon-purple pl-4">
						<h4 className="text-lg font-semibold text-neon-purple">Java Backend Developer</h4>
					
						<p className="text-gray-300 mt-1">Developed robust backend systems and APIs using Java. Worked with databases, implemented business logic, and ensured system scalability.</p>
					</div>
					<div className="border-l-2 border-gray-600 pl-4">
						<h4 className="text-lg font-semibold text-gray-200">Frontend Developer (Freelance)</h4>
						
						<p className="text-gray-300 mt-1">Created responsive websites and web applications. Collaborated with clients to deliver pixel-perfect designs and intuitive interfaces.</p>
					</div>
				</div>
			</motion.div>

			{/* What I do section */}
			<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-panel p-6 rounded-xl neon-glow">
					<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-blue-500 flex items-center justify-center mb-4">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" />
						</svg>
					</div>
					<h4 className="text-lg font-semibold text-white mb-2">Web Design & UI/UX</h4>
					<p className="text-gray-300 text-sm">Creating beautiful, user-centered interfaces with smooth animations and intuitive interactions.</p>
				</div>

				<div className="bg-panel p-6 rounded-xl neon-glow">
					<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple to-pink-500 flex items-center justify-center mb-4">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M9.4 16.6L4.8 12l-1.4 1.4L9.4 19 21 7.4 19.6 6z" fill="currentColor" />
						</svg>
					</div>
					<h4 className="text-lg font-semibold text-white mb-2">Frontend Development</h4>
					<p className="text-gray-300 text-sm">Building responsive, performant web applications with React, JavaScript, and modern CSS frameworks.</p>
				</div>

				<div className="bg-panel p-6 rounded-xl neon-glow">
					<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor" />
						</svg>
					</div>
					<h4 className="text-lg font-semibold text-white mb-2">Backend & Databases</h4>
					<p className="text-gray-300 text-sm">Building scalable APIs and database systems with Java and Node.js.</p>
				</div>
			</motion.div>

			{/* Skills highlight section */}
			<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-panel p-6 rounded-xl neon-glow">
				<h3 className="text-2xl font-bold text-white mb-6">Key Strengths</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-start gap-3">
						<div className="w-2 h-2 rounded-full bg-neon-cyan mt-2 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-white">Problem Solving</h4>
							<p className="text-sm text-gray-300">Breaking down complex problems into elegant, scalable solutions.</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="w-2 h-2 rounded-full bg-neon-cyan mt-2 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-white">Performance Optimization</h4>
							<p className="text-sm text-gray-300">Building fast, efficient applications that deliver great user experiences.</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="w-2 h-2 rounded-full bg-neon-purple mt-2 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-white">Responsive Design</h4>
							<p className="text-sm text-gray-300">Creating applications that work flawlessly across all devices and screen sizes.</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="w-2 h-2 rounded-full bg-neon-purple mt-2 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-white">Collaboration</h4>
							<p className="text-sm text-gray-300">Working effectively with teams and clients to achieve project goals.</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Call to action */}
			<motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="text-center">
				<p className="text-gray-300 mb-4">Ready to work together? Let's create something amazing!</p>
				<a href="#contact">
					<motion.button whileHover={{scale:1.05}} className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold rounded-lg">Get In Touch</motion.button>
				</a>
			</motion.div>
		</section>
	)
}

