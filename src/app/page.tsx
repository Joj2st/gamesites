"use client"

import { Music, Zap, Clock, Play, RotateCw, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { logger, LOG_PREFIX } from "@/lib/logger"

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [showOrientationHint, setShowOrientationHint] = useState(false)

  useEffect(() => {
    logger.log(LOG_PREFIX, "页面已加载")
    logger.info(LOG_PREFIX, "当前环境:", process.env.NODE_ENV)
    logger.log(LOG_PREFIX, "页面URL:", window.location.href)

    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      logger.log(LOG_PREFIX, "移动设备检测:", mobile)
    }

    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight
      setIsLandscape(landscape)
      logger.log(LOG_PREFIX, "屏幕方向:", landscape ? "横屏" : "竖屏")
      
      if (isMobile && !landscape) {
        setShowOrientationHint(true)
      } else {
        setShowOrientationHint(false)
      }
    }

    checkMobile()
    checkOrientation()

    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [isMobile])

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || ""
      const errorString = event.error?.toString() || ""
      
      logger.debug(LOG_PREFIX, "捕获到错误:", errorMessage)
      logger.debug(LOG_PREFIX, "错误详情:", errorString)
      
      if (
        errorMessage.includes("Permissions policy violation") ||
        errorMessage.includes("fullscreen is not allowed") ||
        errorMessage.includes("Disallowed by permissions policy") ||
        errorString.includes("Disallowed by permissions policy")
      ) {
        logger.warn(LOG_PREFIX, "检测到全屏权限错误，显示提示")
        
        event.preventDefault()
        
        toast.error("Fullscreen Not Available", {
          description: "Fullscreen is restricted by the game server. Please use landscape mode for the best experience, or try the in-game fullscreen button.",
          duration: 6000,
          action: {
            label: "Learn More",
            onClick: () => {
              toast.info("Tips", {
                description: "Rotate your device to landscape mode for a better gaming experience!"
              })
            }
          }
        })
        
        return true
      }
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || ""
      
      logger.debug(LOG_PREFIX, "捕获到Promise拒绝:", reason)
      
      if (
        reason.includes("Disallowed by permissions policy") ||
        reason.includes("fullscreen")
      ) {
        logger.warn(LOG_PREFIX, "检测到全屏权限Promise错误，显示提示")
        
        event.preventDefault()
        
        toast.error("Fullscreen Not Available", {
          description: "Fullscreen is restricted by the game server. Please use landscape mode for the best experience.",
          duration: 6000,
          action: {
            label: "Got it",
            onClick: () => logger.debug(LOG_PREFIX, "用户已知晓全屏限制")
          }
        })
        
        return true
      }
    }

    logger.log(LOG_PREFIX, "设置错误监听器")
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      logger.log(LOG_PREFIX, "移除错误监听器")
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const handlePlayClick = () => {
    logger.log(LOG_PREFIX, "用户点击了Play按钮")
    
    const gameSection = document.getElementById("play-game")
    
    if (gameSection) {
      logger.log(LOG_PREFIX, "找到游戏区域，开始滚动")
      gameSection.scrollIntoView({ behavior: "smooth", block: "start" })
      
      setTimeout(() => {
        logger.log(LOG_PREFIX, "滚动完成，游戏区域已可见")
      }, 1000)
    } else {
      logger.error(LOG_PREFIX, "错误：未找到游戏区域元素")
    }
  }

  logger.log(LOG_PREFIX, "渲染主页面组件")

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center">
            Geometry Dash Online
          </h1>
          <p className="text-lg md:text-2xl text-center opacity-90 max-w-3xl mx-auto">
            Experience the ultimate rhythm-based platformer challenge - Jump, fly, and flip through dangerous passages!
          </p>
          <div className="mt-6 md:mt-8 flex justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
              onClick={handlePlayClick}
            >
              <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Play Now - It&apos;s Free
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <section id="play-game" className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Play Geometry Dash Online
          </h2>
          
          {isMobile && showOrientationHint && (
            <Card className="mb-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-center">
                <RotateCw className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
                  请旋转设备至横屏模式以获得最佳游戏体验
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="relative w-full bg-black"
                style={{ 
                  paddingBottom: isMobile ? "75%" : "56.25%",
                  minHeight: isMobile ? "400px" : "auto"
                }}
              >
                <iframe
                  src="https://geometrydash.io/embed/geometry-dash"
                  title="Geometry Dash Online Game"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={() => {
                    logger.log(LOG_PREFIX, "游戏iframe加载完成")
                    logger.info(LOG_PREFIX, "提示：全屏功能由游戏内部控制，请使用游戏内的全屏按钮")
                  }}
                  onError={() => {
                    logger.error(LOG_PREFIX, "游戏iframe加载失败")
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 md:mt-6 text-center space-y-2">
            <p className="text-sm md:text-base text-muted-foreground">
              点击游戏区域开始游戏，使用方向键或点击控制
            </p>
            {isMobile && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>移动端建议横屏游玩以获得最佳体验</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 提示：点击游戏区域后，可使用游戏内的全屏按钮
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            About Geometry Dash
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Game Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                  Geometry Dash is a rhythm-based platformer game that challenges players to navigate through various levels filled with obstacles. The game combines fast-paced action with catchy music, creating an addictive experience that keeps players coming back for more.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  With simple one-touch controls, players must time their jumps perfectly to avoid spikes, gaps, and other hazards. The game&apos;s difficulty progressively increases, offering a satisfying challenge for both casual and hardcore gamers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary font-semibold mr-2">•</span>
                    <span>Press SPACE or click/tap to jump</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-semibold mr-2">•</span>
                    <span>Hold to jump continuously in some game modes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-semibold mr-2">•</span>
                    <span>Avoid all obstacles and spikes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-semibold mr-2">•</span>
                    <span>Collect stars and unlock new icons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-semibold mr-2">•</span>
                    <span>Practice makes perfect - don&apos;t give up!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Game Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Rhythm-Based Gameplay
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Jump to the beat of catchy electronic music tracks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Multiple Game Modes
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Experience different gameplay styles and challenges
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Endless Replayability
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Practice levels and improve your skills over time
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Why Play Geometry Dash?
          </h2>
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    Perfect for All Ages
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Geometry Dash offers simple controls that anyone can learn, but mastering the game requires skill and dedication. It&apos;s perfect for quick gaming sessions or extended playthroughs.
                  </p>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    No Download Required
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Play directly in your browser without downloading or installing anything. Works on desktop, tablet, and mobile devices for gaming on the go.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    Competitive Community
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Join millions of players worldwide who compete for the best times and highest scores. Share your achievements and challenge your friends.
                  </p>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    Regular Updates
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    New levels and features are added regularly, ensuring fresh content and new challenges to keep you engaged.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            Tips for Beginners
          </h2>
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 md:mr-4 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      Start with Practice Mode
                    </h4>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Learn the level layout without starting over from the beginning
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 md:mr-4 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      Listen to the Music
                    </h4>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      The rhythm helps you time your jumps perfectly
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 md:mr-4 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      Stay Patient
                    </h4>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      The game is challenging - persistence is key to improvement
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 md:mr-4 text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      Use Headphones
                    </h4>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Better audio helps you sync with the game&apos;s rhythm
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-muted py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                About This Game
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Geometry Dash Online is a free-to-play browser version of the popular rhythm-based platformer. Enjoy endless fun without downloads or installations.
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                Quick Links
              </h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <li>
                  <a href="#play-game" className="text-muted-foreground hover:text-primary transition-colors">
                    Play Game
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                Legal Notice
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                This is a fan-made website for entertainment purposes. Geometry Dash is a trademark of RobTop Games. We are not affiliated with RobTop Games.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6 md:pt-8 text-center">
            <p className="text-muted-foreground text-xs md:text-sm">
              © 2024 Geometry Dash Online. All rights reserved. Play free online games anytime, anywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
