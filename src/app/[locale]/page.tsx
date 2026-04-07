"use client"

import { Music, Zap, Clock, Play, RotateCw, Smartphone, Search, TrendingUp, Star, Share2, ChevronRight, Gamepad2, Swords, Puzzle, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { logger, LOG_PREFIX } from "@/lib/logger"
import { useTranslations, useFormatter } from 'next-intl'
import { LanguageSwitcher } from "@/components/language-switcher"

const gameCategories = [
  { id: "action", nameKey: "categories.action", icon: Swords, count: 15 },
  { id: "puzzle", nameKey: "categories.puzzle", icon: Puzzle, count: 12 },
  { id: "racing", nameKey: "categories.racing", icon: Zap, count: 8 },
  { id: "sports", nameKey: "categories.sports", icon: Trophy, count: 10 },
  { id: "adventure", nameKey: "categories.adventure", icon: Gamepad2, count: 20 },
]

const popularGames = [
  { id: 1, name: "Geometry Dash", categoryKey: "categories.action", plays: "2.5M", rating: 4.8, image: "/geometry-dash.png" },
  { id: 2, name: "Slope", categoryKey: "categories.racing", plays: "1.8M", rating: 4.7, image: "/slope.png" },
  { id: 3, name: "Happy Wheels", categoryKey: "categories.action", plays: "1.5M", rating: 4.6, image: "/happy-wheels.png" },
  { id: 4, name: "Run 3", categoryKey: "categories.adventure", plays: "1.2M", rating: 4.5, image: "/run-3.png" },
  { id: 5, name: "Paper.io 2", categoryKey: "categories.puzzle", plays: "980K", rating: 4.4, image: "/paper-io.png" },
]

const latestGames = [
  { id: 1, name: "Geometry Dash Lite", categoryKey: "categories.action", date: "2026-04-07", isNew: true },
  { id: 2, name: "Stack Ball", categoryKey: "categories.puzzle", date: "2026-04-06", isNew: true },
  { id: 3, name: "Cannon Balls 3D", categoryKey: "categories.action", date: "2026-04-05", isNew: false },
  { id: 4, name: "Tunnel Rush", categoryKey: "categories.racing", date: "2026-04-04", isNew: false },
  { id: 5, name: "Basketball Legends", categoryKey: "categories.sports", date: "2026-04-03", isNew: false },
  { id: 6, name: "Moto X3M", categoryKey: "categories.racing", date: "2026-04-02", isNew: false },
]

export default function Home() {
  const t = useTranslations()
  const format = useFormatter()
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [showOrientationHint, setShowOrientationHint] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-07'))

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
        
        toast.error(t('toast.fullscreenError'), {
          description: t('toast.fullscreenErrorDesc'),
          duration: 6000,
          action: {
            label: t('toast.learnMore'),
            onClick: () => {
              toast.info(t('toast.tips'), {
                description: t('toast.tipsDesc')
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
        
        toast.error(t('toast.fullscreenError'), {
          description: t('toast.fullscreenErrorDesc'),
          duration: 6000,
          action: {
            label: t('toast.gotIt'),
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
  }, [t])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    logger.log(LOG_PREFIX, "搜索:", searchQuery)
    toast.info("Search", {
      description: t('toast.searching', { query: searchQuery })
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Geometry Dash Online",
          text: "Play Geometry Dash Online for free!",
          url: window.location.href,
        })
        logger.log(LOG_PREFIX, "分享成功")
      } catch (err) {
        logger.error(LOG_PREFIX, "分享失败:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('toast.linkCopied'), {
        description: t('toast.linkCopiedDesc')
      })
    }
  }

  logger.log(LOG_PREFIX, "渲染主页面组件")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">{t('footer.brand')}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('nav.today')}</span>
                <span className="font-medium text-foreground">
                  {format.dateTime(currentDate, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#categories" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.categories')}</a>
              <a href="#popular" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.popular')}</a>
              <a href="#latest" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.latest')}</a>
              <a href="#play-game" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.playNow')}</a>
            </div>

            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-48 md:w-64 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">{t('hero.featured')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-2xl text-center opacity-90 max-w-3xl mx-auto mb-6">
            {t('hero.description')}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
              onClick={handlePlayClick}
            >
              <Play className="mr-2 h-5 w-5" />
              {t('hero.playButton')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-6 py-4"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-5 w-5" />
              {t('hero.share')}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t('hero.players')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>{t('hero.rating')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{t('hero.trending')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Game Categories */}
        <section id="categories" className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('categories.title')}
            </h2>
            <Button variant="ghost" className="text-primary">
              {t('categories.viewAll')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {gameCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-sm md:text-base mb-1">{t(category.nameKey)}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} {t('categories.games')}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Popular Games */}
        <section id="popular" className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('popular.title')}
              </h2>
            </div>
            <Button variant="ghost" className="text-primary">
              {t('popular.viewAll')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularGames.map((game, index) => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Gamepad2 className="h-12 w-12 text-white/50" />
                  </div>
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t(game.categoryKey)}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{game.plays} {t('popular.plays')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Play Game Section */}
        <section id="play-game" className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            {t('game.play')}
          </h2>
          
          {isMobile && showOrientationHint && (
            <Card className="mb-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-center">
                <RotateCw className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-200">
                  {t('orientation.hint')}
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
              {t('game.hint')}
            </p>
            {isMobile && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>{t('game.mobileHint')}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('game.fullscreenTip')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Latest Games */}
        <section id="latest" className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('latest.title')}
              </h2>
            </div>
            <Button variant="ghost" className="text-primary">
              {t('latest.viewAll')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestGames.map((game) => (
              <Card key={game.id} className="hover:shadow-lg transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="h-8 w-8 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        {game.isNew && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {t('latest.new')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{t(game.categoryKey)}</p>
                      <p className="text-xs text-muted-foreground">{game.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Game Features */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 md:mb-8 text-center">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {t('features.rhythm.title')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {t('features.rhythm.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {t('features.modes.title')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {t('features.modes.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {t('features.replayability.title')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {t('features.replayability.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{t('footer.brand')}</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <li>
                  <a href="#categories" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('categories.title')}
                  </a>
                </li>
                <li>
                  <a href="#popular" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('popular.title')}
                  </a>
                </li>
                <li>
                  <a href="#latest" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('latest.title')}
                  </a>
                </li>
                <li>
                  <a href="#play-game" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('nav.playNow')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                {t('footer.legal')}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {t('footer.legalText')}
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6 md:pt-8 text-center">
            <p className="text-muted-foreground text-xs md:text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
