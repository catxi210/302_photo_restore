
const zh = {
  Symbol: "zh",
  Title: 'AI老照片修复 - 302.AI',
  Desc: "由302.AI驱动的照片生成工具",
  Auth: {
    NeedCode: '需要分享码',
    InputCode: '创建者开启了验证，请在下方填入分享码',
    PlaceHodeer: '请输入分享码数',
    ToolBin: '工具已禁用, 更多信息请访问',
    ToolDel: '工具已删除, 更多信息请访问',
    Submit: '确认',
    Remind: '记住分享码',
    CodeError: '验证码错误！',
    AccountBin: '账号已被禁用!',
    AccountDel: '账号已被注销！',
    NetworkError: '网络错误，请刷新页面后重试！',
  },
  Code: {
    TokenMiss: '该工具已禁用/删除！', // -10001
    TokenInvalid: '该工具已禁用/删除！', // -10002
    InternalError: '内部错误，请联系客服！', // -10003
    AccountOut: '账号欠费，请充值后重试!', // -10004
    TokenExpired: '令牌过期，请刷新页面后重试！', // -10005
    TotalOut: '工具总额度已用完，请联系管理员充值！', // -10006
    TodayOut: '工具当日额度已用完，请联系管理员充值！', // -10007
    HourOut: '该免费工具在本小时的额度已达上限', // -10012
    ErrorPrompt: '视频提示词违规，请重新输入！', // -10011
  },
  Error: {
    InitError: '初始化数据错误!',
    FetchCancel: '请求取消！',
    FetchError: '请求错误！',
    NetworkError: '网络错误，请稍后重试！',
    TokenMiss: '令牌无效，请验证后重试!',
    AccountError: '账号异常',
    AccountUnvalid: '当前账号已经失效!',
    InternalError: '内部错误，请联系客服!',
    BalanceOut: '账号余额不足，请充值！',
    TokenExpire: '当前令牌已过期！',
    TotalCostTip: '总额度提醒',
    TotalCostOut: '工具总额度已达到上限！',
    TodayCostTip: '当日额度提醒',
    TodayCostOut: '工具当日额度已达到上限！',
    FetchNotSupport: '请求错误，图片过大或格式不支持！',
  },
  System: {
    Notify: '系统通知',
    Title: '系统通知',
    Add: '添加',
    Modify: '修改',
    Delete: '删除',
    Faild: '失败',
    Success: '成功',
    NotNow: '暂不',
    Cancel: '取消',
    Start: '开始',
    Back: '返回',
    Download: '下载',
    Confirm: '确定',
    Error: '网络错误',
    Wait: '系统繁忙，请稍等！',
    BalanceOut: '账户额度不足！',
    Visit: '请访问',
    Register: '请注册',
    Create: '生成属于自己的工具',
    Task: '任务',
    ToLarge: '图片过大, 暂不支持大小超过10M的图片处理',
    Nosupport: '免费版不支持此功能',
  },
  Home: {
    Title: 'AI老照片修复',
  },
  About: {
    Title: '关于',
    Name: 'AI老照片修复',
    User: '本图片工具由302.AI用户',
    Create: '创建',
    Tool: '302.AI是一个AI生成和分享的平台，可以一键生成自己的AI工具',
    Model: '本图片工具使用的模型为',
    AllCost: '本图片工具的总限额为',
    TodayCost: '本图片工具的单日限额为',
    Usage: '已经使用',
    Record: '本图片工具的记录均保存在本机，不会被上传，生成此工具的用户无法看到你的记录',
    More: '更多信息请访问：',
    Tip: '内容由AI生成，仅供参考'
  },
  Action: {
    DropIn: '点击或拖拽上传',
    Enlarge: '无损放大',
    Enhance: '人物增强',
    Colorize: '快速上色',
    ColorizeV2: '专业上色',
    Wait: '任务已提交，预计等待1分钟左右',
    WaitVideo: '请等待5-10分钟',
    DownloadImageTip: '图片修复完成，请及时下载保存！',
    DownloadVideoTip: '视频生成完成，请及时下载保存！',
    Break: '修复任务正在进行中，确认要返回吗？',
    CreatVideo: '生成视频',
    CreatVideoPrompt: '请根据图片，输入您想要生成的视频内容',
    DownloadImage: '下载图片',
    DownloadVideo: '下载视频',
    ReGenerateVideo: '重新生成',
    ResultOptions: [
      { label: '图片', value: 'image', disabled: false },
      { label: '视频', value: 'video', disabled: false },
    ],
  },
  History: {
    Title: '历史记录',
    Empty: '抱歉, 暂无历史记录!',
    Error: '数据格式错误！',
    RollbackSuccess: '记录回滚成功!',
    RollbackFaild: '记录回滚失败，数据异常!',
    ClearSuccess: '历史记录已全部删除！',
    RecordType: '记录类型',
    ClearAll: '清空历史记录',
    ClearAllSure: '确定清空所有历史记录吗？',
    Clear: '清空',
    NotNow: '暂不',
    ItemCount: (count: number) => `共${count}条历史记录`,

  },
  Example: {
    title: 'TRY AN EXAMPLE',
    action: '试一试',
    demos: [
      {
        title: '无损放大',
        desc: '通过增加图像的分辨率和细节，将低分辨率的图像放大到更高的分辨率，而且尽量保持图像的清晰度和细节。它能通过分析图像中的模式和结构来增加图像的细节，使得放大后的图像更加清晰，适用于像素化或模糊的图像',
        before: '/images/enlarge-before.png',
        after: '/images/enlarge-after.png',
      },
      {
        title: '人物增强',
        desc: '通过识别人脸、身体和其他特定的人体部位，增强人物的外貌和细节，使得人物在图像中更加鲜明、真实和有吸引力。这个功能可以使人物更加清晰，凸显出更多的面部特征和表情细节',
        before: '/images/enhance-before.png',
        after: '/images/enhance-after.png',
      },
      {
        title: '黑白上色',
        desc: '将黑白图像自动上色，使其看起来更加逼真和真实。它可以通过学习大量彩色图像和黑白图像之间的关系和颜色分布，将黑白图像中的不同元素和区域着上合适的颜色。这个功能能够为黑白照片增加色彩，使得图像更具真实感和生动性',
        before: '/images/colorize-before.png',
        after: '/images/colorize-after.png',
      }
    ]
  },
};

type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

export type LocaleType = typeof zh;
export type PartialLocaleType = DeepPartial<typeof zh>;

export default zh;
