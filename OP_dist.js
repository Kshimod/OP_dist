// questionnaire + belief-updating task
// questionnaire = opt+pes (Toyama, 2013) + LOT-R


const jsPsych = initJsPsych({
    on_finish: function()
    {
        //jsPsych.data.displayData("csv")

        // output data in the form of csv
        let filename = `${participantID}_${time}.csv`;
        jsPsych.data.get().localSave("csv", filename)
    }
});

// ======== functions =========
// function to generate random numbers from uniform distribution
function runif(min, max) {
    let a = Math.random();
    b = a * (max-min) + min;
    return b;
};

// function to generate random integer
function runifn(min, max, n) {
    let res_array = [];
    for (let k=0; k<n; k++) {
        let a = Math.random();
        b = Math.floor(a * (max-min+1) + min);
        res_array[k] = b;
    }
    return res_array;
};

// function to generate random numbers from gaussian distribution (using randn func of jStat library)
let rnorm = function (m, sd, o) {
    a = jStat.randn(1);
    b = a*sd + m;
    if (o == 1) { // avoid negative outcome
        if (b < 0) {
            b = 0;
        }
    };
    return b;
};

// function to shuffle the array
function arrayShuffle(array) {
    for(let i = (array.length - 1); 0 < i; i--){
  
      // 0〜(i+1)の範囲で値を取得
      let r = Math.floor(Math.random() * (i + 1));
  
      // 要素の並び替えを実行
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  };

// function to slice arrays into subsets
function  slice_array(array, length) {
    let sliced = [];
    let n_subset = array.length/length;
    console.log(n_subset);
    for (let k=1; k<(n_subset+1); k++) {
        let tmp_list = array.splice(0, length);
        console.log(tmp_list);
        sliced[k-1] = tmp_list;
    };
    return sliced;
};

let start_FS = {// fullscreen
    type: jsPsychFullscreen,
    message: '<p>ウィンドウサイズを最大化します。下のボタンを押してください。</p>',
    button_label: 'Continue',
    fullscreen_mode: true 
};

let stim_cond;
const get_ID = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "<p class='inst_text'>実験実施者から通知されたあなたのIDを回答してください。</p>",
            required: true,
            name: "participant_ID"
        }
    ],
    on_load: function() {
        let element = document.getElementById('input-0');
        element.type = 'number',
        element.min = 1,
        element.max = 9999
    },
    on_finish: function(data) {
        participantID = data.response.participant_ID;
    }
};

let time; // 0=baseline or 1=after intervention
const get_time = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "<p class='inst_text'>これが何回目の実験かを回答してください (1 or 2)。</p>",
            required: true,
            name: "time"
        }
    ],
    on_load: function() {
        let element = document.getElementById('input-0');
        element.type = 'number',
        element.min = 1,
        element.max = 2
    },
    on_finish: function(data) {
        time = data.response.time - 1;
        data.participantID = participantID;
        data.time = time;
        // determine stimulus set based on ID and time
        if (participantID % 4 == 0) {
            stim_cond = 1;
            if (time == 0) {
                //img_list = img_list1;
                event_list = event_list1;
            } else {
                //img_list = img_list2;
                event_list = event_list2;
            };
        }
        else if (participantID % 4 == 1) {
            stim_cond = 2;
            if (time == 0) {
                //img_list = img_list1;
                event_list = event_list2;
            } else {
                //img_list = img_list2;
                event_list = event_list1;
            };
        }
        else if (participantID % 4 == 2) {
            stim_cond = 3;    
            if (time == 0) {
                //img_list = img_list2;
                event_list = event_list1;
            } else {
                //img_list = img_list1;
                event_list = event_list2;            
            };
        }
        else if (participantID % 4 == 3) {
            stim_cond = 4;
            if (time == 0) {
                //img_list = img_list2;
                event_list = event_list2;
            } else {
                //img_list = img_list1;
                event_list = event_list1;
            };
        };
        //console.log(img_list);
        console.log(event_list);
        // slice the image array into 12 subsets of length of 5
        //img = slice_array(img_list, 5);
    }
};

// ======== Questionnaire ========
let trickAns; // answer for trick question. Answer other than 3 is invalid.

// age
const age = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "<p class='event'>あなたの年齢を回答してください。",
            required: true,
            name: "age"
        }
    ],
    button_label: "Enter",
    on_load: function() {
        let element = document.getElementById('input-0');
        element.type = 'number',
        element.min =18,
        element.max = 30
    },
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "age";
        data.time = time;
        data.Age = data.response.age;
    }
};

// biological sex
const scale_sex = [
    "<p class='scale_text'>女性",
    "<p class='scale_text'>男性",
    "<p class='scale_text'>どちらでもない"
];

const biol_sex = {
    type: jsPsychSurveyLikert,
    questions: [
      {
        prompt: "<p class='inst_text'>あなたの生物学的性を回答してください。", 
        name: 'biol_sex', 
        labels: scale_sex,
        required: true
    }
    ],
    button_label: '次へ',
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "biol_sex";
        data.time = time;
        data.biol_sex = data.response.biol_sex; // 0=f, 1=m, 2=neither
    }
};

// general instruction for questionnaires
q_inst_text = '<p class="scale_text">これからお答えいただく質問紙では、あなたの<b>「普段の様子」</b>についてお聞きするものと、<br>' +
    '<b>「いまこの瞬間の様子」</b>についてお聞きするものがあります。<br>冒頭の教示文を読み、<b>どちらについて聞かれているのかを必ず' +
    'ご確認のうえ、</b><br>それぞれの質問紙にお答えするようお願いいたします。</p>';
let q_inst = {
    type: jsPsychHtmlButtonResponse,
    stimulus: q_inst_text,
    choices: ['了解しました'],
    prompt: ""
};

// LOT-R
const scale_LOTR = [
    "<p class='scale_text'>1 強くそう思わない", 
    "<p class='scale_text'>2", 
    "<p class='scale_text'>3", 
    "<p class='scale_text'>4",
    "<p class='scale_text'>5 強くそう思う"
];
  
let LOTR_qs = [
    "<p class='scale_text'>はっきりしないときでも，ふだん私は最も良いことを期待している",
    "<p class='scale_text'>何か私にとってうまくいかなくなる可能性があれば，それはきっとそうなるものだ",
    "<p class='scale_text'>私は自分の将来についていつも楽観的である",
    "<p class='scale_text'>私はものごとが自分の思い通りにいくとはほとんど思っていない",
    "<p class='scale_text'>良いことが私に起こるなんてほとんどあてにしていない",
    "<p class='scale_text'>概して，私は悪いことよりも良いことの方が自分の身に起こると思う"
];

const LOTR = {
    type: jsPsychSurveyLikert,
    preamble: function() {
        let text;
        text = "<p class='inst_text'>下に呈示する項目について，あなたが<b><u>普段どのように";
        text += "思っているか</b></u>を，5段階から選んでお答えください。<br>";
        return text;
    },
    questions: [
      {prompt: LOTR_qs[0], name: 'lotr_1', labels: scale_LOTR, required: true},
      {prompt: LOTR_qs[1], name: 'lotr_2', labels: scale_LOTR, required: true},
      {prompt: LOTR_qs[2], name: 'lotr_3', labels: scale_LOTR, required: true},
      {prompt: LOTR_qs[3], name: 'lotr_4', labels: scale_LOTR, required: true},
      {prompt: LOTR_qs[4], name: 'lotr_5', labels: scale_LOTR, required: true},
      {prompt: LOTR_qs[5], name: 'lotr_6', labels: scale_LOTR, required: true}
    ],
    button_label: '次へ',
    randomize_question_order: true,
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "LOTR";
        data.time = time; 
        data.stim_cond = stim_cond;
        data.LOTR1 = Number(data.response.lotr_1) + 1;
        data.LOTR2 = Number(data.response.lotr_2) + 1;
        data.LOTR3 = Number(data.response.lotr_3) + 1;
        data.LOTR4 = Number(data.response.lotr_4) + 1;
        data.LOTR5 = Number(data.response.lotr_5) + 1;
        data.LOTR6 = Number(data.response.lotr_6) + 1;
    }
};

// Japanese optimism and pessimism scale (JOPS)
const scale_JOPS = [
    "<p class='scale_text'>1 全く当てはまらない", 
    "<p class='scale_text'>2", 
    "<p class='scale_text'>3", 
    "<p class='scale_text'>4 よくあてはまる"
];
  
let JOPS_qs = [
    "<p class='scale_text'>自分の将来は、恵まれていると思う",
    "<p class='scale_text'>自分の将来は、良いことが起こると思う",
    "<p class='scale_text'>自分の将来に期待が持てる",
    "<p class='scale_text'>自分の将来を楽しみにしている",
    "<p class='scale_text'>これからの人生は良いものになるだろうと思う",
    "<p class='scale_text'>結果が予想できない時は、良い方向に期待する",
    "<p class='scale_text'>私は将来に対して、前向きに考えている",
    "<p class='scale_text'>私には、悪いことよりも良いことが起こると思う",
    "<p class='scale_text'>何かに取りかかる時は、成功するだろうと考える",
    "<p class='scale_text'>将来、幸せになれると思う",
    "<p class='scale_text'>何かに取りかかる時は、失敗するだろうと考える",
    "<p class='scale_text'>何をしても、うまくいかないことばかりを想像する",
    "<p class='scale_text'>何かを計画する時、失敗している自分の姿が頭に浮かぶ",
    "<p class='scale_text'>今後のことを考えると、悪いことばかりが頭に浮かぶ",
    "<p class='scale_text'>望ましくない、未来の自分の姿ばかりを想像する",
    "<p class='scale_text'>私の将来は、暗いと思う",
    "<p class='scale_text'>自分の将来に絶望している",
    "<p class='scale_text'>結局、自分の目標は達成できないだろう",
    "<p class='scale_text'>何もかもが悪い方向にしか進まないだろうと思う",
    "<p class='scale_text'>私の望みはかなわないと思う"
];

// trait optimism/pessimism
const JOPS_trait = {
    type: jsPsychSurveyLikert,
    preamble: function() {
        let text;
        text = "<p class='inst_text'>下に呈示する項目が，<b><u>普段の";
        text += "自分</b></u>にどの程度当てはまるか，5段階から選んでお答えください。<br>";
        return text;
    },
    questions: [
      {prompt: JOPS_qs[0], name: 'jops_t_1', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[1], name: 'jops_t_2', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[2], name: 'jops_t_3', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[3], name: 'jops_t_4', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[4], name: 'jops_t_5', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[5], name: 'jops_t_6', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[6], name: 'jops_t_7', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[7], name: 'jops_t_8', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[8], name: 'jops_t_9', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[9], name: 'jops_t_10', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[10], name: 'jops_t_11', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[11], name: 'jops_t_12', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[12], name: 'jops_t_13', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[13], name: 'jops_t_14', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[14], name: 'jops_t_15', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[15], name: 'jops_t_16', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[16], name: 'jops_t_17', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[17], name: 'jops_t_18', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[18], name: 'jops_t_19', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs[19], name: 'jops_t_20', labels: scale_JOPS, required: true}
    ],
    button_label: '次へ',
    randomize_question_order: true,
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "jops_trait";
        data.time = time; 
        data.stim_cond = stim_cond;
        // (trait) optimism
        data.optT1 = Number(data.response.jops_t_1) + 1;
        data.optT2 = Number(data.response.jops_t_2) + 1;
        data.optT3 = Number(data.response.jops_t_3) + 1;
        data.optT4 = Number(data.response.jops_t_4) + 1;
        data.optT5 = Number(data.response.jops_t_5) + 1;
        data.optT6 = Number(data.response.jops_t_6) + 1;
        data.optT7 = Number(data.response.jops_t_7) + 1;
        data.optT8 = Number(data.response.jops_t_8) + 1;
        data.optT9 = Number(data.response.jops_t_9) + 1;
        data.optT10 = Number(data.response.jops_t_10) + 1;
        // (trait) pessimism
        data.pesT1 = Number(data.response.jops_t_11) + 1;
        data.pesT2 = Number(data.response.jops_t_12) + 1;
        data.pesT3 = Number(data.response.jops_t_13) + 1;
        data.pesT4 = Number(data.response.jops_t_14) + 1;
        data.pesT5 = Number(data.response.jops_t_15) + 1;
        data.pesT6 = Number(data.response.jops_t_16) + 1;
        data.pesT7 = Number(data.response.jops_t_17) + 1;
        data.pesT8 = Number(data.response.jops_t_18) + 1;
        data.pesT9 = Number(data.response.jops_t_19) + 1;
        data.pesT10 = Number(data.response.jops_t_20) + 1;
    }
};

let JOPS_qs_state = [
    "<p class='scale_text'>自分の将来は、恵まれていると思う",
    "<p class='scale_text'>自分の将来は、良いことが起こると思う",
    "<p class='scale_text'>自分の将来に期待が持てる",
    "<p class='scale_text'>自分の将来を楽しみにしている",
    "<p class='scale_text'>これからの人生は良いものになるだろうと思う",
    //"<p class='scale_text'>結果が予想できない時は、良い方向に期待する",
    "<p class='scale_text'>私は将来に対して、前向きに考えている",
    "<p class='scale_text'>私には、悪いことよりも良いことが起こると思う",
    //"<p class='scale_text'>何かに取りかかる時は、成功するだろうと考える",
    "<p class='scale_text'>将来、幸せになれると思う",
    //"<p class='scale_text'>何かに取りかかる時は、失敗するだろうと考える",
    "<p class='scale_text'>何をしても、うまくいかないことばかりを想像する",
    //"<p class='scale_text'>何かを計画する時、失敗している自分の姿が頭に浮かぶ",
    "<p class='scale_text'>今後のことを考えると、悪いことばかりが頭に浮かぶ",
    "<p class='scale_text'>望ましくない、未来の自分の姿ばかりを想像する",
    "<p class='scale_text'>私の将来は、暗いと思う",
    "<p class='scale_text'>自分の将来に絶望している",
    "<p class='scale_text'>結局、自分の目標は達成できないだろう",
    "<p class='scale_text'>何もかもが悪い方向にしか進まないだろうと思う",
    "<p class='scale_text'>私の望みはかなわないと思う"
];

// state optimism/pessimism
const JOPS_state = {
    type: jsPsychSurveyLikert,
    preamble: function() {
        let text;
        text = "<p class='inst_text'>下に呈示する項目が，<b><u>たった今，";
        text += "この瞬間の自分</b></u>にどの程度当てはまるか，5段階から選んでお答えください。<br>";
        text += "各項目について，それより前の項目のことは考えず，その項目一つに対する感覚に基づいて，";
        text += "できる限り正確に答えるようにしてください。<br>";
        return text;
    },
    questions: [
      {prompt: JOPS_qs_state[0], name: 'jops_s_1', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[1], name: 'jops_s_2', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[2], name: 'jops_s_3', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[3], name: 'jops_s_4', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[4], name: 'jops_s_5', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[5], name: 'jops_s_6', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[6], name: 'jops_s_7', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[7], name: 'jops_s_8', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[8], name: 'jops_s_9', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[9], name: 'jops_s_10', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[10], name: 'jops_s_11', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[11], name: 'jops_s_12', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[12], name: 'jops_s_13', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[13], name: 'jops_s_14', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[14], name: 'jops_s_15', labels: scale_JOPS, required: true},
      {prompt: JOPS_qs_state[15], name: 'jops_s_16', labels: scale_JOPS, required: true}
    ],
    button_label: '次へ',
    randomize_question_order: true,
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "jops_state";
        data.time = time; 
        data.stim_cond = stim_cond;
        // (state) optimism
        data.optS1 = Number(data.response.jops_s_1) + 1;
        data.optS2 = Number(data.response.jops_s_2) + 1;
        data.optS3 = Number(data.response.jops_s_3) + 1;
        data.optS4 = Number(data.response.jops_s_4) + 1;
        data.optS5 = Number(data.response.jops_s_5) + 1;
        data.optS6 = Number(data.response.jops_s_6) + 1;
        data.optS7 = Number(data.response.jops_s_7) + 1;
        data.optS8 = Number(data.response.jops_s_8) + 1;
        // (state) pessimism
        data.pesS1 = Number(data.response.jops_s_9) + 1;
        data.pesS2 = Number(data.response.jops_s_10) + 1;
        data.pesS3 = Number(data.response.jops_s_11) + 1;
        data.pesS4 = Number(data.response.jops_s_12) + 1;
        data.pesS5 = Number(data.response.jops_s_13) + 1;
        data.pesS6 = Number(data.response.jops_s_14) + 1;
        data.pesS7 = Number(data.response.jops_s_15) + 1;
        data.pesS8 = Number(data.response.jops_s_16) + 1;
    }
};

// CES-D
const scale_cesd = [
    "<p class='scale_text'>ない (1日未満)", 
    "<p class='scale_text'>1～2日", 
    "<p class='scale_text'>3～4日", 
    "<p class='scale_text'>5日以上"
];

let cesd_qs = [
    "<p class='scale_text'>普段はなんでもないことがわずらわしい。",
    "<p class='scale_text'>食べたくない。食欲が落ちた。",
    "<p class='scale_text'>家族や友人からはげましてもらっても，気分が晴れない。",
    "<p class='scale_text'>他の人と同じ程度には，能力があると思う", // reverse, 3
    "<p class='scale_text'>物事に集中できない。",
    "<p class='scale_text'>ゆううつだ。",
    "<p class='scale_text'>何をするのも面倒だ。",
    "<p class='scale_text'>これから先のことについて，積極的に考えることができる。", // reverse, 7
    "<p class='scale_text'>過去のことについて，くよくよ考える。",
    "<p class='scale_text'>何か恐ろしい気持ちがする。",
    "<p class='scale_text'>なかなか眠れない。",
    "<p class='scale_text'>生活について不満なく過ごせる。", // reverse, 11
    "<p class='scale_text'>普段より口数が少ない。口が重い。",
    "<p class='scale_text'>一人ぼっちでさびしい。",
    "<p class='scale_text'>皆がよそよそしいと思う。",
    "<p class='scale_text'>毎日が楽しい。", // reverse, 15
    "<p class='scale_text'>急に泣き出すことがある。",
    "<p class='scale_text'>悲しいと感じる。",
    "<p class='scale_text'>皆が自分を嫌っていると感じる。",
    "<p class='scale_text'>仕事が手につかない。", 
    "<p class='scale_text'>1日のうちに100mL以上の水分を摂取した。" // trick question, 20
];

const ces_d = {
    type: jsPsychSurveyLikert,
    preamble: function() {
        let text;
        text = "<p class='inst_text'>この1週間の，あなたのからだや心の状態についてお聞きします。<br>";
        text += "下に呈示する20項目について，もし，<b>この1週間で</b>全くないか，";
        text += "あったとしても1日も続かない場合には「ない (1日未満)」を，週のうち1～2日，";
        text += "3～4日，5日以上の時は，それぞれ当てはまるものを選択してください。</p>";
        return text;
    },
    questions: [
      {prompt: cesd_qs[0], name: 'cesd_1', labels: scale_cesd, required: true},
      {prompt: cesd_qs[1], name: 'cesd_2', labels: scale_cesd, required: true},
      {prompt: cesd_qs[2], name: 'cesd_3', labels: scale_cesd, required: true},
      {prompt: cesd_qs[3], name: 'cesd_4_rev', labels: scale_cesd, required: true},
      {prompt: cesd_qs[4], name: 'cesd_5', labels: scale_cesd, required: true},
      {prompt: cesd_qs[5], name: 'cesd_6', labels: scale_cesd, required: true},
      {prompt: cesd_qs[6], name: 'cesd_7', labels: scale_cesd, required: true},
      {prompt: cesd_qs[7], name: 'cesd_8_rev', labels: scale_cesd, required: true},
      {prompt: cesd_qs[8], name: 'cesd_9', labels: scale_cesd, required: true},
      {prompt: cesd_qs[9], name: 'cesd_10', labels: scale_cesd, required: true},
      {prompt: cesd_qs[10], name: 'cesd_11', labels: scale_cesd, required: true},
      {prompt: cesd_qs[11], name: 'cesd_12_rev', labels: scale_cesd, required: true},
      {prompt: cesd_qs[12], name: 'cesd_13', labels: scale_cesd, required: true},
      {prompt: cesd_qs[13], name: 'cesd_14', labels: scale_cesd, required: true},
      {prompt: cesd_qs[14], name: 'cesd_15_rev', labels: scale_cesd, required: true},
      {prompt: cesd_qs[15], name: 'cesd_16', labels: scale_cesd, required: true},
      {prompt: cesd_qs[16], name: 'cesd_17', labels: scale_cesd, required: true},
      {prompt: cesd_qs[17], name: 'cesd_18', labels: scale_cesd, required: true},
      {prompt: cesd_qs[18], name: 'cesd_19', labels: scale_cesd, required: true},
      {prompt: cesd_qs[19], name: 'cesd_20', labels: scale_cesd, required: true},
      {prompt: cesd_qs[20], name: 'cesd_21_trick', labels: scale_cesd, required: true},
    ],
    button_label: '次へ',
    randomize_question_order: true,
    on_finish: function(data) {
        data.participantID = participantID;
        data.timing = "ces_d";
        data.time = time;
        data.stim_cond = stim_cond;
        data.cesd1 = data.response.cesd_1;
        data.cesd2 = data.response.cesd_2;
        data.cesd3 = data.response.cesd_3;
        data.cesd4 = 4 - Number(data.response.cesd_4_rev);
        data.cesd5 = data.response.cesd_5;
        data.cesd6 = data.response.cesd_6;
        data.cesd7 = data.response.cesd_7;
        data.cesd8 = 4 - Number(data.response.cesd_8_rev);
        data.cesd9 = data.response.cesd_9;
        data.cesd10 = data.response.cesd_10;
        data.cesd11 = data.response.cesd_11;
        data.cesd12 = 4 - Number(data.response.cesd_12_rev);
        data.cesd13 = data.response.cesd_13;
        data.cesd14 = data.response.cesd_14;
        data.cesd15 = 4 - Number(data.response.cesd_15_rev);
        data.cesd16 = data.response.cesd_16;
        data.cesd17 = data.response.cesd_17;
        data.cesd18 = data.response.cesd_18;
        data.cesd19 = data.response.cesd_19;
        data.cesd20 = data.response.cesd_20;
        data.trick = data.response.cesd_21_trick;
        trickAns = data.response.cesd_21_trick;
    }
};

// ======== Confirmation quiz for the tasks =========
// ----- Belief updating task ------
let but_q1_correct;
let but_q2_correct;
let but_q3_correct;
let but_correct = 0;

const but_q1_option = [
    "世界中からランダムに選んだ一人",
    "日本人の誰か",
    "自分と似たような誰か"
];

const but_q2_option = [
    "自分と近い属性（生物学的性と年齢）を持つ一般人口が経験する可能性",
    "日本の人口一般がそれを経験する可能性",
    "世界の人口一般がそれを経験する可能性"
];

const but_q3_option = [
    "必ず1回目と2回目で違う値を答える必要がある",
    "なるべく一般人口の統計に近い値を回答するのが望ましい",
    "自由に回答してよい"
];

const but_q1 = {
    type:  jsPsychSurveyMultiChoice,
    questions: [
      {prompt: "<p class='inst_text'>この実験における「他のだれか」とは，どのような人物を指すでしょうか？", 
      name: 'but_q1', options: but_q1_option, required:true}, 
    ],
    button_label: '次へ',
    on_finish: function(data) {
      let but_q1_ans = data.response.but_q1;
      if (but_q1_ans == "自分と似たような誰か") {
          but_q1_correct = 1;
          but_correct += 1;
      };
      data.but_q1_correct = but_q1_correct;
      data.but_correct = but_correct;
    }
};
  
const but_q1_res = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        if (but_q1_correct == 1) {
            text = "<p class='inst_text'>正解です！<br>";
            text += "「自分と似た属性（生物学的性，年齢）を持つ一般的な誰か」を指します。<br>";
            text += "スペースキーを押して次の問題へ進んでください。</p>";
        } else {
            text = "<p class='inst_text'>不正解です。<br>";
            text += "「<b>自分と似た属性（生物学的性，年齢）を持つ一般的な誰か</b>」を指します。<br>";
            text += "スペースキーを押して次の問題へ進んでください。</p>";
        };
        return text;
    },
    choices: [" "]
};

const but_q2 = {
    type:  jsPsychSurveyMultiChoice,
    questions: [
      {prompt: "<p class='inst_text'>この実験で呈示される，「実際にそのイベントを経験する一般的な可能性」とはどのようなものでしょうか？", 
      name: 'but_q2', options: but_q2_option, required:true}, 
    ],
    button_label: '次へ',
    on_finish: function(data) {
      let but_q2_ans = data.response.but_q2;
      if (but_q2_ans == "自分と近い属性（生物学的性と年齢）を持つ一般人口が経験する可能性") {
          but_q2_correct = 1;
          but_correct += 1;
      };
      data.but_q2_correct = but_q2_correct;
      data.but_correct = but_correct;
    }
  };
  
  const but_q2_res = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
          let text;
          if (but_q2_correct == 1) {
              text = "<p class='inst_text'>正解です！<br>";
              text += "自分と類似した属性（生物学的性と年齢）の一般人口がそのイベントを経験する可能性のことを指します。<br>";
              text += "スペースキーを押して次の問題へ進んでください。</p>";
          } else {
              text = "<p class='inst_text'>不正解です。<br>";
              text += "<b>自分と類似した属性（生物学的性と年齢）の一般人口</b>がそのイベントを経験する可能性のことを指します。<br>";
              text += "スペースキーを押して次の問題へ進んでください。</p>";
          };
          return text;
      },
      choices: [" "]
  };

const but_q3 = {
    type:  jsPsychSurveyMultiChoice,
    questions: [
      {prompt: function() {
        let text;
        text = "<p class='inst_text'>この実験では1回すべてのイベントについて可能性を判断したのち，"; 
        text += "実際の統計による「一般に経験する可能性」を踏まえてもう一度同じイベントについて";
        text += "可能性を判断していただきます。2回目の判断の仕方について，";
        text += "正しいことを述べている文章を選んでください。";
        return text;
      }, 
      name: 'but_q3', options: but_q3_option, required:true}, 
    ],
    button_label: '次へ',
    on_finish: function(data) {
      let but_q3_ans = data.response.but_q3;
      if (but_q3_ans == "自由に回答してよい") {
          but_q3_correct = 1;
          but_correct += 1;
      };
      data.but_q3_correct = but_q3_correct;
      data.but_correct = but_correct;
    }
};
  
const but_q3_res = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        if (but_q3_correct == 1) {
            text = "<p class='inst_text'>正解です！<br>";
            text += "この実験の回答には正解や間違いはありません。<br>";
            text += "自由に回答してください。<br>";
        } else {
            text = "<p class='inst_text'>不正解です。<br>";
            text += "<b>この実験の回答には正解や間違いはありません</b>。<br>";
            text += "自由に回答してください。<br>";
        };
        text += "では，スペースキーを押して次へ進んでください。<br>";
        text += "全問正解でない場合には，最初の問題に戻ります。</p>";
        return text;
    },
    choices: [" "]
};

// timeline for quiz
const but_quiz = {
    timeline: [
        but_q1,
        but_q1_res,
        but_q2,
        but_q2_res,
        but_q3,
        but_q3_res
    ],
    loop_function: function() {
        if (but_correct < 3) {
            but_correct = 0;
            return true;
        } else {
            return false;
        };
    }
};


// load slides for instruction
const BUT_slides = [
    "introduction_BUT/スライド1.PNG",
    "introduction_BUT/スライド2.PNG",
    "introduction_BUT/スライド3.PNG",
    "introduction_BUT/スライド4.PNG",
    "introduction_BUT/スライド5.PNG",
    "introduction_BUT/スライド6.PNG"
];

const preload3 = {
    type: jsPsychPreload,
    images: BUT_slides
};

// ======== Belief-updating task ========
// two sessions of 40 trials each. Without asking confidence
// First session: Initial estimate -> base rate estimate -> actual base rate
// Second session: Actual base rate -> second estimate for self -> second for other
let event_list; // events to use
let tn_bu = 40; // total trial number in the session
let tn_block_bu = 20; // total trial number in block
let tIdx_bu = 1; // trial index in the session
let tIdx_prac = 1;
let tIdx_in_block_bu = 1; // trial index in one block (1-20)
let tn_prac = 3; // the number of whole practice trials
let good = Array(10).fill("good");
let bad = Array(10).fill("bad");
let good_tIdx = 1; // trial index of good trials in a block (1-10)
let bad_tIdx = 1; // trial index of bad trials in a block (1-10)
let cond_array = good.concat(bad); // array to determine the condition at each trial (good OR bad)
cond_array = jsPsych.randomization.shuffle(cond_array);
let cond_list = Array(tn_bu).fill(0);
let bn = 1; // block number (to count)
let block_n = 4; // the number of whole blocks
let br_manip_good = jsPsych.randomization.shuffle([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); // initial values
let br_manip_bad = jsPsych.randomization.shuffle([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); // initial values
let initial_belief; // estimated first self rate
let initial_belief_list = Array(tn_bu).fill(0);
let initial_belief_list_prac = Array(tn_prac).fill(0);
let BR_estimated; // estimated base rate
let BR_estimated_list = Array(tn_bu).fill(0);
let BR_estimated_list_prac = Array(tn_prac).fill(0);
let true_BR; // true (actually manipulated) BR
let true_BR_list = Array(tn_bu).fill(0);
let second_belief; // estimated second self rate
let second_base_rate; // estimated second base rate
let current_cond; // current condition
let EE; // estimation error in the expected direction
        // Good condition: BR_estimated - true_BR, Bad condition: true_BR - BR_estimated
let EE_list = Array(tn_bu).fill(0);
let upd_self; // the degree of update for self: Good: Initial - second, Bad: second - initial
let upd_other; // the degree of update for other
let EE_sign_match; // whether the sign of EE and EE_base_rate is the same or not
let placeholder = "1-90";

// tentative
let event_list1 = [
    "オンラインショッピングでの詐欺にあう", "車上荒らしにあう（自動車等の車内の金品を盗まれる）", 
    "変形性膝関節症（ひざの痛みや腫れを引き起こす）にかかる", "パートナーに浮気される",
    "借金する", "飛行機に乗り遅れる",
    "80歳よりも前に死ぬ", "トラウマとなるような出来事を目撃する",
    "強盗の被害にあう", "骨折する",
    "うつ病にかかる", "心不全を起こす",
    "肥満状態になる", "慢性的な高血圧になる",
    "2型糖尿病（いわゆる「糖尿病」）にかかる", "脊髄の疾患にかかる",
    "深刻な聴覚障害を経験する", "不妊症を経験する",
    "車が盗難される", "認知症にかかる",
    "胆石症（胆のうや胆管に石ができる病気）にかかる", "虫垂炎（いわゆる「盲腸」）にかかる",
    "グルテン不耐症（グルテン摂取により心身の不調が生じる）となる", "加齢に伴い重大な視覚障害を経験する",
    "慢性的な耳鳴りを経験する", "アルコール依存に陥る",
    "パーキンソン病にかかる", "パソコンが壊れて重大なデータを失う",
    "解雇される", "重いやけどを経験する",
    "3週間以上の入院をする", "慢性的な腰痛を経験する",
    "職場で（物理的ではない）いじめにあう", "動脈硬化を起こす",
    "スリ被害にあう", "肝炎 (肝臓の炎症) にかかる",
    "物理的暴力の被害にあう", "重大な歯の問題を抱える",
    "大腸がんにかかる", "不整脈になる"
];

let event_list2 = [
    "60歳よりも前に死ぬ", "白内障になる",
    "自転車の盗難被害にあう", "知人からの暴力被害にあう",
    "激しい片頭痛を経験する", "脳卒中を起こす",
    "家庭内暴力の被害にあう", "重度の不眠症に陥る",
    "骨粗しょう症にかかる", "交通事故にあう",
    "自己免疫疾患にかかる", "成人ぜんそくにかかる",
    "静脈血栓症にかかる", "胃潰瘍にかかる",
    "アルツハイマーにかかる", "不安障害と診断される",
    "てんかんを発症する", "尿路結石にかかる",
    "緑内障になる", "騒音被害にあう",
    "大気汚染による被害にあう", "バーンアウト（燃え尽き症候群）を経験する",
    "胃がんにかかる", "補聴器を使用する",
    "基準値を超える高コレステロール値になる", "労働環境の悪化による被害にあう",
    "尿失禁を経験する", "心筋梗塞になる",
    "白血病になる", "肺がんにかかる",
    "自分または家族が医療過誤（不適切な医療措置による被害）を経験する", "性的な被害にあう",
    "介護士による世話が必要な状態になる", "甲状腺の病気にかかる",
    "不十分な年金の支給", "歯肉炎を経験する",
    "仕事によって休暇が中断される", "火事の被害にあう",
    "空き巣被害にあう", "個人情報を悪用される"
];

let event_list_prac = [
    "髪が著しく薄くなる（はげる）", "ハラスメントの被害にあう", "水道関連のトラブルにあう"
];
let BR_prac = [55, 32, 22];

event_list1 = jsPsych.randomization.shuffle(event_list1);
event_list2 = jsPsych.randomization.shuffle(event_list2);

const ITI_BUT = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let html = "<p class='center'>+</p>";
        return html;
    },
    choices: "NO_KEYS",
    trial_duration: runif(500, 1500)
};

// Initial belief about self
const initial_belief_est = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class="event">【${event_list[tIdx_bu-1]}】<br><br>`;
                text += '<b>自分が経験する可能性(%)</b>はどのくらいだと思いますか？</p>';
                text += `<p class='upper_left'>イベント <b>${tIdx_bu}</b> / ${tn_bu}</p>`;
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'initial_belief'
        }
    ],
    button_label: 'Enter',
    on_load: function(trial){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = 1;
        element.max = 90;
     },
    on_finish: function(data) {
        initial_belief = data.response.initial_belief;
        initial_belief_list[tIdx_bu-1] = initial_belief;
        data.initial_belief = initial_belief;
    }
};

const initial_belief_est_prac = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class="event">【${event_list_prac[tIdx_prac-1]}】<br><br>`;
                text += '<b>自分が経験する可能性(%)</b>はどのくらいだと思いますか？<br>';
                text += "下のボックスに入力後，Enterキーを押すか，Enterボタンをクリックしてください。</p>";
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'initial_belief'
        }
    ],
    button_label: 'Enter',
    on_load: function(trial){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = 1;
        element.max = 90;
    },
    on_finish: function(data) {
        initial_belief_list_prac[tIdx_prac-1] = data.response.initial_belief;
    }
};

// Estimate base rate
const base_rate_est = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class="event">【${event_list[tIdx_bu-1]}】<br><br>`;
                text += '<b>他のだれかが経験する可能性(%)</b>はどのくらいだと思いますか？</p>';
                text += `<p class='upper_left'>イベント <b>${tIdx_bu}</b> / ${tn_bu}</p>`;
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'estimated_base_rate'
        }
    ],
    button_label: 'Enter',
    on_load: function(trial){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = 1;
        element.max = 90;
     },
    on_finish: function(data) {
        BR_estimated = data.response.estimated_base_rate;
        BR_estimated_list[tIdx_bu-1] = BR_estimated;
        data.estimated_base_rate = BR_estimated;
    }
};

const base_rate_est_prac = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class="event">【${event_list_prac[tIdx_prac-1]}】<br><br>`;
                text += '<b>他のだれかが経験する可能性(%)</b>はどのくらいだと思いますか？<br>';
                text += "下のボックスに入力後，Enterキーを押すか，Enterボタンをクリックしてください。</p>";
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'estimated_base_rate'
        }
    ],
    button_label: 'Enter',
    on_load: function(trial){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = 1;
        element.max = 90;
    },
    on_finish: function(data) {
        BR_estimated_list_prac[tIdx_prac-1] = data.response.estimated_base_rate;
    }
};

// Present actual (manipulated) base rate
const actual_base_rate = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        current_cond = cond_array[tIdx_in_block_bu-1];
        let convert_success = 0;
        let text;
        // GOOD OR BAD, block number, previous error list
        if (current_cond == "good") {
            EE = br_manip_good[good_tIdx-1];
            true_BR = Number(BR_estimated) - Number(EE);
            if (Number(true_BR) < 1) {// if br_manip_good[tn] is not appropriate
                if (good_tIdx < 10) {
                    for (let k = good_tIdx; k < 10; k++) {
                        let temp_EE = br_manip_good[k];
                        let temp_true_BR = Number(BR_estimated) - Number(temp_EE);
                        console.log(`temp_true_BR: ${temp_true_BR}`)
    
                        if (Number(temp_true_BR) > 0) { // if appropriate EE is found in br_manip_good
                            EE = temp_EE;
                            true_BR = temp_true_BR;
                            // switch the position of the values in br_manip_good
                            let val1 = br_manip_good[good_tIdx-1];
                            let val2 = br_manip_good[k];
                            br_manip_good[good_tIdx-1] = val2;
                            br_manip_good[k] = val1;
                            convert_success = 1;
                            break;                        
                        };
                    };

                    if (convert_success == 0) {// if appropriate value is still not found
                        true_BR = 1;
                        EE = Number(BR_estimated) - Number(true_BR);
                        br_manip_good[good_tIdx-1] = EE;
                        convert_success = 1;
                    };
                }
                else if (good_tIdx == 10) {// if there is no remaining value in the array
                    true_BR = 1;
                    EE = Number(BR_estimated) - Number(true_BR);
                    br_manip_good[good_tIdx-1] = EE;
                    convert_success = 1;
                }
            };
            good_tIdx += 1;
        } else {// in "bad" condition
            EE = br_manip_bad[bad_tIdx-1];
            true_BR = Number(BR_estimated) + Number(EE);
            console.log(`first true_BR in BAD trial: ${true_BR}`);
            if (Number(true_BR) > 90) {// if br_manip_bad[tn] is not appropriate
                if (bad_tIdx < 10) {
                    for (let k = bad_tIdx; k < 10; k++) {
                        let temp_EE = br_manip_bad[k];
                        let temp_true_BR = Number(BR_estimated) + Number(temp_EE);
    
                        if (Number(temp_true_BR) < 91) { // if appropriate EE is found in br_manip_good
                            EE = temp_EE;
                            true_BR = temp_true_BR
                            // switch the position of the values in br_manip_bad
                            let val1 = br_manip_bad[bad_tIdx-1];
                            let val2 = br_manip_bad[k];
                            br_manip_bad[bad_tIdx-1] = val2;
                            br_manip_bad[k] = val1;
                            convert_success = 1;
                            break;                        
                        };

                        if (convert_success == 0) {// if appropriate value is still not found
                            true_BR = 90;
                            EE = Number(true_BR) - Number(BR_estimated);
                            br_manip_bad[bad_tIdx-1] = EE;
                            convert_success = 1;
                        }
                    };
                } 
                else if (bad_tIdx == 10) {// if there is no remaining value in the array
                    true_BR = 90;
                    EE = Number(true_BR) - Number(BR_estimated);
                    br_manip_bad[bad_tIdx-1] = EE;
                    convert_success = 1;
                };
            };
            console.log(`${bad_tIdx}th trial of BAD condition`);
            bad_tIdx += 1;
        };
        text = `<p class="event">【${event_list[tIdx_bu-1]}】<br><br>`;
        text += `実際に一般に人生で一度でも経験する可能性は <b><u>${true_BR}</b>%</u> です。`;
        text += "<br><br>確認できたらスペースキーを押してください。";
        text += `<p class='upper_left'>イベント <b>${tIdx_bu}</b> / ${tn_bu}</p>`;
        convert_success = 0; // reset
        return text; 
    },
    choices: [" "],
    on_finish: function(data) {
        cond_list[tIdx_bu-1] = current_cond;
        EE_list[tIdx_bu-1] = EE;
        true_BR_list[tIdx_bu-1] = true_BR;
    }
};

const actual_base_rate_prac = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        text = `<p class="event">【${event_list_prac[tIdx_prac-1]}】<br><br>`;
        text += `実際に一般に人生で一度でも経験する可能性は <b><u>${BR_prac[tIdx_prac-1]}</b>%</u> です。`;
        text += "<br><br>確認できたらスペースキーを押してください。";
        return text; 
    },
    choices: [" "]
};

// present base rate in the second session
const actual_base_rate_second = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        text = `<p class="event">【${event_list[tIdx_bu-1]}】<br><br>`;
        text += `実際に一般に人生で一度でも経験する可能性は <b><u>${true_BR_list[tIdx_bu-1]}</b>%</u> です。`;
        text += "<br><br>確認できたらスペースキーを押してください。</p>";
        text += `<p class='upper_left'>イベント <b>${tIdx_bu}</b> / ${tn_bu}</p>`;
        return text;
    },
    button_label: 'Enter',
    choices: [" "]
};

const actual_base_rate_second_prac = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        text = `<p class="event">【${event_list_prac[tIdx_prac-1]}】<br><br>`;
        text += `実際に一般に人生で一度でも経験する可能性は <b><u>${BR_prac[tIdx_prac-1]}</b>%</u> です。`;
        text += "<br><br>確認できたらスペースキーを押してください。</p>";
        return text;
    },
    button_label: 'Enter',
    choices: [" "]
};

// second belief estimate
const second_belief_est = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class='event'>【${event_list[tIdx_bu-1]}】<br><br>`;
                text += `実際に一般に経験する可能性: <b>${true_BR_list[tIdx_bu-1]}</b>%<br>`;
                //text += `自分が経験する可能性（1回目）: ${initial_belief_list[tIdx_bu-1]}%<br>`;
                text += `他のだれかが経験する可能性（1回目）: ${BR_estimated_list[tIdx_bu-1]}%<br><br>`;
                text += '<b>自分が経験する可能性(%)</b>はどのくらいだと思いますか？</p>';
                text += `<p class='upper_left'>イベント <b>${tIdx_bu}</b> / ${tn_bu}</p>`;
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'second_belief'
        }
    ],
    button_label: 'Enter',
    on_load: function(){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = 1;
        element.max = 90;
     },
    on_finish: function(data) {
        second_belief = data.response.second_belief;
        data.second_belief = second_belief;
        if (cond_list[tIdx_bu-1] == "good") {
            upd_self = initial_belief_list[tIdx_bu-1] - second_belief;
        } else {
            upd_self = second_belief - initial_belief_list[tIdx_bu-1];
        };

        // record
        data.participantID = participantID;
        data.tIdx_bu = tIdx_bu;
        data.timing = "BUT";
        data.BUT_tIdx = tIdx_bu;
        data.trick = trickAns;
        data.time = time;
        data.good_or_bad = cond_list[tIdx_bu-1];
        data.initial_belief = initial_belief_list[tIdx_bu-1];
        data.estimated_BR = BR_estimated_list[tIdx_bu-1];
        data.actual_BR = true_BR_list[tIdx_bu-1];
        data.estimation_error = EE_list[tIdx_bu-1];
        data.second_belief = second_belief;
        data.upd_self = upd_self;
        data.upd_other = upd_other;
    }
};

const second_belief_est_prac = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: function() {
                let text = `<p class='event'>【${event_list_prac[tIdx_prac-1]}】<br><br>`;
                text += `実際に一般に経験する可能性: <b>${BR_prac[tIdx_prac-1]}</b>%<br>`;
                //text += `自分が経験する可能性（1回目）: ${initial_belief_list_prac[tIdx_prac-1]}%<br>`;
                text += `他のだれかが経験する可能性（1回目）: ${BR_estimated_list_prac[tIdx_prac-1]}%<br><br>`;
                text += '<b>自分が経験する可能性(%)</b>はどのくらいだと思いますか？<br>';
                text += "下のボックスに入力後，Enterキーを押すか，Enterボタンをクリックしてください。</p>";
                return text;
            },
            placeholder: placeholder,
            required: true,
            name: 'second_belief'
        }
    ],
    button_label: 'Enter',
    on_load: function(){
        let element = document.getElementById('input-0');
        element.type = 'number';
        element.min = lower;
        element.max = higher;
     }
};

// timeline for session one
const BUT_session_one = {
    timeline: [
        ITI_BUT,
        initial_belief_est,
        base_rate_est,
        actual_base_rate
    ],
    loop_function: function() {
        if (tIdx_bu < tn_bu) {
            if (tIdx_bu == tn_block_bu) { // at trial 20
                // switch br-manipulation array
                let array_1 = br_manip_good;
                let array_2 = br_manip_bad;
                br_manip_good = jsPsych.randomization.shuffle(array_2);
                br_manip_bad = jsPsych.randomization.shuffle(array_1);
                // reset cond_array
                cond_array = jsPsych.randomization.shuffle(cond_array);
                good_tIdx = 1;
                bad_tIdx = 1;
                tIdx_in_block_bu = 1;
            } else {
                tIdx_in_block_bu += 1;
            }
            tIdx_bu += 1;
            return true;
        } else {
            // reset for the second session
            tIdx_bu = 1;
            return false;
        }
    }
};

const BUT_session_one_prac = {
    timeline: [
        ITI_BUT,
        initial_belief_est_prac,
        base_rate_est_prac,
        actual_base_rate_prac
    ],
    loop_function: function() {
        if (tIdx_prac < tn_prac) {
            tIdx_prac += 1;
            return true;
        } else {
            tIdx_prac = 1;
            return false;
        }
    }
};

// timeline for session two
const BUT_session_two = {
    timeline: [
        ITI_BUT,
        actual_base_rate_second,
        second_belief_est
    ],
    loop_function: function() {
        if (tIdx_bu < tn_bu) {
            tIdx_bu += 1;
            return true;
        } else {
            return false;
        }
    }
};

const BUT_session_two_prac = {
    timeline: [
        ITI_BUT,
        actual_base_rate_second_prac,
        second_belief_est_prac
    ],
    loop_function: function() {
        if (tIdx_prac < tn_prac) {
            tIdx_prac += 1;
            return true;
        } else {
            return false;
        }
    }
};

const text_after_first_session = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text; 
        text = "<p class='inst_text'>これで第1セッションは終了です。<br>";
        text += "第2セッションでは，おなじイベントが自分に起こる可能性を改めて順番に回答していただきます。<br>";
        text += "必要な場合5分以内の休憩を取り，準備ができたらスペースキーを押して第2セッションを開始してください。</p>";
        return text;
    },
    choices: [" "]
};

const text_after_first_session_prac = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text; 
        text = "<p class='inst_text'>これで第1セッションは終了です。<br>";
        text += "第2セッションでは，おなじイベントが自分に起こる可能性を改めて順番に回答していただきます。<br>";
        text += "スペースキーを押して第2セッションを開始してください。</p>";
        return text;
    },
    choices: [" "]
};

// timeline for full belief updating task blocks
const BUT_full = {
    timeline:
    [
        BUT_session_one,
        text_after_first_session,
        BUT_session_two
    ]
};


// timeline for practice
const BUT_inst1 = {
    type: jsPsychInstructions,
    pages: [
        "<img src='introduction_BUT/スライド1.PNG'>",
        "<img src='introduction_BUT/スライド2.PNG'>"
    ],
    key_forward: "j",
    key_backward: "f"
};

const BUT_inst2 = {
    type: jsPsychInstructions,
    pages: [
        "<img src='introduction_BUT/スライド3.PNG'>",
        "<img src='introduction_BUT/スライド4.PNG'>",
        "<img src='introduction_BUT/スライド5.PNG'>",
        "<img src='introduction_BUT/スライド6.PNG'>",
        "<img src='introduction_BUT/スライド7.PNG'>"
    ],
    key_forward: "j",
    key_backward: "f"
};

const BUT_prac = {
    timeline:[
        BUT_session_one_prac,
        text_after_first_session_prac,
        BUT_session_two_prac
    ]
};

const BUT_inst_prac = {
    timeline: [
        BUT_inst1,
        BUT_prac,
        BUT_inst2,
        but_quiz
    ]
};

// ======== timelines for ending experiment =========
const end_exp = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        text = `<p class='inst_text'>これで${time+1}回目の実験は終了です。大変お疲れさまでした。<br>`;
        text += "それでは最後に，データを転送していただきます。<br>";
        text += "スペースキーを押して，次の日本語の案内が再度出てくるまでしばらくお待ちください。<br>";
        text += "通常は30秒以下でデータ転送が完了します。</p>";
        return text;
    },
    choices: [" "]
};

// timeline to save data using pipeline
const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: "aj74at4DUh7h",
    filename: function() {
        filename = `${participantID}_${time}.csv`;
        return(filename);
    },
    data_string: () => jsPsych.data.get().csv()
};

const end_exp2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let text;
        text = "<p class='inst_text'>転送が終了しました。<br>";
        text += "ありがとうございました。<br>";
        text += "お手数ですが，<b>ご自身のIDとともに，実験が終了したことを，";
        text += "実験実施者まで伝える</b>のを忘れないようにお願いいたします。<br>";
        if (time == 1){
            text += "実験終了の連絡を受けたのち，デブリーフィング用のフォームをお送りします。<br>";
        };
        text += "それでは，<b>スペースキーを押して，実験を終了してください（画面が真っ暗になったら終了です）。</b><br>";
        text += "実験終了とともにcsvファイルがあなたのPCにダウンロードされますが，それはバックアップ用のデータとなりますので，念のため削除しないようお願いいたします。<br>";
        text += "<b><u>データ保存のためにも，スペースキーを押すのを必ず忘れないようにしてください！！</b></u>(全画面はescキーで解除できます。)";

        // if (time == 1) {// second time
        //     text += "<b>最後に，デブリーフィングのために，簡単なフォームに目を通して回答していただきます。</b><br>";
        //     text += "<a href='https://docs.google.com/forms/d/e/1FAIpQLSf6n3vHU_Sbl-KUHHlt7LQ7OAILmGLbOcdioPUt3Au8DA1mZw/viewform?usp=sf_link' target='_blank'>こちらに埋め込まれたリンク</a>";
        //     text += "をクリックしてフォームを開いてください。<br>";
        //     text += "念のため，フォームに回答してからこの画面を閉じてください。";
        //     text += 
        //     //text += "謝礼はデータを確認し次第お渡しいたしますので，少々お待ちください。";
        //     //text += "改めて、研究に参加していただき，誠にありがとうございました。";
        // } else {// first time
        //     text += "それでは，escキーを押して画面を閉じてください。</p>";
        // };

        return text;
    },
    choices: [" "]
};

// ======== full experiment ==========
const tl_try = [
    preload3,
    start_FS,
    get_ID,
    get_time,
    end_exp2
];

const timeline = [
    preload3,
    start_FS,
    get_ID,
    get_time,
    age,
    biol_sex,
    q_inst,
    LOTR,
    JOPS_trait,
    JOPS_state,
    BUT_inst_prac,
    BUT_full,
    end_exp,
    save_data,
    end_exp2
];

// start the experiment
jsPsych.run(timeline);
//jsPsych.run(tl_try);