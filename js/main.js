"use strict";

const td = document.querySelectorAll(".column");
const tdAll = Object.values(td);
const reset = document.getElementById("reset");
const start = document.getElementById("start");
const announce = document.getElementById("announce");
const maru = document.getElementById("maru");
const batu = document.getElementById("batu");
const storageData = localStorage.getItem('data');
const json = storageData ? JSON.parse(storageData) : null;

const column = [];
let player = 1;
const p1 = [];
const p2 = [];

/**
 * 時間変換処理
 */
const dateTiimes = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const hh = date.getMonth() + 1;
  const dd = date.getDate();
  const times = `${date.getHours()}:${date.getMinutes()}`;
  const dateTime = `${yyyy}-${hh}-${dd} ${times}`;

  return dateTime;
}

/**
 * ゲーム結果を取得
 */
const asyncFunc = async () => {

    // 非同期処理
    const promise = new Promise((resolve, reject) => {
      const data = localStorage.getItem('data');
      resolve(data);
    });

    promise.then((response) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            const json = JSON.parse(response);
            resolve(json);
          }, 100);
      });
    }).then((data) => {
        setTimeout(() => {
          if(data) {
            // 勝利数をHTMLに反映
            const player1 = data.filter(datas => datas.winPrayers === 1);
            const p1Data = player1.length;
            const player2 = data.filter(datas => datas.winPrayers === 2);
            const p2Data = player2.length;
            maru.innerText = p1Data;
            batu.innerText = p2Data;
          };
        }, 100);
    });
};
asyncFunc();

// 勝敗データ
let gameDatas = storageData ? json : [];

// 配列に変換
tdAll.map((value) => {
  column.push(value.id);
});

column.map((value, index) => {
  const dom = document.getElementById(value);
  dom.addEventListener("click", (event) => {
    const target = event.target.id;
    const targetDom = document.getElementById(target);

    // 選択したマスはクリックさせない
    targetDom.classList.add("pointerNone");

    if (player === 1) {
      player = 2;
      targetDom.innerText = "〇";
      targetDom.classList.add('player1');
      p1.push(target);
      setWinner(p1);
    } else {
      player = 1;
      targetDom.innerText = "✕";
      targetDom.classList.add('player2');
      p2.push(target);
      setWinner(p2);
    }
  });
});

/**
 * 勝者を判定
 */
const setWinner = (playNum) => {

  // 勝ちパターン
  const win = [
    // 横
    ["num1", "num2", "num3"],
    ["num4", "num5", "num6"],
    ["num7", "num8", "num9"],
    // 縦
    ["num1", "num4", "num7"],
    ["num2", "num5", "num8"],
    ["num3", "num6", "num9"],
    // 右斜め
    ["num1", "num5", "num9"],
    // 左斜め
    ["num3", "num5", "num7"],
  ];

  // 3回目以降に判定を開始
  if (playNum.length > 2) {
    // 勝ちパターンと選択マスを比較
    const serch = win.filter( (value, index, array) => {
      const duplication = [];

      playNum.map((target) => {
        // winパターンから選択マスを絞り込み
        if (value.some((v) => v.includes(target))) {
          duplication.push(index);

          // 重複した数が3つ以上であればゲーム終了
          if (duplication.length > 2) {
            const winners = player === 2 ? "〇の勝ち" : "✕の勝ち";

            setTimeout( () => {
              alert(winners);
            }, 100);
            
            // ゲーム終了後はクリックをさせない
            tdAll.map((tags) => {
              tags.classList.add("pointerNone");
            });

            // ゲーム内容を初期化
            p1.length = 0;
            p2.length = 0;

            // 勝敗データを保存
            const dataNum = gameDatas.length === 0 ? 1 : gameDatas.length + 1;
            gameDatas.push(
              {
                id: dataNum,
                winOrLoss: `${winners}`,
                winPrayers: winners === '〇の勝ち' ? 1 : 2,
                created_time: dateTiimes()
              }
            );

            // 結果をローカルストレージに保存
            localStorage.setItem('data', JSON.stringify(gameDatas));
          }
        }
      });
    });
  }
};

/**
 * ゲーム再開ボタン
 */
start.addEventListener("click", () => {
  tdAll.map((value) => {
    value.classList.remove("pointerNone");
    value.classList.remove('player1');
    value.classList.remove('player2');
    value.innerText = "";
  });

  // プレイヤーの順番を初期化
  player = 1;

  // ゲーム結果を表示する
  asyncFunc();
});

/**
 * ゲーム結果をリセット
 */
reset.addEventListener("click", () => {
  maru.innerText = null;
  batu.innerText = null;
  localStorage.removeItem("data");
  window.location.reload();
});
