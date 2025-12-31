
export const translations = {
  en: {
    login: {
      title: "Sign In",
      subtitle: "Access NovaStream Pro Dashboard",
      userPlaceholder: "Username",
      passPlaceholder: "Password",
      btn: "Login to Dashboard",
      error: "Invalid credentials. Please try again.",
      logout: "Log Out",
    },
    nav: {
      explore: "Explore",
      aiDiscovery: "AI Discovery",
      advanced: "Advanced",
      proAccount: "Pro Account",
      watchHistory: "Watch History",
    },
    hero: {
      version: "AI-Powered V3.0 is Live",
      title: "Your Universe of",
      titleHighlight: "Premium Content",
      subtitle: "Paste any video link to unlock instant, high-definition streaming. Powered by NovaStream's proprietary cloud-parsing engine.",
      placeholder: "Paste video URL (Tencent, Youku, iQIYI, etc.)",
      cta: "Stream Now",
    },
    trending: "Trending Now",
    features: {
      privacy: {
        title: "Privacy First",
        desc: "Our servers act as a secure proxy, shielding your IP while delivering seamless content.",
      },
      speed: {
        title: "Hyper-Speed",
        desc: "Distributed cloud nodes across the globe ensure minimal buffering and up to 4K resolution.",
      },
      ai: {
        title: "AI Optimized",
        desc: "Intelligent traffic routing selects the healthiest source automatically for your location.",
      },
    },
    player: {
      source: "Source",
      node: "Global Node",
      connected: "Connected via High-Performance API • Low Latency Mode",
      aiInsights: "AI Insights",
      noInsights: "No AI insights for this link yet.",
      refresh: "Try Refreshing",
      switchStream: "Switch Stream",
    },
    history: {
      empty: "No content in your history. Start watching to track your favorites.",
      clear: "Clear Watch History",
      recent: "Played recently",
    },
    footer: {
      desc: "NovaStream Entertainment. This platform is for educational demonstration purposes. All content rights belong to their respective creators.",
      api: "API Documentation",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    }
  },
  zh: {
    login: {
      title: "账号登录",
      subtitle: "访问 NovaStream Pro 控制面板",
      userPlaceholder: "用户名",
      passPlaceholder: "密码",
      btn: "登录系统",
      error: "用户名或密码错误，请重试。",
      logout: "退出登录",
    },
    nav: {
      explore: "发现",
      aiDiscovery: "AI 探索",
      advanced: "高级设置",
      proAccount: "专业版账号",
      watchHistory: "播放历史",
    },
    hero: {
      version: "AI 驱动 V3.0 已上线",
      title: "您的全球",
      titleHighlight: "优质视频中心",
      subtitle: "粘贴任何视频链接即可解锁即时高清流媒体。由 NovaStream 专有的云解析引擎驱动。",
      placeholder: "粘贴视频链接 (腾讯、优酷、爱奇艺等)",
      cta: "立即播放",
    },
    trending: "热门推荐",
    features: {
      privacy: {
        title: "隐私优先",
        desc: "我们的服务器充当安全代理，在提供无缝内容的同时保护您的 IP 地址。",
      },
      speed: {
        title: "极速解析",
        desc: "全球分布的云节点确保极速加载，最高支持 4K 分辨率。",
      },
      ai: {
        title: "AI 智能优化",
        desc: "智能流量调度根据您所在的位置自动选择最健康的解析源。",
      },
    },
    player: {
      source: "线路",
      node: "全球节点",
      connected: "已通过高性能 API 连接 • 低延迟模式",
      aiInsights: "AI 智能解析",
      noInsights: "暂无此链接的 AI 解析信息。",
      refresh: "尝试刷新",
      switchStream: "切换线路",
    },
    history: {
      empty: "历史记录为空。开始观看以追踪您的收藏。",
      clear: "清除播放历史",
      recent: "最近播放",
    },
    footer: {
      desc: "NovaStream 娱乐。此平台仅用于教学演示。所有内容权利归原作者所有。",
      api: "API 文档",
      privacy: "隐私政策",
      terms: "使用条款",
    }
  }
};

export type Language = 'en' | 'zh';
