// NOTE: date は key として使用するため一意にすること
export const updateInfo = [
  {
    date: "2024-08-25",
    contents: [
      "アルファ版をリリースしました。",
      "ログイン、サインアップ時に画面遷移が正しく行われないバグが発生しています。",
    ],
  },
  {
    date: "2024-08-26",
    contents: [
      "最適化後のスケジュールを手動で編集できるようにしました。",
      "スケジュールをクリップボードにコピーできるようになりました。",
    ],
  },
] as const satisfies { date: string; contents: string[] }[];
