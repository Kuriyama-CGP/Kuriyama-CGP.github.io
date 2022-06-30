
const URL = "https://jlp.yahooapis.jp/NLUService/V1/analyze?appid="; // APIのリクエストURL
const APIID = "dj00aiZpPTFvMWZrRmo1ZGtjeCZzPWNvbnN1bWVyc2VjcmV0Jng9YjA-"; // あなたのアプリケーションID

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

let output = ''; // 出力

// 認識結果が出力されたときのイベントハンドラ
asr.onresult = function(event) {
    let transcript = event.results[event.resultIndex][0].transcript; // 結果文字列

    let output_not_final = '';
    if (event.results[event.resultIndex].isFinal) { // 結果が確定（Final）のとき
	    asr.abort(); // 音声認識を停止

		let queryURL = URL + APIID + "&intext=" + transcript;
		console.log(queryURL);
		
		// HTTPリクエストの準備
		const request = new XMLHttpRequest();
		request.open('GET', queryURL, true);
		request.responseType = 'json'; // レスポンスはJSON形式に変換
	
		// HTTPの状態が変化したときのイベントハンドラ
		request.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
    		// readyState == 4 操作完了
    		// status == 200 リクエスト成功（HTTPレスポンス）
				
				let res = this.response; // 結果はJSON形式

				Object.keys(res.result).forEach(function(key) {
					console.log(key + ": " + res.result[key])
				});
			
				// method が SAY のときのみ
				if(res.result.method == "SAY"){
					var answer = res.result.param_text_tts || res.result.param_text;
					tts.text = answer;

	    			// 再生が終了（end）ときのイベントハンドラ（終了したときに実行される）
	    			tts.onend = function(event){
	        			asr.start(); // 音声認識を再開
	    			}
	    	
					output += transcript + ' => ' + answer + '<br>';
					resultOutput.innerHTML = output;
	    			speechSynthesis.speak(tts); // 再生
				} else {
					asr.start();  // 音声認識を再開
				}
			}
		}
		// HTTPリクエストの実行
		request.send();

    } else { // 結果がまだ未確定のとき
        output_not_final = '<span style="color:#ddd;">' + transcript + '</span>';
		resultOutput.innerHTML = output + output_not_final;
	}
}

// 開始ボタンのイベントハンドラ
startButton.addEventListener('click', function() {
    asr.start();
})

// 停止ボタンのイベントハンドラ
stopButton.addEventListener('click', function() {
    asr.abort();
    asr.stop();
})
