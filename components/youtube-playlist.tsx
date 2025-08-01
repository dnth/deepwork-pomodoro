"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Trees, Flame, Cloud, Waves, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface AmbientCategory {
  id: string
  name: string
  icon: React.ReactNode
  videoId: string
  description: string
}

const ambientCategories: AmbientCategory[] = [
  {
    id: "fireplace",
    name: "Fireplace",
    icon: <Flame className="w-6 h-6" />,
    videoId: "L_LUpnjgPso", // Fireplace crackling
    description: "Cozy fire sounds",
  },
  {
    id: "rain",
    name: "Rain",
    icon: <Cloud className="w-6 h-6" />,
    videoId: "mPZkdNFkNps", // Rain sounds
    description: "Gentle rainfall",
  },
  {
    id: "waves",
    name: "Waves",
    icon: <Waves className="w-6 h-6" />,
    videoId: "WHPEKLQID4U", // Ocean waves
    description: "Ocean ambience",
  },
  {
    id: "forest",
    name: "Forest",
    icon: <Trees className="w-6 h-6" />,
    videoId: "xNN7iTA57jM", // Forest sounds
    description: "Nature sounds",
  },
]

export function YoutubePlaylist() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const playerRef = useRef<any>(null)
  const [customVideoUrl, setCustomVideoUrl] = useState("")
  const [customVideoId, setCustomVideoId] = useState<string | null>(null)
  const [isPlaylist, setIsPlaylist] = useState(false)
  const [playlistId, setPlaylistId] = useState<string | null>(null)

  const extractVideoId = (url: string): { videoId: string | null; playlistId: string | null } => {
    // Extract playlist ID
    const playlistRegex = /[?&]list=([^&]+)/
    const playlistMatch = url.match(playlistRegex)
    const playlistId = playlistMatch ? playlistMatch[1] : null

    // Extract video ID
    const videoRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const videoMatch = url.match(videoRegex)
    const videoId = videoMatch ? videoMatch[1] : null

    return { videoId, playlistId }
  }

  const handleCustomVideo = () => {
    const { videoId, playlistId } = extractVideoId(customVideoUrl)
    
    if (playlistId) {
      setPlaylistId(playlistId)
      setIsPlaylist(true)
      setActiveCategory("custom")
      setIsPlaying(true)
    } else if (videoId) {
      setCustomVideoId(videoId)
      setIsPlaylist(false)
      setPlaylistId(null)
      setActiveCategory("custom")
      setIsPlaying(true)
    }
  }

  const handleCategoryClick = (category: AmbientCategory) => {
    setActiveCategory(category.id)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Mobile media session for notification controls
  useEffect(() => {
    if ('mediaSession' in navigator && typeof window !== 'undefined' && window.innerWidth < 768) {
      const currentCategory = activeCategory === "custom" 
        ? { name: "Custom Ambient", description: "Your ambient sound" }
        : ambientCategories.find(c => c.id === activeCategory)

      if (activeCategory && currentCategory) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentCategory.name,
          artist: 'Deep Work - Ambient Sounds',
          album: 'Focus Session',
          artwork: [
            { src: '/favicon.ico', sizes: '96x96', type: 'image/x-icon' }
          ]
        })

        // Set playback state
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'

        // Action handlers for mobile notification controls
        navigator.mediaSession.setActionHandler('play', () => {
          setIsPlaying(true)
        })

        navigator.mediaSession.setActionHandler('pause', () => {
          setIsPlaying(false)
        })

        navigator.mediaSession.setActionHandler('stop', () => {
          setIsPlaying(false)
          setActiveCategory(null)
        })
      } else {
        // Clear media session when no ambient sound is active
        navigator.mediaSession.metadata = null
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('stop', null)
      }
    }
  }, [activeCategory, isPlaying])

  return (
    <div className="bg-theme-card-bg/30 backdrop-blur-sm border border-theme-card-border/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-theme-text-primary">Ambient Sounds</h2>
        <div className="flex gap-2">
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="sm"
            className="text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card-bg/40"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card-bg/40"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Custom Video Input */}
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 sm:gap-3">
          <Input
            value={customVideoUrl}
            onChange={(e) => setCustomVideoUrl(e.target.value)}
            placeholder="Paste YouTube video or playlist URL"
            className="flex-1 bg-theme-input-bg border-theme-input-border text-theme-text-primary placeholder:text-slate-400 rounded-xl text-sm sm:text-base p-2 sm:p-3"
          />
          <Button
            onClick={handleCustomVideo}
            className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary rounded-xl px-4 sm:px-6 text-xs sm:text-sm font-medium"
          >
            Load Video
          </Button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {ambientCategories.map((category) => (
          <Button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            variant="ghost"
            className={`h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-xl border transition-all duration-200 hover:scale-105 ${
              activeCategory === category.id
                ? `bg-theme-task-bg/30 border-theme-task-border text-theme-task-text shadow-lg shadow-theme-task-bg/20`
                : `bg-theme-card-bg border-theme-card-border hover:bg-theme-card-bg hover:border-theme-accent/30 text-theme-text-secondary hover:text-theme-text-primary shadow-sm hover:shadow-md`
            }`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6">{category.icon}</div>
            <span className="text-xs sm:text-sm font-medium">{category.name}</span>
          </Button>
        ))}
      </div>

      {/* YouTube Player */}
      {activeCategory && (
        <div className="mb-4 sm:mb-6">
          <div className="aspect-video bg-theme-input-bg/50 rounded-xl overflow-hidden">
            <iframe
              ref={playerRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${
                activeCategory === "custom"
                  ? isPlaylist 
                    ? `videoseries?list=${playlistId}`
                    : `${customVideoId}?playlist=${customVideoId}`
                  : `${ambientCategories.find((c) => c.id === activeCategory)?.videoId}?playlist=${
                      ambientCategories.find((c) => c.id === activeCategory)?.videoId
                    }`
              }&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1`}
              title="Ambient Sound Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {activeCategory && (
        <div className="flex items-center gap-4 p-4 bg-theme-input-bg/50 rounded-xl">
          <div className="w-12 h-12 bg-theme-accent/20 rounded-lg flex items-center justify-center">
            {activeCategory === "custom" ? (
              <Play className="w-6 h-6" />
            ) : (
              ambientCategories.find((c) => c.id === activeCategory)?.icon
            )}
          </div>
          <div className="flex-1">
            <div className="text-theme-text-primary font-medium">
              {activeCategory === "custom"
                ? "Custom Video"
                : ambientCategories.find((c) => c.id === activeCategory)?.name}
            </div>
            <div className="text-theme-text-muted text-sm">
              {activeCategory === "custom"
                ? "Your custom ambient sound"
                : ambientCategories.find((c) => c.id === activeCategory)?.description}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPlaying && (
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-theme-progress rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-theme-progress rounded-full animate-pulse delay-75" />
                <div className="w-1 h-4 bg-theme-progress rounded-full animate-pulse delay-150" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
