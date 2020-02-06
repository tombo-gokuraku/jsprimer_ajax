console.log("index.js: loaded");

function main() {
  fetchUserInfo("js-primer-exampleeee").catch(error => {
    // Promiseチェーンの中で発生したエラーを受け取る
    console.error(`エラーが発生しました (${error})`);
  });
}

function fetchUserInfo(userId) {
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then(response => {
    console.log(response.status);
    // エラーレスポンスが返されたことを検知する
    if (!response.ok) {
      // console.error("エラーレスポンス", response);
      return Promise.reject(
        new Error(`${response.status}: ${response.statusText}`)
        // "hoge piyo"
      );
    } else {
      return response.json().then(userInfo => {
        console.log(userInfo);
        // HTMLの組み立て
        const view = createView(userInfo);
        // HTMLの挿入
        displayView(view);
      });
    }
  });
}

// テンプレートリテラル内の文字列を置き換える
// htmlを表示する際に不正な文字列を変換する
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// テンプレートリテラルにタグ付けするためのタグ関数
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}

// htmlを組み立てる関数
function createView(userInfo) {
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

// htmlを挿入する関数
function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}
