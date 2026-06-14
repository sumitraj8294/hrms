import { useState, useRef } from 'react'
import { Plus, Image, Video, FileText, X, Send, Smile } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'

const INITIAL_POSTS = [
  {
    id: 1, user: 'Neha Kapoor', role: 'HR Manager', time: 'Today 10:30 AM',
    text: 'Q2 appraisals start from June 15. Please complete your self-assessments before the deadline.',
    type: 'text', likes: 12, comments: 3,
  },
  {
    id: 2, user: 'Raj Mehta', role: 'Admin', time: 'Yesterday 9:00 AM',
    text: 'Office will remain closed on June 12 for scheduled maintenance. Work from home on that day.',
    type: 'text', likes: 8, comments: 1,
  },
]

function PostComposer({ onPost }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [media, setMedia] = useState(null)   // { type, preview, file }
  const [mediaType, setMediaType] = useState(null)
  const imgRef = useRef()
  const vidRef = useRef()

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setMedia({ type, preview, name: file.name })
    setMediaType(type)
  }

  const submit = () => {
    if (!text.trim() && !media) return
    onPost({ text, media, type: mediaType || 'text' })
    setText('')
    setMedia(null)
    setMediaType(null)
  }

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-3">
      <div className="flex gap-3">
        <Avatar name={user?.name || 'U'} size="sm"/>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share an announcement, update or appreciation…"
            rows={2}
            className="w-full text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
          />

          {/* Media preview */}
          {media && (
            <div className="relative mt-2 inline-block">
              {media.type === 'image' ? (
                <img src={media.preview} alt="preview" className="max-h-40 rounded-lg border border-border object-cover"/>
              ) : media.type === 'video' ? (
                <video src={media.preview} className="max-h-40 rounded-lg border border-border" controls/>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-border rounded-lg text-xs text-text-secondary">
                  <FileText size={14}/>{media.name}
                </div>
              )}
              <button
                onClick={() => { setMedia(null); setMediaType(null) }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X size={10}/>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              {/* Image upload */}
              <button
                onClick={() => imgRef.current.click()}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-text-muted hover:bg-slate-50 hover:text-blue-500 transition-colors text-xs font-500"
              >
                <Image size={14}/><span>Photo</span>
              </button>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e,'image')}/>

              {/* Video upload */}
              <button
                onClick={() => vidRef.current.click()}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-text-muted hover:bg-slate-50 hover:text-violet-500 transition-colors text-xs font-500"
              >
                <Video size={14}/><span>Video</span>
              </button>
              <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={e => handleFile(e,'video')}/>

              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md text-text-muted hover:bg-slate-50 hover:text-amber-500 transition-colors text-xs font-500">
                <Smile size={14}/><span>Emoji</span>
              </button>
            </div>

            <button
              onClick={submit}
              disabled={!text.trim() && !media}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-600 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={12}/> Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, onLike }) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-2">
      <div className="flex items-start gap-3">
        <Avatar name={post.user} size="sm"/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-700 text-text-primary">{post.user}</p>
            <p className="text-[10px] text-text-muted">{post.role}</p>
            <p className="text-[10px] text-text-muted ml-auto">{post.time}</p>
          </div>
          {post.text && <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{post.text}</p>}
          {post.media?.type === 'image' && (
            <img src={post.media.preview} alt="" className="mt-2 rounded-lg border border-border max-h-52 object-cover w-full"/>
          )}
          {post.media?.type === 'video' && (
            <video src={post.media.preview} controls className="mt-2 rounded-lg border border-border w-full max-h-52"/>
          )}
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
            <button onClick={() => onLike(post.id)} className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors">
              <span>👍</span><span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors">
              <span>💬</span><span>{post.comments} comments</span>
            </button>
            <button className="text-[11px] text-text-muted hover:text-primary transition-colors ml-auto">Share</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrgAnnouncements() {
  const [posts, setPosts] = useState(INITIAL_POSTS)

  const handlePost = ({ text, media, type }) => {
    const newPost = {
      id: Date.now(), user: 'You', role: 'HR Manager', time: 'Just now',
      text, media, type, likes: 0, comments: 0,
    }
    setPosts(p => [newPost, ...p])
  }

  const handleLike = (id) => setPosts(p => p.map(x => x.id === id ? { ...x, likes: x.likes + 1 } : x))

  return (
    <div>
      <PostComposer onPost={handlePost}/>
      {posts.map(p => <PostCard key={p.id} post={p} onLike={handleLike}/>)}
    </div>
  )
}