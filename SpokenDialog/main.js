
const URL = "https://jlp.yahooapis.jp/NLUService/V1/analyze?appid="; // APIのリクエストURL
const APIID = "dj00aiZpPTFvMWZrRmo1ZGtjeCZzPWNvbnN1bWVyc2VjcmV0Jng9YjA-"; // あなたのアプリケーションID

const startButton = document.querySelector('#startButton'); // 開始ボタン
const stopButton = document.querySelector('#stopButton'); // 停止ボタン
const resultOutput = document.querySelector('#resultOutput'); // 結果出力エリア
const isActive = document.querySelector('#isActive'); // 音声認識のオンオフ
const modeText = document.querySelector('#modeText'); // 現在のモードを示すテキスト

if (!'SpeechSynthesisUtterance' in window) {
    alert("あなたのブラウザはSpeech Synthesis APIに未対応です。");
}

const tts = new SpeechSynthesisUtterance(); // TTSインスタンスを生成
//tts.text = textForm.value; // テキストを設定
tts.lang = "ja-JP"; // 言語(日本語)、英語の場合はen-US
tts.rate = 1.0; // 速度
tts.pitch = 1.0; // 声の高さ
tts.volume = 1.0; // 音量

SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
if (!'SpeechRecognition' in window) {
    alert("あなたのブラウザはSpeech Recognition APIに未対応です。");
}

const asr = new SpeechRecognition(); // ASRインスタンスを生成
asr.lang = "ja-JP"; // 言語（日本語）
asr.interimResults = true; // 途中結果出力をオン
asr.continuous = true; // 継続入力をオン

// 変数
let response;
let resp_index;
let output;

// サイトが読み込まれたときにここが実行される
window.onload = function()
{
    init();
    setInterval("main()", 16);
}

// 読み込み時に一度だけ実行
function init()
{
    response = [
        {
            "あなた,誰": ["", "introduce", ""],
            "名前": ["私の名前はまだありません。"],
            "何歳": ["私はまだ生まれたばかりの0歳です。"],
            "こんにちは": ["こんにちは。", "introduce", ""],
            "こんばんは": ["こんばんは。", "introduce", ""],
            "おはよう": ["おはようございます。", "introduce", ""],
            "おやすみ": ["おやすみなさい。"],
            "よろしく": ["よろしくお願いします。"],
            "ありがとう": ["どういたしまして。"],
            "元気": ["はい、私は元気です。"],
            "何月": ["", "resp_Date", ""],
            "何日": ["", "resp_Date", ""],
            "何時": ["", "resp_Time", ""],
            "何分": ["", "resp_Time", ""],
            "曜日": ["", "resp_Day", ""],
            "じゃんけん": ["じゃんけんモードに移行。じゃんけん…", "set_mode", 1],
            "ダイス": ["ダイスモードに移行。ダイスの面の数を指定してください。", "set_mode", 2]
        },
        {
            "Goo": ["", "rock_papers_scissors", 0],
            "goo": ["", "rock_papers_scissors", 0],
            "グー": ["", "rock_papers_scissors", 0],
            "チョキ": ["", "rock_papers_scissors", 1],
            "パー": ["", "rock_papers_scissors", 2]
        },
        {
            "[0-9]+" :["", "dice", "num"]
        }
    ];

    resp_index = 0;
    output = ''; // 出力
}

// メインループ
function main()
{
    update();
}

// 毎フレーム実行
function update()
{
    
}

// 自己紹介
function introduce()
{
    text = "私は遊びに特化した音声対話プログラムです。じゃんけんやダイスが得意です。";
    return text;
}

// 日付の返答を返す
function resp_Date()
{
    const now = new Date(); // 日付格納オブジェクト
    const now_y = now.getFullYear(); // 年
    const now_m = now.getMonth() + 1; // 月
    const now_d = now.getDate(); // 日
    const msg = " 今日は " + now_y + " 年 " + now_m + " 月 " + now_d + " 日です。";
    return msg;
}

// 時刻の返答を返す
function resp_Time()
{
    const now = new Date(); // 日付格納オブジェクト
    const now_h = now.getHours(); // 時
    const now_m = now.getMinutes(); // 分
    const msg = " 日本の現在時刻は " + now_h + " 時 " + now_m + " 分です。";
    return msg;
}

// 曜日の返答を返す
function resp_Day()
{
    const now = new Date(); // 日付格納オブジェクト
    const days = ["日","月","火","水","木","金","土"];
    const now_d = now.getDay(); // 曜日
    const msg = " 今日は" + days[now_d] + "曜日です。";
    return msg;
}

// モード移行 (0:デフォルト, 1:じゃんけん, 2:ダイス)
function set_mode(i)
{
    text = [
        "デフォルト",
        "じゃんけん",
        "ダイス"
    ];

    resp_index = i;
    modeText.innerHTML = 'モード：' + text[i];
    return "";
}

// じゃんけん (0:グー, 1:チョキ, 2:パー)
function rock_papers_scissors(hand0)
{
    const hand1 = Math.floor(Math.random() * 3);
    const flag = (hand0 - hand1 + 3) % 3;
    const handText = ["グー", "チョキ", "パー"];
    const text = [
        "あいこなのでもう一回。じゃんけん…",
        "私の勝ち。まだまだですね。",
        "あなたの勝ち。中々やりますね。"
    ];
    if (flag != 0) resp_index = 0;
    const msg = "私は" + handText[hand1] + "を出しました。" + text[flag];
    return msg;
}

// ダイス
function dice(_max)
{
    const num = Math.floor(Math.random() * _max + 1);
    const text = [
        "逆に考えてください。今日のあなたはとても幸運です。",
        "おめでとうございます。以上です。",
        "小さいほうが良いこともありますよ。",
        "普通ですね。あなたの人生みたいなものです。",
        "大は小を兼ねない場合もあることをお忘れなく。"
    ];

    let index;
    if (num == 1)                   index = 0;
    else if (num < (_max / 4))      index = 1;
    else if (num < (_max * 3 / 4))  index = 2;
    else if (num < (_max * 3 / 4))  index = 3;
    else                            index = 4;

    const msg = num + " が出ました。" + text[index]; 
    return msg;
}

// 文字列を関数として実行
function useFunc(f, n)
{
    return Function('"use strict";return('+ f + '(' + n + '))')();
}

// 文字列から半角数字だけを取り出す
function toInt(text)
{
    let list = text.split('');
    let num = null;
    let nums = [];

    for (i = 0; i < list.length; i++) {
        const n = parseInt(list[i]);
        if (!isNaN(n)) {
            if (num == null) {
                num = n;
            }
            else {
                num = num * 10 + n;
            }
        }
        else if (num != null) {
            nums.push(num);
            num = null;
        }
    }
    if (num != null) {
        nums.push(num);
    }

    return nums;
}

// 認識結果が出力されたときのイベントハンドラ
asr.onresult = function(event) {
    let transcript = event.results[event.resultIndex][0].transcript; // 結果文字列

    let output_not_final = '';
    if (event.results[event.resultIndex].isFinal) { // 結果が確定（Final）のとき
	    asr.abort(); // 音声認識を停止

        let answer;

        let keys = Object.keys(response[resp_index]);
        keys.forEach(function(key) {
            let flag = true;
            console.log(transcript);
            key.split(',').forEach(function(word) {              
                let pattern = new RegExp(word);
                let flag_test = pattern.test(transcript); // マッチしたらtrue, しなかったらfalse
                flag = flag && flag_test; // 両方trueならtrue
                console.log(pattern + '+' + ':' + flag_test);
                //flag = flag && new RegExp(word).test(transcript);
            });

            if (flag) {
                let resp = response[resp_index][key];
		        answer = resp[0];

                if (typeof resp[1] != 'undefined') {
                    if (resp[2] == "num") {
                        const nums = toInt(transcript);
                        const num = nums[nums.length-1];
                        answer += useFunc(resp[1], num);
                    }
                    else {
                        answer += useFunc(resp[1], resp[2]);
                    }
                }

                console.log(key + " : " + answer);
            }
        });

        if (typeof answer == 'undefined') {
	        answer = "すみません、よくわかりません。";
            resp_index = 0;
    	}

        let queryURL = URL + APIID + "&intext=" + transcript;
		console.log(queryURL);
		
		// HTTPリクエストの準備
		const request = new XMLHttpRequest();
		request.open('GET', queryURL, true);
		request.responseType = 'json'; // レスポンスはJSON形式に変換
	
		// HTTPの状態が変化したときのイベントハンドラ
		request.onreadystatechange = function() {
            // readyState == 4 操作完了
            // status == 200 リクエスト成功（HTTPレスポンス）
    		if (this.readyState == 4 && this.status == 200) {
				let res = this.response; // 結果はJSON形式
				Object.keys(res.result).forEach(function(key) {
					console.log(key + ": " + res.result[key])
				});
			}
		}
        // HTTPリクエストの実行
		request.send();

        output += transcript + ' => ' + answer + '<br>';

	    tts.text = answer;
	    // 再生が終了（end）ときのイベントハンドラ（終了したときに実行される）
	    tts.onend = function(_event){
	        asr.start(); // 音声認識を再開
	    }

	    speechSynthesis.speak(tts); // 再生
    } else { // 結果がまだ未確定のとき
        output_not_final = '<span style="color:#d0d0d0;">' + transcript + '</span>';
    }
    resultOutput.innerHTML = output + output_not_final;
}

// 開始ボタンのイベントハンドラ
startButton.addEventListener('click', function() {
    asr.start();
    isActive.innerHTML = '<span style="color:#007fff">音声認識：オン</span>';
});

// 停止ボタンのイベントハンドラ
stopButton.addEventListener('click', function() {
    asr.abort();
    asr.stop();
    isActive.innerHTML = '<span style="color:#000000">音声認識：オフ</span>';
});
