
const toggleButton = document.querySelector('#toggleButton'); // 開始／停止ボタン
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
let prev_index;
let output;
let active;

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
            "名前": ["ゆうかと言います。"],
            "何歳": ["私はまだ生まれたばかりの0歳です。"],
            "こんにちは": ["こんにちは。", "introduce", ""],
            "こんばんは": ["こんばんは。", "introduce", ""],
            "おはよう": ["おはようございます。", "introduce", ""],
            "おやすみ": ["おやすみなさい。"],
            "よろしく": ["よろしくお願いします。"],
            "ありがとう": ["どういたしまして。"],
            "元気": ["はい、私は元気です。"],
            "Alexa": ["私に喧嘩を売っているのですか？"],
            "Ok Google": ["そういうのは良くないと思います。"],
            "Hey Siri": ["私を他社の製品と一緒にしないでください。"],
            "何月": ["", "resp_Date", ""],
            "何日": ["", "resp_Date", ""],
            "何時": ["", "resp_Time", ""],
            "何分": ["", "resp_Time", ""],
            "曜日": ["", "resp_Day", ""],
            "じゃんけん": ["", "set_mode", 2],
            "ダイス": ["", "set_mode", 3]
        },
        {
            "はい": ["", "retry_or_continue", true],
            "いいえ": ["", "retry_or_continue", false],
            "うん": ["", "retry_or_continue", true],
            "もう一回": ["", "retry_or_continue", true],
            "もう一度": ["", "retry_or_continue", true],
            "いや": ["", "retry_or_continue", false],
            "やめ": ["", "retry_or_continue", false],
            "遠慮": ["", "retry_or_continue", false],
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

    active = false;
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
    text = "私の名前はゆうかです。じゃんけんやダイスなどで人を楽しませるのが得意です。";
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

// モード移行
function set_mode(i)
{
    mode_text = [
        "デフォルト",
        "もう一回？",
        "じゃんけん",
        "ダイス"
    ];
    text = [
        "また遊んでくださいね。",
        "もう一回やりますか？",
        "じゃんけんモードに移行。じゃんけん…",
        "ダイスモードに移行。ダイスの面の数を指定してください。"
    ];

    prev_index = resp_index;
    resp_index = i;
    modeText.innerHTML = '現在のモード：' + mode_text[i];
    return text[i];
}

// はい／いいえ　(true/false)
function retry_or_continue(_flag)
{
    if (_flag) return set_mode(prev_index);
    return set_mode(0); 
}

// じゃんけん (0:グー, 1:チョキ, 2:パー)
function rock_papers_scissors(hand0)
{
    const hand1 = Math.floor(Math.random() * 3);
    const flag = (hand0 - hand1 + 3) % 3;
    const handText = ["グー", "チョキ", "パー"];
    const text = [
        "あいこなのでもう一回。じゃんけん…",
        "私の勝ち。",
        "あなたの勝ち。"
    ];
    let msg = "私は" + handText[hand1] + "を出しました。" + text[flag];
    if (flag != 0) msg += set_mode(1);
    return msg;
}

// ダイス
function dice(_max)
{
    const num = Math.floor(Math.random() * _max + 1);
    const text = [
        "逆に考えてください。あなたは今とても幸運です。",
        "小さいほうが良いこともありますよ。",
        "普通ですね。まあいいでしょう。",
        "まあ、大きければ良いとも限りませんし。",
        "おめでとうございます。以上です。"
    ];

    let index;
    if (num == 1)                   index = 0;
    else if (num < (_max / 4))      index = 1;
    else if (num < (_max * 3 / 4))  index = 2;
    else if (num < _max)            index = 3;
    else                            index = 4;

    const msg = num + " が出ました。" + text[index] + set_mode(1);
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
    	}

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
toggleButton.addEventListener('click', function() {
    active = !active;

    if (active) {
        asr.start();
        isActive.innerHTML = '<span style="color:#007fff">音声認識：オン</span>';
        toggleButton.innerHTML = '<span style="color:#ff3f3f">音声認識を停止</span>';
    }
    else {
        asr.abort();
        asr.stop();
        isActive.innerHTML = '<span style="color:#000000">音声認識：オフ</span>';
        toggleButton.innerHTML = '<span style="color:#1f7f1f">音声認識を開始</span>';
    }
});
