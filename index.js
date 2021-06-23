console.log('index.js: loaded');

// const headingTxtLength = document.querySelector('h2').textContent.length;

// console.log(headingTxtLength);

// const button = document.createElement("button")
// button.textContent = 'Push Me';

// document.body.appendChild(button);

// const userId = 'Daita2021';


async function main() {
  try {
      const userId = getUserId();
      //awaitつけることでJSONで解決されたpromiseを代入できるように
      const userInfo = await fetchUserInfo(userId);
      const view = createView(userInfo);
      displayView(view);
  } catch (error) {
    console.error(`エラーが発生しました (${error})`);
    result.innerHTML = '正しいIDを入力してください';
  }
}
  // ↑↑↑↑ Async Functionにリファクタリング(内部構造改善で見やすく)
  // const main = () => {
  // fetchUserInfo('Daita2021')
  //   //ここではJSONオブジェクトで解決されるpromise
  //   .then((userInfo) => createView(userInfo))
  //   //ここではHTML文字列で解決されるpromise
  //   .then((view) => displayView(view))
  //   //Promiseチェーン内で発生したエラー等を受け取る
  //   .catch((error) => {
  //     console.error(`エラーが発生しました (${error})`);
  //   });}



const fetchUserInfo = (userId) => {
  // fetchの返り値Promiseをreturn
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      console.log(response.status);
      //エラーレスポンスをハンドリングするためのif構文 レスポンスのステータスコード200番台(成功)ならresponce.okはtrueを返す
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
      } else {
        //JSONに解釈した結果(JSONオブジェクト)で解決するpromiseを返す
        return response.json();
      }
    });
  }

  const getUserId = ()=> {
    return document.getElementById('userId').value;
  }

  // HTML挿入関数
  const displayView = (view) => {
  const result = document.getElementById('result');
  result.innerHTML = view;
  }

  //HTML組み立てのためのタグ関数をcreatView関数に
const createView = (userInfo) => {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}


//特殊記号に対するエスケープ処理関数
const escapeSpecialChars = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//タグ関数(要勉強)準備
// 文字列リテラルと値が元の順番どおりに並ぶように文字列を組み立てつつ、 値が文字列型であればエスケープするようにしている escapeHTML`テンプレートリテラル`の形で使用
const escapeHTML = (strings, ...values) => {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
