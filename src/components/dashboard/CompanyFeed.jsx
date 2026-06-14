import { useState } from 'react'
import { Settings, Megaphone, ThumbsUp, Gift, BarChart2, Video } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

const FEED_TABS = ['Announcement', 'Poll', 'Video', 'Event']

const INITIAL_FEED = [
  {
    id:1, tab:'Announcement', type:'announcement',
    user:'Neha Kapoor', role:'HR Manager', time:'Today 10:30 AM',
    icon:Megaphone, iconBg:'bg-amber-100', iconColor:'text-amber-600',
    content:'Q2 appraisals start from June 15. Please complete your self-assessments before the deadline.',
    likes:12, comments:3,
  },
  {
    id:2, tab:'Announcement', type:'appreciation',
    user:'Arjun Singh', praised:'Kriti Verma', time:'Today 11:10 AM',
    icon:ThumbsUp, iconBg:'bg-blue-100', iconColor:'text-blue-600',
    badge:'🥇', title:'Excellent Execution!',
    content:"Arjun's dedication and focus on delivering quality results has been truly outstanding.",
    likes:24, comments:5,
  },
  {
    id:3, tab:'Announcement', type:'birthday',
    time:'This week · 5 people',
    icon:Gift, iconBg:'bg-pink-100', iconColor:'text-pink-600',
    title:'Celebrating Birthdays',
    users:['Alice','Manjuna','Kedhar','Divya','Ritika'],
    likes:18, comments:8,
  },
  {
    id:4, tab:'Poll', type:'poll',
    user:'Pooja Iyer', time:'Yesterday',
    icon:BarChart2, iconBg:'bg-violet-100', iconColor:'text-violet-600',
    question:'Which activity would you prefer for our team building this quarter?',
    options:[
      { label:'Adventure Trek',       pct:50, color:'bg-violet-500', votes:20 },
      { label:'Workshop & Learning',  pct:30, color:'bg-emerald-500',votes:12 },
      { label:'Beach Outing',         pct:20, color:'bg-blue-500',   votes:8  },
    ],
    totalVotes:40,
  },
  {
    id:5, tab:'Video', type:'video',
    user:'HR Team', role:'Administration', time:'2 days ago',
    icon:Video, iconBg:'bg-red-100', iconColor:'text-red-600',
    title:'FY2024 Company Town Hall Recording',
    content:'Watch the full recording of our annual town hall session with the leadership team.',
    videoUrl:'https://www.w3schools.com/html/mov_bbb.mp4',
    likes:56, comments:14,
  },
]

export default function CompanyFeed({ extraPosts = [] }) {
  const [tab, setTab] = useState('Announcement')
  const [feed, setFeed] = useState(INITIAL_FEED)
  const allFeed = [...extraPosts.map(p => ({...p, tab:'Announcement'})), ...feed]
  const filtered = tab === 'Announcement' ? allFeed.filter(f => f.tab === 'Announcement' || !f.tab) : allFeed.filter(f => f.tab === tab)

  const handleLike = (id) => setFeed(f => f.map(x => x.id === id ? {...x, likes: x.likes+1} : x))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-700 text-text-primary text-sm">Company Updates</h3>
          <Settings size={12} className="text-text-muted cursor-pointer"/>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-4">
        {FEED_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-2.5 text-xs font-600 border-b-2 transition-colors flex-shrink-0
              ${tab===t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filtered.length === 0 && (
          <p className="text-xs text-text-muted text-center py-8">No {tab.toLowerCase()} posts yet.</p>
        )}

        {filtered.map((item) => {
          const Icon = item.icon || Megaphone
          return (
            <div key={item.id} className="px-4 py-3.5">

              {/* Announcement / Appreciation / Birthday share header */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full ${item.iconBg||'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={item.iconColor||'text-slate-500'}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-700 text-text-primary capitalize">{item.type?.replace('_',' ')}</span>
                    <span className="text-[10px] text-text-muted">{item.time}</span>
                  </div>
                </div>
              </div>

              {/* Announcement */}
              {item.type === 'announcement' && (
                <>
                  <p className="text-[11px] font-600 text-primary mb-1">{item.user}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.content}</p>
                </>
              )}

              {/* Post (from composer) */}
              {item.type === 'post' && (
                <>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar name={item.user} size="sm"/>
                    <div>
                      <p className="text-[11px] font-700 text-text-primary">{item.user}</p>
                      <p className="text-[10px] text-text-muted">{item.role || ''}</p>
                    </div>
                  </div>
                  {item.text && <p className="text-xs text-text-secondary leading-relaxed mb-1.5">{item.text}</p>}
                  {item.media?.type === 'image' && (
                    <img src={item.media.preview} alt="" className="rounded-lg border border-border w-full max-h-40 object-cover"/>
                  )}
                  {item.media?.type === 'video' && (
                    <video src={item.media.preview} controls className="rounded-lg border border-border w-full max-h-40"/>
                  )}
                </>
              )}

              {/* Appreciation */}
              {item.type === 'appreciation' && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.badge}</span>
                    <Avatar name={item.user} size="sm"/>
                    <p className="text-[11px] text-text-secondary">
                      <span className="font-600 text-primary">{item.user}</span> received appreciation from <span className="font-600 text-primary">{item.praised}</span>
                    </p>
                  </div>
                  <p className="text-xs font-700 text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.content}</p>
                </>
              )}

              {/* Birthday */}
              {item.type === 'birthday' && (
                <>
                  <p className="text-xs font-700 text-text-primary mb-0.5">{item.title}</p>
                  <p className="text-[10px] text-text-muted mb-2">{item.time}</p>
                  <div className="flex gap-3">
                    {item.users?.slice(0,4).map((u,j) => (
                      <div key={j} className="flex flex-col items-center gap-1">
                        <Avatar name={u} size="sm"/>
                        <span className="text-[9px] text-text-muted">{u}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Poll */}
              {item.type === 'poll' && (
                <>
                  <p className="text-[11px] font-600 text-primary mb-1">{item.user} created a poll</p>
                  <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">{item.question}</p>
                  <div className="space-y-2">
                    {item.options?.map((o,j) => (
                      <div key={j}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-text-secondary">{o.label}</span>
                          <span className="font-700 text-text-primary">{o.pct}% ({o.votes})</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${o.color} rounded-full`} style={{width:`${o.pct}%`}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1.5">Total Votes: {item.totalVotes}</p>
                  <button className="text-xs font-600 text-primary hover:underline mt-1">View Poll</button>
                </>
              )}

              {/* Video */}
              {item.type === 'video' && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={item.user} size="sm"/>
                    <div>
                      <p className="text-[11px] font-700 text-text-primary">{item.user}</p>
                      <p className="text-[10px] text-text-muted">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-xs font-600 text-text-primary mb-1">{item.title}</p>
                  <p className="text-xs text-text-secondary mb-2 leading-relaxed">{item.content}</p>
                  <video src={item.videoUrl} controls className="w-full rounded-lg border border-border max-h-36"/>
                </>
              )}

              {/* Like / Comment row */}
              {item.likes !== undefined && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                  <button onClick={() => handleLike(item.id)} className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors">
                    👍 <span>{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors">
                    💬 <span>{item.comments}</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}