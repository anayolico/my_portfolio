import React from 'react'
import SkillBadge from '../components/SkillBadge.jsx'

export default function Skills(){
  const frontend = [
    {name:'HTML',level:90},{name:'CSS',level:88},{name:'JavaScript',level:85},{name:'React',level:82}
  ]
  const backend = [{name:'Java',level:75},{name:'Node.js',level:60}, {name:'mongoDB',level:70}]
  const tools = [{name:'Git',level:82}]

  return (
    <section id="skills" className="py-16">
      <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Frontend</h3>
          <div className="flex flex-col gap-3">
            {frontend.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Backend / Logic</h3>
          <div className="flex flex-col gap-3">
            {backend.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Tools</h3>
          <div className="flex flex-col gap-3">
            {tools.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
