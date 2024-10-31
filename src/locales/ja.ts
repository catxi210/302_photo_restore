import { LocaleType } from "./index";

// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const ja: LocaleType = {
  Symbol: "ja",
  Title: 'AI古写真復元 - 302.AI',
  Desc: "302.AIによって強化されたフォトジェネレーションツール",
  Auth: {
    NeedCode: '共有コードが必要です',
    InputCode: 'クリエーターが確認を有効にしています。以下に共有コードを入力してください',
    PlaceHodeer: 'ここに共有コードを入力してください',
    ToolBin: 'ツールが無効になっています。詳細については',
    ToolDel: 'ツールは削除されました。詳細については',
    Submit: '送信',
    Remind: '共有コードを記憶する',
    CodeError: '無効なコードです！',
    AccountBin: 'アカウントが無効です！',
    AccountDel: 'アカウントが削除されました！',
    NetworkError: 'ネットワークエラー。ページを更新してもう一度お試しください！',
  },
  Code: {
    TokenMiss: "このツールは無効化されています/削除されています！", // -10001
    TokenInvalid: "このツールは無効化されています/削除されています！", // -10002
    InternalError: '内部エラーが発生しました。カスタマーサービスにお問い合わせください！', // -10003
    AccountOut: 'アカウントの支払が滞っています。再チャージしてもう一度お試しください！', // -10004
    TokenExpired: 'トークンの有効期限が切れています。ページを更新してもう一度お試しください！', // -10005
    TotalOut: 'ツールの合計制限に達しました。管理者に連絡して再チャージしてください！', // -10006
    TodayOut: 'ツールの1日あたりの制限に達しました。管理者に連絡して再チャージしてください！', // -10007
    HourOut: 'この無料ツールは今時間の上限に達しました', // -10012
    ErrorPrompt: 'ビデオプロンプトワードが規定に違反しています。再入力してください！', // -10011
  },
  Error: {
    InitError: '初期化データエラー！',
    FetchCancel: 'リクエストがキャンセルされました！',
    FetchError: 'リクエストエラー！',
    NetworkError: 'ネットワークエラー。しばらくしてからもう一度お試しください！',
    TokenMiss: '無効なトークンです。確認して再試行してください！',
    AccountError: 'アカウントエラー',
    AccountUnvalid: '現在のアカウントは無効です！',
    InternalError: '内部エラーが発生しました。カスタマーサービスにお問い合わせください！',
    BalanceOut: 'アカウント残高が不足しています。チャージしてください！',
    TokenExpire: '現在のトークンは期限切れです！',
    TotalCostTip: '合計制限の通知',
    TotalCostOut: 'ツールの合計制限に達しました！',
    TodayCostTip: '1日あたりの制限の通知',
    TodayCostOut: 'ツールの1日あたりの制限に達しました！',
    FetchNotSupport: 'リクエストエラー、画像が大きすぎるかフォーマットがサポートされていません！'
  },
  System: {
    Notify: 'システム通知',
    Title: 'システム通知',
    Add: '追加',
    Modify: '変更',
    Delete: '削除',
    Faild: '失敗しました',
    Success: '成功',
    NotNow: '今はしない',
    Cancel: 'キャンセル',
    Start: '開始',
    Back: '戻る',
    Download: 'ダウンロード',
    Confirm: '確認',
    Error: 'ネットワークエラー',
    Wait: 'システムがビジー状態です。お待ちください！',
    BalanceOut: 'アカウント残高が不足しています！',
    Visit: '',
    Register: 'サインアップしてください',
    Create: 'を訪問して自分のツールを作成してください',
    Task: 'タスク',
    ToLarge: '画像が大きすぎます。現在、10MBを超えるファイルの画像処理はサポートされていません。',
    Nosupport: '無料バージョンはこの機能をサポートしていません'
  },
  Home: {
    Title: 'AI古写真復元',
  },
  About: {
    Title: '概要',
    Name: 'AI古写真復元',
    User: 'この写真ツールは302.AIユーザーによって作成されました',
    Create: '',
    Tool: 'これは、AIを生成および共有するためのプラットフォームである302.AIです。自身のAIロボットをワンクリックで生成して共有できます。',
    Model: 'このツールは以下のモデルを使用しています',
    AllCost: 'この写真ツールの合計制限は',
    TodayCost: 'この写真ツールの日次制限は',
    Usage: '使用状況：',
    Record: 'このツールのすべての記録はこのデバイスに保存され、アップロードされません。このツールを生成したユーザーはあなたの記録を閲覧できません。',
    More: '詳細についてはご覧ください：',
    Tip: 'AIにより生成されたコンテンツであり、参考としてのみご利用ください'
  },
  Action: {
    DropIn: 'クリックまたはドラッグしてアップロード',
    Enlarge: '拡大',
    Enhance: '強化',
    Colorize: 'カラー化-早い',
    ColorizeV2: 'カラー化_遅い',
    Wait: 'タスクが送信されました。推定待ち時間は約1分です',
    WaitVideo: '5-10分お待ちください。',
    DownloadImageTip: '写真復元が完了しました。すぐにダウンロードして保存してください！',
    DownloadVideoTip: 'ビデオ生成が完了しました。すぐにダウンロードして保存してください！',
    Break: "修復タスクが進行中です。戻りますか？",
    CreatVideo: 'ビデオ生成',
    CreatVideoPrompt: '画像ベースで生成したいコンテンツを入力してください',
    DownloadImage: '画像をダウンロード',
    DownloadVideo: 'ビデオをダウンロード',
    ReGenerateVideo: '再生成',
    ResultOptions: [
      { label: '画像', value: 'image', disabled: false },
      { label: 'ビデオ', value: 'video', disabled: false },
    ],
  },
  History: {
    Title: '履歴',
    Empty: '申し訳ありませんが、履歴記録はありません！',
    Error: 'データ形式エラー！',
    RollbackSuccess: '記録のロールバックに成功しました！',
    RollbackFaild: '記録のロールバックに失敗しました。データが異常です！',
    ClearSuccess: 'すべての履歴記録が削除されました！',
    RecordType: '記録タイプ',
    ClearAll: 'すべての履歴記録をクリア',
    ClearAllSure: 'すべての履歴記録をクリアしてもよろしいですか？',
    Clear: 'クリア',
    NotNow: '今はしない',
    ItemCount: (count: number) => `合計${count}の履歴記録があります`,
  },
  Example: {
    title: '例を試してみる',
    action: 'この例で試してみる',
    demos: [
      {
        title: '拡大',
        desc: '画像の解像度と詳細を向上させ、低解像度の画像を高解像度に拡大しながら、画像の明瞭さと詳細をできるだけ維持します。画像のパターンや構造を分析して画像の詳細を向上させ、拡大した画像をより鮮明にします。ピクセル化やぼやけた画像に適しています',
        before: '/images/enlarge-before.png',
        after: '/images/enlarge-after.png',
      },
      {
        title: '強化',
        desc: "顔、体、その他の特定の身体部分を識別して人の外観と詳細を強化し、画像中の人物をより生き生きと、現実的かつ魅力的にします。この機能は人物の明瞭さを向上させ、より多くの顔の特徴や表情の詳細を強調します",
        before: '/images/enhance-before.png',
        after: '/images/enhance-after.png',
      },
      {
        title: 'カラー化',
        desc: '白黒画像を自動的にカラー化して、より現実的で本格的に見せます。多数のカラー画像と白黒画像の間の関係と分布を学習することで、白黒画像の異なる要素や領域に適切な色を追加できます。この機能は白黒写真に色を追加し、より現実的で鮮明な画像にします',
        before: '/images/colorize-before.png',
        after: '/images/colorize-after.png',
      }
    ]
  }
};

export default ja;
