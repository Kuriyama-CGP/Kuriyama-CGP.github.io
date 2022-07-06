
const startButton = document.querySelector('#startButton'); // 開始ボタン
const stopButton = document.querySelector('#stopButton'); // 停止ボタン
const resultOutput = document.querySelector('#resultOutput'); // 結果出力エリア
const isActive = document.querySelector('#isActive'); // 音声認識のオンオフ

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
            "あなた,誰": ["私は音声対話プログラムです。"],
            "名前": ["私の名前はまだありません。"],
            "何歳": ["私はまだ生まれたばかりの0歳です。"],
            "こんにちは": ["こんにちは。"],
            "こんばんは": ["こんばんは。"],
            "おはよう": ["おはようございます。"],
            "おやすみ": ["おやすみなさい。"],
            "よろしく": ["よろしくお願いします。"],
            "ありがとう": ["どういたしまして。"],
            "元気": ["はい、私は元気です。"],
            "何月": ["", "resp_Date()"],
            "何日": ["", "resp_Date()"],
            "何時": ["", "resp_Time()"],
            "何分": ["", "resp_Time()"],
            "曜日": ["", "resp_Day()"],
            "じゃんけん": ["じゃんけんモードに移行。じゃんけん…", "set_mode(1)"],
            "ダイス": ["ダイスモードに移行。ダイスの面の数を指定してください。", "set_mode(2)"]
        },
        {
            "Goo": ["", "rock_papers_scissors(0)"],
            "goo": ["", "rock_papers_scissors(0)"],
            "グー": ["", "rock_papers_scissors(0)"],
            "チョキ": ["", "rock_papers_scissors(1)"],
            "パー": ["", "rock_papers_scissors(2)"]
        },
        {
            "[0-9]+" :["", "dice(word)"]
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

// モード移行 (0:デフォルト, 1:じゃんけん)
function set_mode(i)
{
    resp_index = i;
    return "";
}

// じゃんけん (0:グー, 1:チョキ, 2:パー)
function rock_papers_scissors(hand0)
{
        const hand1 = Math.floor(Math.random() * 3);
        const flag = (hand0 - hand1 + 3) % 3;
        const handText = ["グー", "チョキ", "パー"];
        let text;
        switch (flag) {
            case 0:
                text = "あいこなのでもう一回。じゃんけん…";
                resp_index = 1;
                break;
            case 1:
                text = "私の勝ち。まだまだですね。";
                resp_index = 0;
                break;
            case 2:
                text = "あなたの勝ち。中々やりますね。";
                resp_index = 0;
                break;
        }
        const msg = "私は" + handText[hand1] + "を出しました。" + text;
    return msg;
}

function dice(_key)
{
    const max = parseInt(_key);
    if (isNaN(max)) return "";
    const num = Math.floor(Math.random() * max + 1);

    let text;
    if (num == 1) {
        text = "逆に考えてください。今日のあなたはとても幸運です。";
    }
    else if (num == max) {
        text = "おめでとうございます。以上です。";
    }
    else if (num < (max / 3)) {
        text = "小さいほうが良いこともありますよ。";
    }
    else if (num < (max * 3 / 4)) {
        text = "普通ですね。あなたの人生みたいなものです。";
    }
    else {
        text = "大は小を兼ねない場合もあることをお忘れなく。";
    }

    const msg = num + " が出ました。" + text; 
    return msg;
}

// 文字列を関数として実行
function useFunc(f) {
    return Function('"use strict";return('+ f +')')();
}

// 認識結果が出力されたときのイベントハンドラ
asr.onresult = function(event){
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
		        answer = response[resp_index][key][0];

                if (typeof response[resp_index][key][1] != 'undefined') {
                    answer += useFunc(response[resp_index][key][1]);
                }

                console.log(key + " : " + answer);
            }
        });

        if (typeof answer == 'undefined') {
	        answer = "すみません、よくわかりません。";
            resp_index = 0;
    	}

        output += transcript + ' => ' + answer + '<br>';

	    tts.text = answer;
	    // 再生が終了（end）ときのイベントハンドラ（終了したときに実行される）
	    tts.onend = function(_event){
	        asr.start(); // 音声認識を再開
	    }

	    speechSynthesis.speak(tts); // 再生
    } else { // 結果がまだ未確定のとき
        output_not_final = '<span style="color:#dddddd;">' + transcript + '</span>';
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
