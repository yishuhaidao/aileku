
const styleOptions = [
  '流行','摇滚','民谣','电子','说唱','R&B','古风','中国风','嘻哈','节奏布鲁斯',
  '爵士','古典','轻音乐','国风','二次元','治愈','放克','金属','朋克','雷鬼',
  '乡村','拉丁','蓝调','世界音乐','独立','实验','舞曲','EDM','电子摇滚','国风摇滚',
  'Trap','Lo-Fi','氛围音乐','后摇','另类摇滚','梦幻流行','合成器流行','Chillwave',
  'Vaporwave','City Pop','巴萨诺瓦','探戈','弗拉门戈'
];

const recipeOptions = [
  '经典配方','爆款公式','热门模板','怀旧金曲','实验风格','清新自然',
  '暗黑深邃','史诗宏大','温柔治愈','热血沸腾','迷幻梦境','欢快节奏',
  '深夜电台','早安元气','午后阳光','下雨天','星空下','海风轻拂',
  '城市夜色','森林漫步','极简主义','繁复华丽','东方韵味','西方风情',
  '夏日狂欢','冬日恋歌','文艺复兴','科幻未来','异域风情','灵魂深处'
];

const vocalOptions = [
  '无特效','温柔男声','甜美女声','磁性大叔','少年音','御姐音','萝莉音',
  '电音效果','机器音','电话音','收音机','山谷回声','教堂混响','浴室混响',
  '大厅混响','小声场','大声场','水下效果','外星人','机器人',
  '变声男','变声女','空灵和声','合唱团','留声机','娃娃音','沧桑老声',
  '和声音效','交响人声','民谣低吟','歌剧高音','轻语低喃'
];



const moodOptions = [
  '治愈','热血','抒情','轻松','迷幻','怀旧','浪漫','孤独','快乐','悲伤',
  '振奋','梦幻','激情','温暖','清新','沉静','忧郁','释然','感动','思念',
  '期待','失落','自信','自由','洒脱','孤傲','兴奋','安宁','甜蜜','空灵'
];

const instrumentOptions = [
  '钢琴','吉他','古筝','合成器','贝斯','爵士鼓','小提琴','大提琴','萨克斯',
  '口琴','琵琶','二胡','笛子','箫','古琴','扬琴','马头琴','风琴','竖琴',
  '电子琴','MIDI钢琴','古典吉他','电吉他','木吉他','贝斯吉他','架子鼓',
  '非洲鼓','康加鼓','手碟','卡林巴','八音盒','大键琴','小号','长笛','单簧管'
];

const fxOptions = [
  '无特效','混响增强','延迟效果','失真效果','Lo-Fi滤镜','复古磁带',
  '黑胶唱片','8-bit像素','空间环绕','低音增强','高音增强','压缩器',
  '合唱效果','镶边效果','相位效果','颤音','震音','滤波器','哇音','过载',
  '立体声扩展','房间模拟','大厅混响','弹簧混响','录音机质感','广播效果',
  '降噪处理','环绕声场','动态均衡','钢琴共鸣','架子鼓混音','贝斯增强'
];

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #0093e9 0%, #80d0c7 100%)'
];

const coverEmojis = ['🎹','🎸','🎻','🥁','🎺','🎷','🪕','🎵','🎶','🦞','🌟','🔥','💜','🌙','🌈','✨'];

let songs = [];

const messages = [];

const msgCategories = ['全部','点赞和评论','礼物','关注','谁听了我的歌','听歌广场','系统消息','官方通知'];

let currentTab = 'home';
let detailSong = null;
let sheetSong = null;
let playerBarSong = null;
let currentMsgCat = '全部';
let isPlaying = false;
let currentBPM = 100;
let synth = null;
let playerInterval = null;
let playerProgress = 0;
let generatedCount = songs.length;

// ==================== INIT ====================
function init() {
  buildOptsPanel();
  renderHome();
  renderSquare();
  renderMessages();
  initTabs();
  initBackHandler();
  // Register musician center click
  var bmc = document.getElementById('btnMusicianCenter');
  if (bmc) bmc.onclick = openMusicianCenter;
  updateCheckinUI();
  updateBeanDisplay();
  try {
    isVip = localStorage.getItem('isVip') === '1';
    if (isVip) {
      vipTier = localStorage.getItem('vipTier') || 'monthly';
      freeSongsLeft = parseInt(localStorage.getItem('freeSongsLeft') || '0');
      // Auto-clear if no version marker (old test data)
      if (!localStorage.getItem('vipVer')) {
        isVip = false; vipTier = 'none'; freeSongsLeft = 0;
        try { localStorage.removeItem('isVip'); localStorage.removeItem('vipTier'); localStorage.removeItem('freeSongsLeft'); localStorage.setItem('vipVer','1'); } catch(e) {}
      }
    }
  } catch(e) {}
  updateVipUI();
}

// ==================== COMPACT OPTION DROPDOWNS ====================
// ==================== BACK BUTTON HANDLING ====================
let navStack = ['home'];
let exitTimer = null;

function pushNav(state) {
  navStack.push(state);
  history.pushState({nav: state}, '', '#!'+state);
}

function initBackHandler() {
  history.replaceState({nav: 'home'}, '', '#!home');
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.nav) {
      restoreState(e.state.nav);
    } else {
      handleExitBack();
    }
  });
}

function restoreState(state) {
  if (navStack.length > 1) navStack.pop();
  // Close toggle panels
  ['mvSection','latestSection','roomSection'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  if (state === 'home' || state === 'square' || state === 'create' || state === 'messages' || state === 'profile') {
    ['createFormOverlay','detailOverlay','rechargeModal','bottomSheetOverlay','settingsOverlay','panelOverlay','beanExchangeOverlay','paymentModal','vipUpgradePrompt','vipPopup'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.classList.remove('show');
    });
    switchTab(state);
  } else if (state === 'detail') {
    closeDetail();
  } else if (state === 'form') {
    // Show the create form overlay, hide optSub
    document.getElementById('optSubPage').classList.remove('show');
    document.getElementById('createFormOverlay').classList.add('show');
    ensureFormMode();
  } else if (state === 'optSub') {
    // Back from optSub → show create form
    document.getElementById('optSubPage').classList.remove('show');
    document.getElementById('createFormOverlay').classList.add('show');
    ensureFormMode();
  } else if (state === 'exitBarrier' || state === 'settingsBarrier') {
    // Back navigation barrier - let browser go back
    if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
    return;
  } else if (state === 'panel') {
    closePanel();
    ['rechargeModal','bottomSheetOverlay'].forEach(function(id){ var e = document.getElementById(id); if(e) e.classList.remove('show'); });
  } else if (state === 'settings') {
    // Close other overlays, but keep settings open
    closePanel(); closeRecharge(); closeSheet();
    ['createFormOverlay','detailOverlay'].forEach(function(id){ var e = document.getElementById(id); if(e) e.classList.remove('show'); });
    // Settings sub-panel → back to main, or close if already main
    const sm = document.getElementById('settingsMain');
    if (sm && !sm.classList.contains('show')) {
      var so = document.getElementById('settingsOverlay'); if(so) so.classList.add('show');
      showSettingsPanel('main');
      history.pushState({nav:'settingsBarrier'}, '', '#!settings');
    } else {
      closeSettings();
    }
  } else if (state === 'recharge') {
    closePayment();
    document.getElementById('rechargeModal').classList.add('show');
  } else if (state === 'sheet') {
    closeSheet();
    closePanel();
  } else if (state === 'beanExchange') {
    closeBeanExchange();
  } else if (state === 'vipPopup') {
    closeVipPopup();
  } else if (state === 'vipPrompt') {
    closeVipPrompt();
  } else if (state === 'payment') {
    closePayment();
  } else if (state === 'mvPanel' || state === 'latestPanel' || state === 'roomPanel') {
    // panel already closed above, just ensure home tab
    switchTab('home');
  }
}

function handleExitBack() {
  // Check generic panel overlay
  const panelOverlay = document.getElementById('panelOverlay');
  if (panelOverlay && panelOverlay.classList.contains('show')) {
    closePanel();
    history.back();
    return;
  }
  // Check settings sub-panel → back to main
  const settingsOverlay = document.getElementById('settingsOverlay');
  if (settingsOverlay && settingsOverlay.classList.contains('show')) {
    const main = document.getElementById('settingsMain');
    if (main && !main.classList.contains('show')) {
      showSettingsPanel('main');
      history.pushState({nav:'settingsBarrier'}, '', '#!settings');
      return;
    }
    closeSettings();
    history.back();
    return;
  }
  // Check recharge modal
  const rechargeModal = document.getElementById('rechargeModal');
  if (rechargeModal && rechargeModal.classList.contains('show')) {
    closeRecharge();
    history.back();
    return;
  }
  // Check bottom sheet
  const bottomSheet = document.getElementById('bottomSheetOverlay');
  if (bottomSheet && bottomSheet.classList.contains('show')) {
    closeSheet();
    history.back();
    return;
  }
  // Check if any panel is open - close it first
  const panels = ['mvSection','latestSection','roomSection'];
  for (let i = 0; i < panels.length; i++) {
    const el = document.getElementById(panels[i]);
    if (el && el.style.display !== 'none') {
      el.style.display = 'none';
      history.back();
      return;
    }
  }
  // Check if detail modal is open
  const detailOverlay = document.getElementById('detailOverlay');
  if (detailOverlay && detailOverlay.classList.contains('show')) {
    closeDetail();
    history.back();
    return;
  }
  // Check if create form is open
  const formOverlay = document.getElementById('createFormOverlay');
  if (formOverlay && formOverlay.classList.contains('show')) {
    closeCreateForm();
    history.back();
    return;
  }
  // Check if bean exchange is open
  const beanEx = document.getElementById('beanExchangeOverlay');
  if (beanEx && beanEx.classList.contains('show')) {
    closeBeanExchange();
    history.back();
    return;
  }
  // Check if payment modal is open
  const payMod = document.getElementById('paymentModal');
  if (payMod && payMod.classList.contains('show')) {
    closePayment();
    history.back();
    return;
  }
  // Check if VIP prompt is open
  const vipPrEl = document.getElementById('vipUpgradePrompt');
  if (vipPrEl && vipPrEl.classList.contains('show')) {
    closeVipPrompt();
    history.back();
    return;
  }
  // Check if VIP popup is open
  const vipPop = document.getElementById('vipPopup');
  if (vipPop && vipPop.classList.contains('show')) {
    closeVipPopup();
    history.back();
    return;
  }
  // On home page: show exit hint, push barrier state
  if (!exitTimer) {
    showToast('再按一次退出程序');
    exitTimer = setTimeout(function(){exitTimer=null;},1500);
    history.pushState({nav:'exitBarrier'}, '', '#!exit');
  }
}

let detailSongCache = null;

function openDetail(song) {
  if (!song) return;
  detailSongCache = song;
  pushNav('detail');
  document.getElementById('detailOverlay').classList.add('show');
  renderDetail(song);
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('show');
  stopPlayback();
}

function openCreateForm(withLyrics) {
  hasLyrics = withLyrics;
  pushNav('form');
  document.getElementById('formTitle').textContent = withLyrics ? '生成MV' : '一键写歌';

  var oneClick = document.getElementById('formOneClick');
  var full = document.getElementById('formFull');
  if (withLyrics) {
    oneClick.classList.remove('active');
    full.classList.add('active');
    buildOptsPanel();
  } else {
    oneClick.classList.add('active');
    full.classList.remove('active');
  }
  document.getElementById('createFormOverlay').classList.add('show');
}

function closeCreateForm() {
  document.getElementById('createFormOverlay').classList.remove('show');
  stopPlayback();
}

function ensureFormMode() {
  var oneClick = document.getElementById('formOneClick');
  var full = document.getElementById('formFull');
  if (hasLyrics) {
    oneClick.classList.remove('active');
    full.classList.add('active');
  } else {
    oneClick.classList.add('active');
    full.classList.remove('active');
  }
}

// ==================== TABS ====================
const optDefs = [
  {key:'style',label:'风格',opts:styleOptions,def:'流行'},
  {key:'recipe',label:'配方',opts:recipeOptions,def:'经典配方'},
  {key:'vocal',label:'人声',opts:vocalOptions,def:'无特效'},
  {key:'mood',label:'情绪',opts:moodOptions,def:'治愈'},
  {key:'instrument',label:'乐器',opts:instrumentOptions,def:'钢琴'},
  {key:'fx',label:'特效',opts:fxOptions,def:'无特效'},
];
const selections = {};
const MAX_SELECTIONS = 20;

function buildOptsPanel() {
  var bar = document.getElementById('optBar');
  bar.innerHTML = optDefs.map(function(d){
    selections[d.key] = [d.def];
    return '<button class="opt-tab" id="tab_'+d.key+'" onclick="selectCat(\''+d.key+'\')">'+d.label+'</button>';
  }).join('');
  updateSelTags();
  showGrid('style');
  document.getElementById('tab_style').classList.add('active');
}

function countSelections() {
  var n = 0;
  optDefs.forEach(function(d){ n += selections[d.key].length; });
  return n;
}

function updateSelTags() {
  var counter = document.getElementById('selCounter');
  if (counter) counter.textContent = '已选 '+countSelections()+'/20';
  // Also update comboText if it exists
  var combo = document.getElementById('comboText');
  if (combo) {
    var lines = [];
    optDefs.forEach(function(d){
      lines.push(d.label+':'+selections[d.key].join('/'));
    });
    combo.textContent = lines.join(' | ') || '选好风格情绪，AI为你作曲';
  }
}

function removeSelTag(key, val) {
  selections[key] = selections[key].filter(function(x){ return x !== val; });
  if (selections[key].length === 0) selections[key] = [optDefs.find(function(d){return d.key===key;}).def];
  updateSelTags();
  var activeTab = document.querySelector('.opt-tab.active');
  if (activeTab) showGrid(activeTab.id.replace('tab_',''));
}

function selectCat(key) {
  document.querySelectorAll('.opt-tab').forEach(function(b){b.classList.remove('active');});
  document.getElementById('tab_'+key).classList.add('active');
  showGrid(key);
}

function showGrid(key) {
  var grid = document.getElementById('optGrid');
  var d = optDefs.find(function(x){return x.key===key;});
  var sel = selections[key] || [];
  grid.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:6px">'+
    d.opts.map(function(o){
      var isSel = sel.indexOf(o) !== -1;
      return '<span class="opt-chip'+(isSel?' selected':'')+'" onclick="pickOpt(\''+key+'\',\''+o+'\')">'+o+'</span>';
    }).join('')+
  '</div>';
  grid.scrollTop = 0;
}

function pickOpt(key, val) {
  var sel = selections[key];
  var idx = sel.indexOf(val);
  if (idx === -1) {
    if (countSelections() >= MAX_SELECTIONS) {
      showToast('⚠️ 最多选'+MAX_SELECTIONS+'个选项');
      return;
    }
    sel.push(val);
  } else {
    if (sel.length <= 1) {
      showToast('⚠️ 每个类别至少保留1个选项');
      return;
    }
    sel.splice(idx, 1);
  }
  updateSelTags();
  showGrid(key);
}

// ==================== OPTION SUB-PAGE ====================
let currentSubCat = 'style';

function openOptSubPage(key) {
  currentSubCat = key || '';
  // Save defaults & clear for fresh start
  if (!key) {
    window._optSaved = {};
    optDefs.forEach(function(d){ window._optSaved[d.key] = selections[d.key].slice(); selections[d.key] = []; });
  }
  pushNav('optSub');
  document.getElementById('createFormOverlay').classList.remove('show');
  renderOptSubPage();
  document.getElementById('optSubPage').classList.add('show');
}

function closeOptSubPage() {
  document.getElementById('optSubPage').classList.remove('show');
  // Restore defaults if not saved
  if (window._optSaved) {
    optDefs.forEach(function(d){ selections[d.key] = window._optSaved[d.key]; });
    delete window._optSaved;
  }
  document.getElementById('createFormOverlay').classList.add('show');
  if (hasLyrics) { selectCat(currentSubCat); updateSelTags(); }
}

function saveOptSubAndReturn() {
  closeOptSubPage();
  showToast('✅ 风格已保存');
}

function renderOptSubPage() {
  var count = countSelections();
  document.getElementById('optSubCounter').textContent = '已选 '+count+'/'+MAX_SELECTIONS;
  var comboText = document.getElementById('optSubComboText');
  var placeholder = document.getElementById('optSubPlaceholder');
  var lines = [];
  optDefs.forEach(function(d){
    if (selections[d.key].length > 0) lines.push(selections[d.key].join('、'));
  });
  if (lines.length === 0) {
    comboText.style.display = 'none';
    placeholder.style.display = 'flex';
  } else {
    placeholder.style.display = 'none';
    comboText.style.display = 'block';
    comboText.innerHTML = lines.join('<br>');
  }

  // Category tabs
  var bar = document.getElementById('optSubBar');
  bar.innerHTML = optDefs.map(function(d){
    return '<div class="opt-sub-tab'+(d.key===currentSubCat?' active':'')+'" data-key="'+d.key+'" onclick="switchSubCat(\''+d.key+'\',this)">'+d.label+'</div>';
  }).join('');

  // Option chips
  var showKey = currentSubCat || 'style';
  var grid = document.getElementById('optSubGrid');
  var d = optDefs.find(function(x){return x.key===showKey;});
  var sel = selections[showKey];
  grid.innerHTML = d.opts.map(function(o){
    var isSel = sel.indexOf(o) !== -1;
    return '<span class="opt-sub-chip'+(isSel?' selected':'')+'" onclick="pickOptSub(\''+showKey+'\',\''+o+'\')">'+o+'</span>';
  }).join('');
}

function switchSubCat(key, el) {
  currentSubCat = key;
  document.querySelectorAll('.opt-sub-tab').forEach(function(t){t.classList.remove('active');});
  el.classList.add('active');
  renderOptSubPage();
}

function pickOptSub(key, val) {
  var sel = selections[key];
  var idx = sel.indexOf(val);
  if (idx === -1) {
    if (countSelections() >= MAX_SELECTIONS) { showToast('最多选20个选项'); return; }
    sel.push(val);
  } else {
    if (sel.length <= 1) { showToast('每个类别至少保留1个选项'); return; }
    sel.splice(idx, 1);
  }
  renderOptSubPage();
}

// ==================== ACTION BUTTONS ====================
function randomSound() {
  var all = [];
  optDefs.forEach(function(d){ all = all.concat(d.opts); });
  // Randomly pick one from each category
  optDefs.forEach(function(d){
    selections[d.key] = [d.opts[Math.floor(Math.random()*d.opts.length)]];
  });
  updateSelTags(); showGrid('style');
  showToast('🎲 已随机生成一套声音组合');
}

// ==================== LYRICS MODES ====================
let lyricsMode = 'interact';

function switchLyricsMode(mode, el) {
  lyricsMode = mode;
  document.querySelectorAll('.lyrics-mode-tab').forEach(function(t){ t.classList.remove('active'); });
  el.classList.add('active');
  var content = document.getElementById('lyricsContent');
  if (mode === 'interact') {
    content.innerHTML = '<textarea class="lyrics-giant" id="formLyrics" placeholder="输入你的灵感，AI为你谱曲...&#10;&#10;第一行自动作为歌名"></textarea>';
  } else if (mode === 'inspire') {
    content.innerHTML = '<textarea class="lyrics-giant" id="formLyrics" placeholder="输入关键词或情绪，AI帮你生成歌词...&#10;&#10;如：星空 浪漫 治愈"></textarea>'+
      '<div style="display:flex;gap:6px;padding:6px 0;flex-wrap:wrap" id="inspireTags">'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'星空\\n夜晚\\n思念\\n月光\'">🌌 星空浪漫</span>'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'奔跑\\n自由\\n风\\n远方\'">🏃 自由奔跑</span>'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'城市\\n霓虹\\n孤独\\n梦想\'">🌃 城市夜色</span>'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'花开\\n春天\\n遇见\\n温暖\'">🌸 春日花开</span>'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'热血\\n战斗\\n胜利\\n荣耀\'">⚔️ 热血战斗</span>'+
      '<span class="opt-chip" onclick="var e=document.getElementById(\'formLyrics\');if(e)e.value=\'回忆\\n青春\\n校园\\n初恋\'">📚 青春回忆</span>'+
      '</div>';
  } else if (mode === 'image') {
    content.innerHTML = '<div style="flex:1;display:flex;align-items:center;justify-content:center;border:2px dashed var(--border);border-radius:14px;margin:4px 0;cursor:pointer;flex-direction:column;gap:8px" onclick="showToast(\'📷 请从相册选择一张图片\')"><span style="font-size:40px">🖼️</span><span style="font-size:13px;color:var(--text3)">点击上传图片，AI识别并生成歌曲</span></div>';
  }
}

function handleImageUpload(input) {
  if (input.files && input.files[0]) {
    showToast('🖼️ 图片已识别，正在生成歌词...');
    setTimeout(function(){
      var ta = document.getElementById('formLyrics');
      if (ta) ta.value = 'AI从图片中读到的故事\n画面感\n色彩与情绪\n音乐的表达';
    }, 500);
  }
}

function suggestLyrics() {
  var prompts = [
    '夜空中的星\n闪烁着你的眼睛\n我在这城市里\n寻找着你的身影\n\n也许明天\n我们会再相遇\n在街角的咖啡店\n在雨后的彩虹里',
    '春风十里\n不如你\n桃花开了又落\n我在等风也等你\n\n时光匆匆\n带不走思念\n每一个夜晚\n都有你的名字',
    '向前跑\n迎着冷眼和嘲笑\n生命的广阔\n不经历磨难怎能感到\n\n继续跑\n带着赤子的骄傲',
    '月光洒在窗台\n琴声悠扬飘来\n是谁在弹唱\n那首未完的期待\n\n岁月如歌\n我们都成了过客\n但音乐还在\n温暖着每一个角落'
  ];
  var pick = prompts[Math.floor(Math.random()*prompts.length)];
  document.getElementById('formLyrics').value = pick;
  showToast('💡 已生成灵感歌词，可自行修改');
}

function showCustomGuide() {
  var guide = '<div style="font-size:13px;line-height:2"><b>创作指南：</b><br>🎵 <b>风格</b> 决定曲风走向<br>🎛️ <b>配方</b> 影响编曲复杂度<br>🎤 <b>人声</b> 改变演唱质感<br>💭 <b>情绪</b> 传递歌曲氛围<br>🎸 <b>乐器</b> 塑造声音层次<br>✨ <b>特效</b> 点缀细节亮点<br><br>💡 <b>小技巧：</b> 多选不同风格/情绪混搭，AI 会融合生成独特风格</div>';
  openPanel('📖 自定义指南', guide);
}

function showCustomAdd() {
  var html = '<div class="settings-input-group"><label>添加自定义选项</label><input type="text" id="customOptInput" placeholder="输入自定义选项名称" style="width:100%;box-sizing:border-box;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--input);color:var(--text);font-size:14px"></div><button class="settings-btn primary" onclick="addCustomOpt()" style="width:100%">✅ 添加到「'+optDefs.find(function(d){return d.key===currentSubCat;}).label+'」</button>';
  openPanel('+自定义', html);
}

function addCustomOpt() {
  var val = (document.getElementById('customOptInput')||{}).value;
  if (!val || !val.trim()) { showToast('⚠️ 请输入选项名称'); return; }
  val = val.trim();
  var d = optDefs.find(function(x){return x.key===currentSubCat;});
  if (d.opts.indexOf(val) !== -1) { showToast('⚠️ 该选项已存在'); return; }
  d.opts.push(val);
  selections[currentSubCat].push(val);
  closePanel();
  renderOptSubPage();
  showToast('✅ 已添加「'+val+'」');
}

function aiOptimizeLyrics() {
  var raw = document.getElementById('formLyrics').value.trim();
  if (!raw) { showToast('🤖 请先输入歌词后再优化'); return; }
  // Simulate AI optimization: enhance rhyme, add structure
  var lines = raw.split('\n');
  var enhanced = lines.map(function(l, i){
    l = l.trim();
    if (!l) return l;
    // Add poetic flourishes to random lines
    if (i > 0 && Math.random() > 0.6) l = '✨ ' + l;
    return l;
  });
  // Add a bridge if short
  if (enhanced.length < 6) {
    enhanced.push('', '🎵 [AI建议：添加桥段让歌曲更有层次]');
  }
  // Add section markers
  var result = enhanced.join('\n');
  document.getElementById('formLyrics').value = result;
  showToast('✨ AI优化完成！已润色押韵+添加结构建议');
}

function pickMVStyle(el, type) {
  var names = {fresh:'唯美清新',cyber:'赛博朋克',retro:'复古胶片',anime:'手绘动画'};
  document.querySelectorAll('#formFull .mv-style-chip').forEach(function(c){c.classList.remove('selected');});
  el.classList.add('selected');
  showToast('已选择：'+names[type]);
}

function doGenerate() {
  var songCost = 300;
  var isFree = (isVip && freeSongsLeft > 0);
  if (!isFree && userCoins < songCost) {
    if (isVip) {
      showToast('💰 本月免费额度已用完！剩余' + freeSongsLeft + '首，充乐币继续创作');
    } else {
      showToast('💰 乐币不足！需要300乐币（¥3）。开通VIP月卡¥19.9享30首免费');
    }
    return;
  }
  if (isFree) {
    freeSongsLeft--;
    try { localStorage.setItem('freeSongsLeft', freeSongsLeft); } catch(e) {}
  } else {
    userCoins -= songCost;
  }
  userWorks++;
  // Update displays
  updateWalletDisplay();
  earnBeans(1, '发布歌曲');

  const raw = document.getElementById('formLyrics').value.trim();
  // First line = song name, rest = lyrics
  const lines = raw.split('\n');
  const name = lines[0] ? lines[0].replace(/^#\s*/,'').trim() : 'AI创作'+Date.now().toString(36);
  if (!name) name = '无标题';

  const newSong = {
    id: ++generatedCount,
    title: name,
    artist: '一只叔片',
    style: selections.style.join('/'),
    mood: selections.mood.join('/'),
    instrument: selections.instrument[Math.floor(Math.random()*selections.instrument.length)],
    duration: '0'+(2+Math.floor(Math.random()*3))+':'+String(Math.floor(Math.random()*60)).padStart(2,'0'),
    likes: 0, comments: 0, gifts: 0, plays: 0,
    liked: false, favorited: false,
    coverIdx: Math.floor(Math.random()*coverEmojis.length),
    bpm: currentBPM
  };
  songs.unshift(newSong);
  renderHome();
  closeCreateForm();
  var costMsg = isFree ? '（VIP免费·剩余'+freeSongsLeft+'首）' : '消耗300乐币，剩余'+userCoins+'乐币';
  showToast('🎉 《'+name+'》创作成功！' + costMsg);
  setTimeout(()=>playSong(newSong),500);
}

// ==================== TABS ====================
function initTabs() {
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      // Close all open overlays before switching
      const formOverlay = document.getElementById('createFormOverlay');
      if (formOverlay) formOverlay.classList.remove('show');
      const detailOverlay = document.getElementById('detailOverlay');
      if (detailOverlay) detailOverlay.classList.remove('show');
      const rechargeModal = document.getElementById('rechargeModal');
      if (rechargeModal) rechargeModal.classList.remove('show');
      const bottomSheet = document.getElementById('bottomSheetOverlay');
      if (bottomSheet) bottomSheet.classList.remove('show');
      const settingsOverlay = document.getElementById('settingsOverlay');
      if (settingsOverlay) settingsOverlay.classList.remove('show');
      const panelOverlay = document.getElementById('panelOverlay');
      if (panelOverlay) panelOverlay.classList.remove('show');
      const beanExchange = document.getElementById('beanExchangeOverlay');
      if (beanExchange) beanExchange.classList.remove('show');
      const vipPopup = document.getElementById('vipPopup');
      if (vipPopup) vipPopup.classList.remove('show');
      const vipPrompt = document.getElementById('vipUpgradePrompt');
      if (vipPrompt) vipPrompt.classList.remove('show');
      const optSub = document.getElementById('optSubPage');
      if (optSub) optSub.classList.remove('show');
      if (currentTab !== tabName) {
        pushNav(tabName);
      }
      switchTab(tabName);
    });
  });
}

function switchTab(name) {
  currentTab = name;
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab-item[data-tab="${name}"]`).classList.add('active');
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');
  document.getElementById('mainContent').scrollTop = 0;
}

// ==================== HOME PAGE ====================
const mvData = [
  {id:1,title:'春日晚风',artist:'花开半夏',views:128000,likes:2400,duration:'03:42',cov:0,vip:true,comments:856,gifts:520,favs:1800},
  {id:2,title:'星海漫步',artist:'一只叔片',views:96000,likes:1800,duration:'04:15',cov:4,vip:true,comments:620,gifts:380,favs:1200},
  {id:3,title:'城市霓虹',artist:'深夜旅人',views:85000,likes:1500,duration:'03:28',cov:3,vip:true,comments:480,gifts:290,favs:950},
  {id:4,title:'雨中曲',artist:'墨染青衣',views:72000,likes:1200,duration:'04:50',cov:5,vip:true,comments:350,gifts:210,favs:800},
];

function playFeaturedMV() {
  if (vipRequired('🎬 VIP热门MV', '开通VIP会员即可观看热门MV')) return;
  const s = mvData[0]; showToast('🎬 正在播放: '+s.title+' - '+s.artist);
}

function renderHome() {
  // MV Hero - featured mv
  const hero = mvData[0];
  document.getElementById('mvHeroTitle').textContent = hero.title;
  document.getElementById('mvHeroArtist').textContent = hero.artist+' · 原创MV';
  document.getElementById('mvHeroCard').onclick = function(){ playFeaturedMV(); };

  // MV Showcase
  const showcase = document.getElementById('mvShowcase');
  showcase.innerHTML = mvData.slice(1).map(m => `
    <div class="mv-card" onclick="${isVip ? "showToast('🎬 '+JSON.stringify(m.title)+' - '+JSON.stringify(m.artist))" : "vipRequired('🎬 VIP MV精选','VIP会员专享MV播放')"}">
      <div class="mv-card-thumb" style="background:${gradients[m.cov % gradients.length]}">🎬
        <div class="mv-card-duration">${m.duration}</div>
      </div>
      <div class="mv-card-info">
        <div class="mv-card-title">${m.title}</div>
        <div class="mv-card-artist">👑 ${m.artist}</div>
        <div class="mv-card-stats">
          <span>▶ ${formatNum(m.views)}</span>
          <span>❤ ${formatNum(m.likes)}</span>
          <span>💬 ${formatNum(m.comments)}</span>
          <span>🎁 ${formatNum(m.gifts)}</span>
          <span>⭐ ${formatNum(m.favs)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Room panel
  const room = document.getElementById('roomPanel');
  if (room) {
    room.innerHTML = `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:60px;margin-bottom:16px">🎤</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px">听歌房</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:20px">和朋友们一起听歌，实时互动</div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button onclick="showToast('🎤 创建房间功能即将上线')" style="padding:10px 24px;border-radius:20px;border:none;background:var(--accent);color:#000;font-size:14px;font-weight:700;cursor:pointer">🎤 创建房间</button>
          <button onclick="showToast('🔍 加入房间功能即将上线')" style="padding:10px 24px;border-radius:20px;border:1px solid var(--accent);background:transparent;color:var(--accent);font-size:14px;font-weight:600;cursor:pointer">🔍 加入房间</button>
        </div>
      </div>`;
  }

  // Artist section
  renderArtistSection();

  // Regular song list
  const list = document.getElementById('songList');
  if (!list) return;
  if (songs.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text3)"><div style="font-size:48px">🎵</div><div style="margin-top:12px;font-size:14px">还没有作品</div><div style="font-size:12px;margin-top:4px">去「创作」页面生成第一首歌吧</div></div>';
    return;
  }
  list.innerHTML = songs.map((s, i) => `
    <div class="song-card" onclick="openDetail(songs[${i}])">
      <div class="song-card-cover" style="background:${gradients[s.coverIdx % gradients.length]}">${coverEmojis[s.coverIdx]}</div>
      <div class="song-card-info">
        <div class="song-card-title">${s.title}</div>
        <div class="song-card-artist">${s.artist}</div>
        <div class="song-card-meta">
          <span>⏱ ${s.duration}</span>
          <div class="song-card-tags">
            <span class="song-card-tag">${s.style}</span>
            ${s.mood !== s.style ? `<span class="song-card-tag">${s.mood}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="song-card-actions" onclick="event.stopPropagation()">
        <button class="song-card-action" onclick="sendGift(event, songs[${i}])">🎁 ${formatNum(s.gifts)}</button>
        <button class="song-card-action" onclick="showToast('📤 分享')">📤</button>
        <button class="song-card-action" onclick="showToast('💬 评论')">💬 ${formatNum(s.comments)}</button>
        <button class="song-card-action ${s.liked ? 'liked' : ''}" id="likeBtn${s.id}" onclick="toggleLike(${s.id})">${s.liked ? '❤️' : '🤍'} ${formatNum(s.likes)}</button>
        <button class="song-card-action ${s.favorited ? 'favorited' : ''}" id="favBtn${s.id}" onclick="toggleFav(${s.id})">${s.favorited ? '★' : '☆'}</button>
      </div>
    </div>
  `).join('');
  // Render music circle
}

// ==================== MUSIC CIRCLE ====================
var circlePosts = [
  {id:1,user:'花开半夏',avatar:'🌸',level:5,levelName:'创作达人',time:'2分钟前',text:'刚用AI写了首新歌《春日晚风》，大家听听看！🎵',media:[
    {type:'image',bg:'linear-gradient(135deg,#667eea,#764ba2)',emoji:'🌸'},
  ],likes:128,comments:32,liked:false},
  {id:2,user:'深夜旅人',avatar:'🌙',level:4,levelName:'资深音乐人',time:'18分钟前',text:'城市霓虹下的孤独，送给每一个夜归人 🌃',media:[
    {type:'image',bg:'linear-gradient(135deg,#f093fb,#f5576c)',emoji:'🌃'},
    {type:'image',bg:'linear-gradient(135deg,#4facfe,#00f2fe)',emoji:'🌊'},
  ],likes:256,comments:58,liked:false},
  {id:3,user:'墨染青衣',avatar:'🎨',level:3,levelName:'活跃音乐人',time:'32分钟前',text:'雨中曲MV拍摄花絮，雨天的录音棚最有感觉 ☔',media:[
    {type:'video',bg:'linear-gradient(135deg,#2d1b69,#1a1a3e)',emoji:'🎬'},
  ],likes:89,comments:15,liked:false},
  {id:4,user:'星河旅人',avatar:'✨',level:5,levelName:'创作达人',time:'1小时前',text:'今天在广场弹唱，路人小姐姐即兴合唱，音乐的力量！🎸',media:[
    {type:'image',bg:'linear-gradient(135deg,#a18cd1,#fbc2eb)',emoji:'🎸'},
    {type:'image',bg:'linear-gradient(135deg,#ffecd2,#fcb69f)',emoji:'🎤'},
    {type:'image',bg:'linear-gradient(135deg,#ff9a9e,#fecfef)',emoji:'❤️'},
  ],likes:432,comments:87,liked:false},
  {id:5,user:'音乐制作人Leo',avatar:'🎧',level:4,levelName:'资深音乐人',time:'2小时前',text:'分享一波录音棚日常：新设备到位，音质起飞！下周发新歌🔥',media:[],likes:168,comments:41,liked:false},
  {id:6,user:'晴天娃娃',avatar:'☀️',level:2,levelName:'创作新人',time:'3小时前',text:'用Ai乐酷生成的《星海漫步》被朋友夸了！这AI太强了吧 🤯',media:[
    {type:'image',bg:'linear-gradient(135deg,#a8edea,#fed6e3)',emoji:'⭐'},
  ],likes:311,comments:62,liked:false},
];

function renderMusicCircle() {
  var feed = document.getElementById('circleFeed');
  if (!feed) return;
  feed.innerHTML = circlePosts.map(function(p){
    var mediaHTML = '';
    if (p.media && p.media.length > 0) {
      var gridClass = p.media.length === 1 ? 'single' : p.media.length === 2 ? 'double' : 'triple';
      mediaHTML = '<div class="circle-post-media '+gridClass+'">' + p.media.map(function(m){
        if (m.type === 'video') {
          return '<div class="circle-post-video" style="background:'+m.bg+'" onclick="event.stopPropagation();openCircleDetail('+p.id+')"><span style="font-size:40px">'+m.emoji+'</span></div>';
        }
        return '<div class="circle-post-img" style="background:'+m.bg+'" onclick="event.stopPropagation();openCircleDetail('+p.id+')">'+m.emoji+'</div>';
      }).join('') + '</div>';
    }
    var htmlText = p.text ? '<div class="circle-post-text">'+linkifyText(p.text)+'</div>' : '';
    return '<div class="circle-post" onclick="openCircleDetail('+p.id+')">'+
      '<div class="circle-post-header">'+
        '<div class="circle-post-avatar" style="background:linear-gradient(135deg,'+['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe','#a18cd1,#fbc2eb','#ff9a9e,#fecfef','#fa709a,#fee140'][p.id%6]+')">'+p.avatar+'</div>'+
        '<div style="flex:1">'+
          '<div class="circle-post-name">'+p.user+'<span class="circle-level lv'+p.level+'">'+p.levelName+'</span></div>'+
          '<div class="circle-post-time">'+p.time+'</div>'+
        '</div>'+
      '</div>'+
      htmlText +
      mediaHTML +
      '<div class="circle-post-actions" onclick="event.stopPropagation()">'+
        '<button class="circle-action '+ (p.liked?'liked':'') +'" id="circleLike'+p.id+'" onclick="circleLike('+p.id+')">'+ (p.liked?'❤️':'🤍') +' <span>'+p.likes+'</span></button>'+
        '<button class="circle-action" onclick="circleComment('+p.id+')">💬 <span>'+p.comments+'</span></button>'+
        '<button class="circle-action" onclick="circleShare('+p.id+')">↗ 分享</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function linkifyText(text) {
  return text.replace(/《([^》]+)》/g, '<span style="color:var(--accent);text-decoration:underline;cursor:pointer" onclick="event.stopPropagation();showToast(\'🎵 播放: $1\')">《$1》</span>');
}

// Like
function circleLike(id) {
  var p = circlePosts.find(function(x){return x.id===id;});
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  var btn = document.getElementById('circleLike'+id);
  if (btn) {
    btn.className = 'circle-action ' + (p.liked?'liked':'');
    btn.innerHTML = (p.liked?'❤️':'🤍') + ' <span>'+p.likes+'</span>';
  }
}

// Comment
function circleComment(id) {
  var p = circlePosts.find(function(x){return x.id===id;});
  if (!p) return;
  var mockCmts = p.comments > 0 ? ['🎵 好听！','支持原创 🔥','已收藏 ⭐','期待更多作品 🙌','这AI也太强了','已分享到朋友圈'].slice(0, Math.min(3, p.comments)) : [];
  var cmtHTML = mockCmts.length > 0 ? mockCmts.map(function(c,i){ return '<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,'+['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe'][i%3]+');display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">'+['🌸','🌙','✨'][i%3]+'</span><div><div style="font-weight:600;font-size:12px">'+['音乐爱好者','乐迷小明','路人甲'][i%3]+'</div><div style="color:var(--text2);margin-top:2px">'+c+'</div></div></div>'; }).join('') : '<div style="text-align:center;color:var(--text3);padding:20px">暂无评论，快来抢沙发 🛋️</div>';
  var html = '<div style="font-size:13px"><p style="margin-bottom:12px;font-weight:700">💬 '+p.comments+' 条评论</p>'+cmtHTML+'<div style="display:flex;gap:8px;margin-top:12px"><input type="text" id="cmtInput'+id+'" placeholder="写评论..." style="flex:1;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px"><button onclick="addCircleComment('+id+')" style="padding:10px 16px;border-radius:8px;border:none;background:var(--accent);color:#000;font-size:13px;font-weight:700">发送</button></div></div>';
  openPanel('💬 评论', html);
}

function addCircleComment(id) {
  var input = document.getElementById('cmtInput'+id);
  if (!input || !input.value.trim()) return;
  var p = circlePosts.find(function(x){return x.id===id;});
  if (!p) return;
  p.comments++;
  showToast('✅ 评论成功');
  input.value = '';
  // Update comment count in feed
  var post = document.querySelector('.circle-post[onclick*="openCircleDetail('+id+')"]');
  if (post) {
    var cmtBtn = post.querySelector('.circle-action:nth-child(2) span');
    if (cmtBtn) cmtBtn.textContent = p.comments;
  }
}

// Share
function circleShare(id) {
  var p = circlePosts.find(function(x){return x.id===id;});
  if (!p) return;
  var html = '<div style="display:flex;flex-direction:column;gap:10px">'+
    '<button onclick="shareTo(\'wechat\','+id+')" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:15px;text-align:left;cursor:pointer">💬 分享到微信</button>'+
    '<button onclick="shareTo(\'moments\','+id+')" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:15px;text-align:left;cursor:pointer">🟢 分享到朋友圈</button>'+
    '<button onclick="shareTo(\'copy\','+id+')" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:15px;text-align:left;cursor:pointer">📋 复制链接</button>'+
  '</div>';
  openPanel('↗ 分享', html);
}

function shareTo(platform, id) {
  var p = circlePosts.find(function(x){return x.id===id;});
  var names = {wechat:'微信好友', moments:'朋友圈', copy:'剪贴板'};
  showToast('✅ 已分享到'+names[platform]);
  closePanel();
}

function likeCirclePost(id) { circleLike(id); }

function openCircleDetail(id) {
  var p = circlePosts.find(function(x){return x.id===id;});
  if (!p) return;
  var mediaHTML = '';
  if (p.media && p.media.length > 0) {
    var gridClass = p.media.length === 1 ? 'single' : p.media.length === 2 ? 'double' : 'triple';
    mediaHTML = '<div class="circle-post-media '+gridClass+'">' + p.media.map(function(m){
      if (m.type === 'video') {
        return '<div class="circle-post-video" style="background:'+m.bg+'"><span style="font-size:48px">'+m.emoji+'</span></div>';
      }
      return '<div class="circle-post-img" style="background:'+m.bg+'">'+m.emoji+'</div>';
    }).join('') + '</div>';
  }
  var html = '<div style="font-size:13px;line-height:1.8">'+
    '<p><b>'+p.user+'</b> <span class="circle-level lv'+p.level+'" style="display:inline-block">'+p.levelName+'</span></p>'+
    '<p style="margin:10px 0;font-size:14px">'+linkifyText(p.text)+'</p>'+
    mediaHTML +
    '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:20px;font-size:12px;color:var(--text2)">'+
      '<span style="cursor:pointer" onclick="circleLike('+p.id+')">'+ (p.liked?'❤️ ':'🤍 ') +p.likes+' 赞</span>'+
      '<span style="cursor:pointer" onclick="circleComment('+p.id+')">💬 '+p.comments+' 评论</span>'+
      '<span style="cursor:pointer" onclick="circleShare('+p.id+')">↗ 分享</span>'+
      '<span style="margin-left:auto;color:var(--text3)">'+p.time+'</span>'+
    '</div>'+
  '</div>';
  openPanel(p.user+' 的朋友圈', html);
}

function postToCircle() {
  showToast('📝 发布功能即将上线，敬请期待！');
}

function renderMusicCircleToSquare() {
  var el = document.getElementById('squareCircle');
  if (!el) return;
  el.style.padding = '0';
  var feedHTML = '<div class="circle-feed" style="padding-top:8px">' + circlePosts.map(function(p){
    var mediaHTML = '';
    if (p.media && p.media.length > 0) {
      var gridClass = p.media.length === 1 ? 'single' : p.media.length === 2 ? 'double' : 'triple';
      mediaHTML = '<div class="circle-post-media '+gridClass+'">' + p.media.map(function(m){
        if (m.type === 'video') {
          return '<div class="circle-post-video" style="background:'+m.bg+'" onclick="event.stopPropagation();openCircleDetail('+p.id+')"><span style="font-size:40px">'+m.emoji+'</span></div>';
        }
        return '<div class="circle-post-img" style="background:'+m.bg+'" onclick="event.stopPropagation();openCircleDetail('+p.id+')">'+m.emoji+'</div>';
      }).join('') + '</div>';
    }
    var htmlText = p.text ? '<div class="circle-post-text">'+linkifyText(p.text)+'</div>' : '';
    return '<div class="circle-post" onclick="openCircleDetail('+p.id+')">'+
      '<div class="circle-post-header">'+
        '<div class="circle-post-avatar" style="background:linear-gradient(135deg,'+['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe','#a18cd1,#fbc2eb','#ff9a9e,#fecfef','#fa709a,#fee140'][p.id%6]+')">'+p.avatar+'</div>'+
        '<div style="flex:1">'+
          '<div class="circle-post-name">'+p.user+'<span class="circle-level lv'+p.level+'">'+p.levelName+'</span></div>'+
          '<div class="circle-post-time">'+p.time+'</div>'+
        '</div>'+
      '</div>'+
      htmlText +
      mediaHTML +
      '<div class="circle-post-actions" onclick="event.stopPropagation()">'+
        '<button class="circle-action '+ (p.liked?'liked':'') +'" id="circleLike'+p.id+'" onclick="circleLike('+p.id+')">'+ (p.liked?'❤️':'🤍') +' <span>'+p.likes+'</span></button>'+
        '<button class="circle-action" onclick="circleComment('+p.id+')">💬 <span>'+p.comments+'</span></button>'+
        '<button class="circle-action" onclick="circleShare('+p.id+')">↗ 分享</button>'+
      '</div>'+
    '</div>';
  }).join('') + '</div>';
  el.innerHTML = feedHTML;
}

// ==================== ARTIST SECTION (Home Page) ====================
var artistMusicians = [
  {id:'a1',name:'花开半夏',avatar:'🌸',level:5,levelName:'创作达人',fans:'12.8k',songs:32,bio:'独立音乐人，擅长古风流行',grad:0,online:true},
  {id:'a2',name:'深夜旅人',avatar:'🌙',level:4,levelName:'资深音乐人',fans:'8.6k',songs:24,bio:'城市民谣，用音乐记录生活',grad:2,online:true},
  {id:'a3',name:'星河旅人',avatar:'✨',level:5,levelName:'创作达人',fans:'6.2k',songs:18,bio:'电子音乐制作人',grad:4,online:false},
  {id:'a4',name:'墨染青衣',avatar:'🎨',level:3,levelName:'活跃音乐人',fans:'4.8k',songs:20,bio:'水墨画般的音乐世界',grad:5,online:true},
  {id:'a5',name:'音乐制作人Leo',avatar:'🎧',level:4,levelName:'资深音乐人',fans:'3.9k',songs:15,bio:'专业录音棚主理人',grad:1,online:false},
  {id:'a6',name:'晴天娃娃',avatar:'☀️',level:2,levelName:'创作新人',fans:'2.1k',songs:8,bio:'阳光系唱作人',grad:3,online:true},
];

function renderArtistSection() {
  var list = document.getElementById('artistList');
  if (!list) return;
  list.innerHTML = artistMusicians.map(function(a){
    return '<div class="circle-post" onclick="openArtistChat(''+a.id+'')" style="cursor:pointer">'+
      '<div class="circle-post-header">'+
        '<div class="circle-post-avatar" style="background:'+gradients[a.grad]+';position:relative">'+a.avatar+
          (a.online ? '<div style="position:absolute;bottom:0;right:0;width:10px;height:10px;background:#2ecc71;border-radius:50%;border:2px solid var(--bg)"></div>' : '')+
        '</div>'+
        '<div style="flex:1">'+
          '<div class="circle-post-name">'+a.name+'<span class="circle-level lv'+a.level+'">'+a.levelName+'</span></div>'+
          '<div class="circle-post-time">'+a.bio+'</div>'+
        '</div>'+
        '<div style="text-align:right;font-size:11px;color:var(--text3);flex-shrink:0">'+
          '<div>👥 '+a.fans+'</div><div>🎵 '+a.songs+'首</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

// ==================== CHAT SYSTEM ====================
var chatData = {};
artistMusicians.forEach(function(a){
  chatData[a.id] = [
    {from:'them',text:'嗨！欢迎来听我的最新作品 🎵',time:'10:30'},
    {from:'them',text:'有什么想聊的尽管说~',time:'10:31'},
  ];
});

var chatPartner = null;

function openArtistChat(aid) {
  var a = artistMusicians.find(function(x){return x.id===aid;});
  if (!a) return;
  chatPartner = a;
  var msgs = chatData[aid] || [];
  var msgHTML = msgs.map(function(m){
    var isMe = m.from === 'me';
    return '<div style="display:flex;'+(isMe?'justify-content:flex-end':'')+';margin-bottom:10px">'+
      '<div style="max-width:75%;padding:10px 14px;border-radius:16px;'+(isMe?
        'background:var(--accent);color:#000;border-bottom-right-radius:4px':
        'background:var(--card);color:var(--text);border-bottom-left-radius:4px')+
      ';font-size:13px;line-height:1.5">'+
        (m.type==='image' ? '<div style="font-size:40px;text-align:center">🖼</div><div style="font-size:10px;text-align:center;margin-top:4px">[图片]</div>' : '')+
        (m.type==='file' ? '<div style="font-size:32px;text-align:center">📄</div><div style="font-size:10px;text-align:center;margin-top:4px">['+m.fileName+']</div>' : '')+
        (m.text||'')+
      '<div style="font-size:10px;margin-top:4px;opacity:0.6;text-align:right">'+m.time+'</div>'+
      '</div></div>';
  }).join('');
  if (msgs.length === 0) msgHTML = '<div style="text-align:center;color:var(--text3);padding:40px">打个招呼吧 👋</div>';

  var html = '<div style="display:flex;flex-direction:column;height:100%">'+
    '<div style="display:flex;align-items:center;gap:10px;padding:4px 0 10px;border-bottom:1px solid var(--border);margin-bottom:10px">'+
      '<div class="circle-post-avatar" style="background:'+gradients[a.grad]+';position:relative;width:36px;height:36px;font-size:18px">'+a.avatar+
        (a.online?'<div style="position:absolute;bottom:0;right:0;width:8px;height:8px;background:#2ecc71;border-radius:50%;border:2px solid var(--bg)"></div>':'')+
      '</div>'+
      '<div><div style="font-weight:700;font-size:14px">'+a.name+'</div><div style="font-size:11px;color:'+(a.online?'#2ecc71':'var(--text3)')+'">'+(a.online?'在线':'离线')+'</div></div>'+
    '</div>'+
    '<div id="chatMsgs" style="flex:1;overflow-y:auto;padding-right:4px;min-height:200px">'+msgHTML+'</div>'+
    '<div style="display:flex;gap:6px;padding-top:10px;border-top:1px solid var(--border);margin-top:8px">'+
      '<button onclick="sendChatMedia('image')" style="padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:18px;cursor:pointer;flex-shrink:0">🖼</button>'+
      '<button onclick="sendChatMedia('file')" style="padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:18px;cursor:pointer;flex-shrink:0">📎</button>'+
      '<input type="text" id="chatInput" placeholder="输入消息..." onkeydown="if(event.key==='Enter')sendChatMsg()" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;min-width:0">'+
      '<button onclick="sendChatMsg()" style="padding:10px 16px;border-radius:10px;border:none;background:var(--accent);color:#000;font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0">发送</button>'+
    '</div>'+
  '</div>';
  openPanel('💬 '+a.name, html);
  // Scroll to bottom
  setTimeout(function(){
    var mc = document.getElementById('chatMsgs');
    if(mc) mc.scrollTop = mc.scrollHeight;
  },100);
}

function sendChatMsg() {
  if (!chatPartner) return;
  var input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;
  var text = input.value.trim();
  var now = new Date();
  var time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  chatData[chatPartner.id].push({from:'me',text:text,time:time});
  input.value = '';
  // Refresh chat panel
  openArtistChat(chatPartner.id);
  // Auto reply
  setTimeout(function(){
    var replies = ['👍 收到！','哈哈 😄','说得太好了','继续聊~','有新作品记得分享','🎵 音乐无界'];
    var reply = replies[Math.floor(Math.random()*replies.length)];
    var rt = new Date();
    var rtime = rt.getHours().toString().padStart(2,'0')+':'+rt.getMinutes().toString().padStart(2,'0');
    chatData[chatPartner.id].push({from:'them',text:reply,time:rtime});
    // Check if panel is still open and has chatMsgs
    var msgsEl = document.getElementById('chatMsgs');
    if (msgsEl && document.getElementById('panelOverlay').classList.contains('show')) {
      openArtistChat(chatPartner.id);
    }
  }, 800+Math.random()*1500);
}

function sendChatMedia(type) {
  if (!chatPartner) return;
  var now = new Date();
  var time = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  if (type === 'image') {
    chatData[chatPartner.id].push({from:'me',type:'image',time:time});
  } else {
    chatData[chatPartner.id].push({from:'me',type:'file',fileName:'demo.mp3',time:time});
  }
  openArtistChat(chatPartner.id);
  showToast(type==='image' ? '📷 图片已发送' : '📎 文件已发送');
  // Auto reply
  setTimeout(function(){
    var reply = type==='image'?'📸 好看！':'📥 收到了，谢谢！';
    var rt = new Date();
    var rtime = rt.getHours().toString().padStart(2,'0')+':'+rt.getMinutes().toString().padStart(2,'0');
    chatData[chatPartner.id].push({from:'them',text:reply,time:rtime});
    var msgsEl = document.getElementById('chatMsgs');
    if (msgsEl && document.getElementById('panelOverlay').classList.contains('show')) {
      openArtistChat(chatPartner.id);
    }
  }, 600+Math.random()*1000);
}


function updateHero() {
  const s = songs[0];
  document.getElementById('heroCover').textContent = coverEmojis[s.coverIdx];
  document.getElementById('heroCover').style.background = gradients[s.coverIdx % gradients.length];
  document.getElementById('heroTitle').textContent = s.title;
  document.getElementById('heroArtist').textContent = s.artist;
  document.getElementById('heroTags').innerHTML = `
    <span class="hero-tag">${s.style}</span>
    <span class="hero-tag">${s.mood}</span>
    <span class="hero-tag">${s.instrument}</span>
  `;
}

function updateSongCard(song) {
  const btn = document.getElementById(`likeBtn${song.id}`);
  if (btn) {
    btn.className = `song-card-action ${song.liked ? 'liked' : ''}`;
    btn.innerHTML = `${song.liked ? '❤️' : '🤍'} ${formatNum(song.likes)}`;
  }
  const fbtn = document.getElementById(`favBtn${song.id}`);
  if (fbtn) {
    fbtn.className = `song-card-action ${song.favorited ? 'favorited' : ''}`;
    fbtn.innerHTML = `${song.favorited ? '⭐' : '☆'}`;
  }
}

// ==================== SQUARE ====================
function renderSquare() {

  // Hot songs
  var hotEl = document.getElementById('squareHot');
  if (songs.length === 0) {
    hotEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text3)"><div style="font-size:40px">🔥</div><div style="margin-top:8px;font-size:13px">暂无热门歌曲</div><div style="font-size:11px;margin-top:4px">发布作品后将自动上榜</div></div>';
  } else {
    hotEl.innerHTML = songs.slice(0,6).map(s=>`
    <div class="song-card" onclick="openDetail(songs.find(x=>x.id===${s.id}))" style="margin:4px 16px">
      <div class="song-card-cover" style="background:${gradients[s.coverIdx % gradients.length]}">${coverEmojis[s.coverIdx]}</div>
      <div class="song-card-info">
        <div class="song-card-title">${s.title}</div>
        <div class="song-card-artist">${s.artist} · ${s.style}</div>
        <div class="song-card-meta">🔥 ${formatNum(s.plays)} · ❤️ ${formatNum(s.likes)}</div>
      </div>
      <button class="hero-play-btn" style="padding:6px 14px;font-size:12px;flex:none" onclick="event.stopPropagation();playSong(songs.find(x=>x.id===${s.id}))">▶</button>
    </div>
  `).join('');
  }

  // New songs
  var newEl = document.getElementById('squareNew');
  if (songs.length === 0) {
    newEl.innerHTML = '';
  } else {
    newEl.innerHTML = [...songs].reverse().slice(0,6).map(s=>`
    <div class="song-card" onclick="openDetail(songs.find(x=>x.id===${s.id}))" style="margin:4px 16px">
      <div class="song-card-cover" style="background:${gradients[(s.coverIdx+1) % gradients.length]}">${coverEmojis[(s.coverIdx+1) % coverEmojis.length]}</div>
      <div class="song-card-info">
        <div class="song-card-title">${s.title}</div>
        <div class="song-card-artist">${s.artist} · ${s.style}</div>
        <div class="song-card-meta">🆕 新发布 · ❤️ ${formatNum(s.likes)}</div>
      </div>
      <button class="hero-play-btn" style="padding:6px 14px;font-size:12px;flex:none" onclick="event.stopPropagation();playSong(songs.find(x=>x.id===${s.id}))">▶</button>
    </div>
  `).join('');
  }

  // Music circle content rendered on demand via switchSquareTab
  // Groups
  const groups = [
    {name:'音乐创作交流群',avatar:'🎵',members:1200,grad:0},
    {name:'独立音乐人联盟',avatar:'🎸',members:856,grad:3},
    {name:'古风音乐爱好者',avatar:'🏮',members:620,grad:5},
    {name:'电子音乐制作组',avatar:'🎛',members:498,grad:6},
    {name:'流行音乐加油站',avatar:'🎤',members:3500,grad:1},
    {name:'民谣吉他弹唱圈',avatar:'🎸',members:2300,grad:4},
  ];
  document.getElementById('squareGroup').innerHTML = groups.map(g=>`
    <div class="group-card" style="margin:4px 16px">
      <div class="group-avatar" style="background:${gradients[g.grad]}">${g.avatar}</div>
      <div class="group-info">
        <div class="group-name">${g.name}</div>
        <div class="group-meta">${formatNum(g.members)} 成员 · 今日99+新消息</div>
      </div>
      <button class="group-join-btn" onclick="event.stopPropagation();showToast('✅ 已申请加入')">加入</button>
    </div>
  `).join('');
}

function switchSquareTab(type, btn) {
  document.querySelectorAll('.square-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  ['squareHot','squareNew','squareCircle','squareGroup'].forEach(id=>{
    document.getElementById(id).style.display='none';
  });
  const map = {hot:'squareHot',new:'squareNew',circle:'squareCircle',group:'squareGroup'};
  const el = document.getElementById(map[type]);
  if (el) el.style.display='block';
  if (type === 'circle') renderMusicCircleToSquare();
}

// ==================== MESSAGES ====================
function renderMessages(cat) {
  cat = cat || currentMsgCat;
  currentMsgCat = cat;

  document.getElementById('msgCategories').innerHTML = msgCategories.map(c => `
    <span class="msg-cat ${c === cat ? 'active' : ''}" onclick="renderMessages('${c}')">${c}</span>
  `).join('');

  const filtered = cat === '全部' ? messages : messages.filter(m => m.cat === cat);
  document.getElementById('msgList').innerHTML = filtered.length > 0 ? filtered.map(m => `
    <div class="msg-item" onclick="showToast('打开对话: ${m.sender}')">
      <div class="msg-avatar">${m.avatar}</div>
      <div class="msg-content">
        <div class="msg-sender">${m.sender}</div>
        <div class="msg-preview">${m.preview}</div>
      </div>
      <div class="msg-right">
        <span class="msg-time">${m.time}</span>
        ${m.unread ? '<span class="msg-dot"></span>' : ''}
      </div>
    </div>
  `).join('') : '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">暂无此类消息</div></div>';
}

let hasLyrics = false;

function initBPM() {
  const slider = document.getElementById('formBPM');
  const valEl = document.getElementById('bpmValue');
  if (!slider || !valEl) return;
  slider.addEventListener('input', function() {
    currentBPM = parseInt(this.value);
    valEl.textContent = currentBPM;
  });
}

// ==================== SONG DETAIL ====================
function renderDetail(song) {
  if (!song) return;
  detailSong = song;
  document.getElementById('detailCover').textContent = coverEmojis[song.coverIdx];
  document.getElementById('detailCover').style.background = gradients[song.coverIdx % gradients.length];
  document.getElementById('detailTitle').textContent = song.title;
  document.getElementById('detailArtist').textContent = song.artist;
  document.getElementById('detailTags').innerHTML = `
    <span class="detail-tag">${song.style}</span>
    <span class="detail-tag">${song.mood}</span>
    <span class="detail-tag">${song.instrument}</span>
    <span class="detail-tag">${song.bpm} BPM</span>
  `;
  document.getElementById('detailPlays').textContent = '▶ ' + formatNum(song.plays);
  document.getElementById('detailDuration').textContent = '⏱ ' + song.duration;
  updateDetailActions();
  document.getElementById('detailModal').classList.add('show');
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('show');
}

function updateDetailActions() {
  if (!detailSong) return;
  const likeBtn = document.getElementById('detailLike');
  const favBtn = document.getElementById('detailFav');
  likeBtn.innerHTML = `${detailSong.liked ? '❤️' : '🤍'}<span class="detail-action-label liked-count">${formatNum(detailSong.likes)}</span>`;
  likeBtn.className = `detail-action ${detailSong.liked ? 'liked' : ''}`;
  favBtn.innerHTML = `${detailSong.favorited ? '⭐️' : '☆'}<span class="detail-action-label">收藏</span>`;
  favBtn.className = `detail-action ${detailSong.favorited ? 'favorited' : ''}`;
}

function toggleLike(songId) {
  const s = songs.find(x => x.id === songId);
  if (!s) return;
  s.liked = !s.liked;
  s.likes += s.liked ? 1 : -1;
  if (s.likes < 0) s.likes = 0;
  updateSongCard(s);
  if (detailSong && detailSong.id === s.id) { detailSong = s; updateDetailActions(); }
  showToast(s.liked ? '❤️ 已点赞' : '已取消点赞');
}

function toggleFav(songId) {
  const s = songs.find(x => x.id === songId);
  if (!s) return;
  s.favorited = !s.favorited;
  updateSongCard(s);
  if (detailSong && detailSong.id === s.id) { detailSong = s; updateDetailActions(); }
  showToast(s.favorited ? '⭐ 已收藏' : '已取消收藏');
}

function toggleLikeDetail() {
  if (!detailSong) return;
  toggleLike(detailSong.id);
}

function toggleFavDetail() {
  if (!detailSong) return;
  toggleFav(detailSong.id);
}

// ==================== BOTTOM SHEET ====================
function openSheet() {
  sheetSong = detailSong;
  pushNav('sheet');
  document.getElementById('bottomSheetOverlay').classList.add('show');
  if (detailSong) {
    document.getElementById('sheetLike').textContent = detailSong.liked ? '❤️ 取消喜欢' : '🤍 喜欢';
  }
}

function closeSheet() {
  document.getElementById('bottomSheetOverlay').classList.remove('show');
}

function toggleLikeSheet() {
  if (!sheetSong) return;
  toggleLike(sheetSong.id);
  closeSheet();
}

// ==================== GIFT ANIMATION ====================
function sendGift(event, song) {
  if (!song) return;
  song.gifts++;

  const rect = event.target.getBoundingClientRect();
  const appRect = document.getElementById('app').getBoundingClientRect();
  const x = rect.left - appRect.left + rect.width/2;
  const y = rect.top - appRect.top;

  const gift = document.createElement('div');
  gift.className = 'gift-float';
  const emojis = ['🎁','💝','🌹','💎','🎀','🌟','💖','🎵'];
  gift.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  gift.style.left = x + 'px';
  gift.style.top = y + 'px';
  document.getElementById('app').appendChild(gift);

  setTimeout(() => gift.remove(), 1500);

  renderHome();
  if (detailSong && detailSong.id === song.id) {
    detailSong = songs.find(s => s.id === song.id);
  }
  showToast('🎁 礼物已送出');
}

// ==================== PLAYER ====================
function playSong(song) {
  if (!song) return;
  var isNewSong = (playerBarSong !== song);
  playerBarSong = song;

  // Stop previous
  stopPlayback();

  // Show player bar
  const bar = document.getElementById('playerBar');
  bar.style.display = 'flex';
  document.getElementById('playerBarCover').textContent = coverEmojis[song.coverIdx];
  document.getElementById('playerBarCover').style.background = gradients[song.coverIdx % gradients.length];
  document.getElementById('playerBarTitle').textContent = song.title;
  document.getElementById('playerBarArtist').textContent = song.artist;

  // Earn bean for listening (once per song per session)
  if (isNewSong && !song._beanEarned) {
    song._beanEarned = true;
    earnBeans(1, '听歌');
  }

  // Start Tone.js playback
  if (window._toneReady || typeof Tone !== 'undefined') {
    startTonePlayback(song);
  }

  isPlaying = true;
  document.getElementById('playerBarPlayBtn').textContent = '⏸';
  document.getElementById('detailPlayBtn').textContent = '⏸ 暂停';

  playerProgress = 0;
  updatePlayerProgress();
  playerInterval = setInterval(() => {
    playerProgress += 1.5;
    if (playerProgress >= 100) {
      playerProgress = 0;
    }
    updatePlayerProgress();
  }, 300);
}

function stopPlayback() {
  if (synth) {
    try { synth.dispose(); } catch(e) {}
    synth = null;
  }
  if (playerInterval) {
    clearInterval(playerInterval);
    playerInterval = null;
  }
  isPlaying = false;
  playerProgress = 0;
  document.getElementById('playerBarPlayBtn').textContent = '▶';
  document.getElementById('detailPlayBtn').textContent = '▶ 播放';
  updatePlayerProgress();
  document.getElementById('playerBar').style.display = 'none';
  document.getElementById('playerBarTitle').textContent = '';
  document.getElementById('playerBarArtist').textContent = '';
}

function togglePlay() {
  if (!playerBarSong) return;
  if (isPlaying) {
    pausePlayback();
  } else {
    resumePlayback();
  }
}

function pausePlayback() {
  if (synth) {
    try { synth.volume.value = -60; } catch(e) {}
  }
  isPlaying = false;
  document.getElementById('playerBarPlayBtn').textContent = '▶';
  document.getElementById('detailPlayBtn').textContent = '▶ 播放';
}

function resumePlayback() {
  if (!playerBarSong) return;
  if (synth) {
    try { synth.volume.value = -12; } catch(e) {}
  } else if (window._toneReady || typeof Tone !== 'undefined') {
    startTonePlayback(playerBarSong);
  }
  isPlaying = true;
  document.getElementById('playerBarPlayBtn').textContent = '⏸';
  document.getElementById('detailPlayBtn').textContent = '⏸ 暂停';
}

function nextSong() {
  if (!playerBarSong) return;
  const idx = songs.findIndex(s => s.id === playerBarSong.id);
  const next = songs[(idx + 1) % songs.length];
  playSong(next);
}

function updatePlayerProgress() {
  document.getElementById('playerBarProgress').style.width = playerProgress + '%';
}

function startTonePlayback(song) {
  // Stop previous
  if (synth) { try { synth.dispose(); } catch(e) {} synth = null; }

  try {
    // Create synth based on instrument choice
    const bpm = song.bpm || 100;
    const beatDuration = 60 / bpm;

    // Simple melody synth
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: getOscType(song.instrument) },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8
      }
    }).toDestination();

    // Add reverb for atmosphere
    const reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.3
    }).toDestination();

    // Also add a delay for some styles
    const delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.2,
      wet: 0.15
    }).toDestination();

    synth.connect(reverb);
    synth.connect(delay);

    synth.volume.value = -12;

    // Generate melody based on mood
    const notes = getNotesForMood(song.mood);
    const pattern = getRhythmPattern(song.mood);
    let step = 0;

    const loop = new Tone.Loop((time) => {
      if (step < pattern.length) {
        const noteIdx = pattern[step];
        if (noteIdx >= 0 && noteIdx < notes.length) {
          synth.triggerAttackRelease(notes[noteIdx], beatDuration * 0.8, time);
        }
        step++;
      } else {
        step = 0;
      }
    }, beatDuration * 0.5);

    Tone.Transport.bpm.value = bpm;
    loop.start(0);
    Tone.Transport.start();

    // Store for cleanup
    synth._loop = loop;
  } catch(e) {
    console.error('Tone.js error:', e);
  }
}

function getOscType(instrument) {
  const map = {
    '钢琴': 'triangle', '吉他': 'triangle', '古筝': 'sine', '合成器': 'sawtooth',
    '贝斯': 'square', '爵士鼓': 'square', '小提琴': 'sawtooth', '大提琴': 'triangle',
    '萨克斯': 'sawtooth', '电吉他': 'sawtooth', '电子琴': 'triangle',
    '手碟': 'sine', '卡林巴': 'sine', '八音盒': 'sine',
  };
  return map[instrument] || 'triangle';
}

function getNotesForMood(mood) {
  const scales = {
    '治愈': ['C4','E4','G4','A4','C5','D5','E5','G5'],
    '热血': ['C4','D4','F4','G4','A4','C5','D5','F5'],
    '抒情': ['C4','D4','E4','G4','A4','C5','D5','E5'],
    '轻松': ['C4','E4','G4','A4','C5','D5','E5','G5'],
    '迷幻': ['C4','Eb4','Gb4','Bb4','C5','Eb5','Gb5','Bb5'],
    '怀旧': ['D4','E4','G4','A4','B4','D5','E5','G5'],
    '浪漫': ['C4','E4','G4','A4','B4','C5','D5','E5'],
    '孤独': ['A3','C4','D4','E4','G4','A4','C5','D5'],
    '快乐': ['C4','E4','G4','A4','C5','D5','E5','G5'],
    '悲伤': ['A3','C4','D4','E4','F4','A4','C5','D5'],
    '梦幻': ['C4','Eb4','G4','Bb4','C5','Eb5','G5','Bb5'],
    '清新': ['C4','E4','G4','A4','B4','D5','E5','G5'],
    '沉静': ['D4','F4','A4','C5','D5','F5','A5','C6'],
    '甜蜜': ['C4','E4','G4','A4','B4','D5','E5','G5'],
    '空灵': ['C4','Eb4','Gb4','Bb4','C5','Eb5','Gb5','Bb5'],
    '振奋': ['C4','E4','G4','B4','C5','E5','G5','B5'],
  };
  return scales[mood] || ['C4','E4','G4','A4','C5','D5','E5','G5'];
}

function getRhythmPattern(mood) {
  const patterns = {
    '治愈': [0,2,4,3,5,2,1,0],
    '热血': [0,2,4,5,3,1,2,4,5,3,0,1],
    '抒情': [0,1,3,4,5,3,2,1],
    '轻松': [0,2,3,4,5,3,2,0],
    '迷幻': [0,3,5,2,4,1,3,0],
    '怀旧': [0,1,2,3,4,5,4,3,2,1],
    '浪漫': [0,2,3,5,4,3,2,0],
    '快乐': [0,2,4,5,3,1,2,4],
    '悲伤': [0,1,3,5,3,1,0],
    '梦幻': [0,2,4,3,1,2,4,5],
    '清新': [0,2,3,4,2,1,0],
    '沉静': [0,2,1,3,2,4],
    '甜蜜': [0,3,2,4,3,5,4,3],
    '空灵': [0,3,5,2,4,1],
    '振奋': [0,2,4,5,4,2,0,1,3,5],
  };
  return patterns[mood] || [0,2,4,3,5,2,1,0];
}

// ==================== UTILS ====================
function formatNum(n) {
  if (n >= 10000) return (n/10000).toFixed(1) + '万';
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return n.toString();
}

function toggleSection(id) {
  const el = document.getElementById(id);
  const allPanels = ['mvSection','latestSection','roomSection'];
  const navMap = {mvSection:'mvPanel', latestSection:'latestPanel', roomSection:'roomPanel'};
  if (el.style.display === 'none') {
    // Close others
    allPanels.forEach(p => { const e = document.getElementById(p); if(e&&p!==id) e.style.display = 'none'; });
    el.style.display = 'block';
    if (navMap[id]) pushNav(navMap[id]);
    setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'nearest'}), 100);
  } else {
    el.style.display = 'none';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

// ==================== RECHARGE & WITHDRAW ====================
let userCoins = 0;
let userBeans = 0;
let userWorks = 0;
let isVip = false;
let vipTier = 'none';
let freeSongsLeft = 0;
const VIP_QUOTAS = { monthly: 30, quarterly: 100, annual: 500 };
const OWNER_OPEN_ID = 'o9cq808lVt294JMW9jdLMu-xNK_A';
let walletTapCount = 0;
let walletTapTimer = null;

function isOwner() {
  // Check localStorage flag OR URL param (for manual override)
  if (localStorage.getItem('isOwner') === '1') return true;
  if (window.location.search.indexOf('owner=1') !== -1) { localStorage.setItem('isOwner','1'); return true; }
  return false;
}

function updateWithdrawUI() {
  var sec = document.getElementById('withdrawSection');
  if (sec) sec.style.display = isOwner() ? 'block' : 'none';
  var wb = document.getElementById('withdrawBalance');
  if (wb) wb.textContent = '🪙 ' + userCoins + '乐币';
  var cnyEl = document.getElementById('withdrawBalanceCNY');
  if (cnyEl) cnyEl.textContent = (userCoins * 0.01).toFixed(2);
  // Update card display
  refreshCardDisplay();
}

function getBoundCard() {
  try { return JSON.parse(localStorage.getItem('boundCard') || 'null'); } catch(e) { return null; }
}

function refreshCardDisplay() {
  var card = getBoundCard();
  var bindArea = document.getElementById('cardBindingArea');
  var cardArea = document.getElementById('cardDisplayArea');
  if (!bindArea || !cardArea) return;
  if (card) {
    bindArea.style.display = 'none';
    cardArea.style.display = 'block';
    document.getElementById('cardDisplayBank').textContent = card.bank;
    document.getElementById('cardDisplayNumber').textContent = '**** **** **** ' + card.number.slice(-4);
    document.getElementById('cardDisplayHolder').textContent = card.holder;
  } else {
    bindArea.style.display = 'block';
    cardArea.style.display = 'none';
  }
}

function bindCard() {
  var bank = document.getElementById('cardBankName').value.trim();
  var number = document.getElementById('cardNumber').value.trim();
  var holder = document.getElementById('cardHolder').value.trim();
  if (!bank) { showToast('请输入银行名称'); return; }
  if (!number || number.length < 16) { showToast('请输入正确的银行卡号'); return; }
  if (!holder) { showToast('请输入持卡人姓名'); return; }
  var card = { bank: bank, number: number, holder: holder };
  localStorage.setItem('boundCard', JSON.stringify(card));
  // Clear inputs
  document.getElementById('cardBankName').value = '';
  document.getElementById('cardNumber').value = '';
  document.getElementById('cardHolder').value = '';
  refreshCardDisplay();
  showToast('✅ 银行卡绑定成功');
}

function unbindCard() {
  if (!confirm('确定解绑银行卡？解绑后无法提现。')) return;
  localStorage.removeItem('boundCard');
  refreshCardDisplay();
  showToast('银行卡已解绑');
}

function handleWalletTap(e) {
  if (isOwner()) { openRecharge(); return; }
  walletTapCount++;
  if (walletTapCount >= 5) {
    walletTapCount = 0;
    if (walletTapTimer) clearTimeout(walletTapTimer);
    var pin = prompt('🔐 管理员验证\n请输入管理密码：');
    if (pin === 'aileku2026') {
      localStorage.setItem('isOwner', '1');
      showToast('✅ 管理员身份已验证');
      updateWithdrawUI();
      setTimeout(function(){ openRecharge(); }, 500);
    } else {
      showToast('❌ 密码错误');
    }
  } else {
    if (walletTapTimer) clearTimeout(walletTapTimer);
    walletTapTimer = setTimeout(function(){ walletTapCount = 0; }, 2000);
    if (walletTapCount === 1) openRecharge();
  }
}

function setWithdrawAmount(amt) {
  if (!isOwner()) { showToast('🔒 仅管理员可提现'); return; }
  var inp = document.getElementById('withdrawAmountInput');
  if (amt === 'all') {
    inp.value = userCoins;
    inp.dataset.custom = '1';
  } else {
    inp.value = amt;
    inp.dataset.custom = '1';
  }
}

function withdraw() {
  if (!isOwner()) { showToast('🔒 仅管理员可提现'); return; }
  var card = getBoundCard();
  if (!card) { showToast('请先绑定提现银行卡'); return; }
  var inp = document.getElementById('withdrawAmountInput');
  var amt = parseInt(inp.value || 0);
  if (!amt || amt <= 0) { showToast('请输入有效的提现金额'); return; }
  if (amt > userCoins) { showToast('余额不足，当前可用 ' + userCoins + ' 乐币'); return; }
  userCoins -= amt;
  updateBalance();
  updateWithdrawUI();
  var walletVal = document.querySelector('.wallet-card-value');
  if (walletVal) walletVal.textContent = userCoins.toLocaleString();
  inp.value = '';
  var cardNum = '**** ' + card.number.slice(-4);
  showToast('✅ 提现 ¥' + amt + ' → ' + card.bank + '(' + cardNum + ') 预计2小时内到账');
}

// ==================== BEAN SYSTEM ====================
function earnBeans(amount, reason) {
  userBeans += amount;
  updateBeanDisplay();
  if (reason) showToast('🫘 +' + amount + '乐豆（' + reason + '）');
}

function updateBeanDisplay() {
  var wb = document.getElementById('walletBeans');
  if (wb) wb.textContent = userBeans.toLocaleString();
}

function openBeanExchange() {
  document.getElementById('beanExchangeOverlay').classList.add('show');
  pushNav('beanExchange');
  refreshBeanExchange();
}

function closeBeanExchange() {
  document.getElementById('beanExchangeOverlay').classList.remove('show');
}

var paymentBound = false, paymentBindType = '', paymentBindAccount = '', paymentBindPhone = '';

function refreshBeanExchange() {
  document.getElementById('beanExchangeBalance').textContent = userBeans + '乐豆';
  document.getElementById('beanExchangeCNY').textContent = '¥' + (userBeans / 10000).toFixed(2);
  updateWithdrawUI();
}

function updateWithdrawUI() {
  var bindArea = document.getElementById('bindPaymentArea');
  var withdrawArea = document.getElementById('withdrawArea');
  if (paymentBound) {
    if (bindArea) bindArea.style.display = 'none';
    if (withdrawArea) withdrawArea.style.display = 'flex';
    var info = document.getElementById('boundAccountInfo');
    if (info) info.textContent = (paymentBindType==='wechat'?'微信':'支付宝')+' '+paymentBindAccount;
  } else {
    if (bindArea) bindArea.style.display = 'block';
    if (withdrawArea) withdrawArea.style.display = 'none';
  }
}

function showBindPayment() {
  paymentBound = false;
  updateWithdrawUI();
}

function bindPaymentAccount() {
  var phone = document.getElementById('bindPhone').value.trim();
  var type = document.getElementById('bindType').value;
  var account = document.getElementById('bindAccount').value.trim();
  if (!phone) { showToast('请输入手机号'); return; }
  if (phone.length !== 11) { showToast('请输入正确的11位手机号'); return; }
  if (!account) { showToast('请输入微信/支付宝账号'); return; }
  paymentBound = true;
  paymentBindType = type;
  paymentBindAccount = account;
  paymentBindPhone = phone;
  updateWithdrawUI();
  showToast('✅ 已绑定'+ (type==='wechat'?'微信':'支付宝') +'：'+account);
}

function withdrawBeans(amount) {
  if (!paymentBound) { showToast('请先绑定提现账户'); return; }
  if (amount === 'all') amount = userBeans;
  if (!amount || amount <= 0) {
    amount = parseInt(prompt('输入提现乐豆数量（10000乐豆=¥1）:') || '0');
  }
  if (!amount || amount <= 0) return;
  if (amount < 10000) { showToast('最低提现10000乐豆（¥1.00）'); return; }
  if (amount > userBeans) { showToast('乐豆不足！当前仅' + userBeans + '乐豆'); return; }
  var yuan = (amount / 10000).toFixed(2);
  userBeans -= amount;
  updateBeanDisplay();
  refreshBeanExchange();
  showToast('✅ 提现申请已提交！¥'+yuan+' 将转入'+(paymentBindType==='wechat'?'微信':'支付宝')+' '+paymentBindAccount);
}

function updateWalletDisplay() {
  var wc = document.getElementById('walletCoins');
  if (wc) wc.textContent = userCoins.toLocaleString();
  var ww = document.getElementById('walletWorks');
  if (ww) ww.textContent = userWorks;
}

// ==================== DAILY CHECK-IN ====================
function dailyCheckin() {
  var today = new Date().toDateString();
  var lastCheckin = localStorage.getItem('lastCheckin');
  var streak = parseInt(localStorage.getItem('checkinStreak') || '0');

  if (lastCheckin === today) {
    showToast('✅ 今日已签到，连续' + streak + '天');
    return;
  }

  // Check if streak continues
  var yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastCheckin === yesterday) { streak++; } else { streak = 1; }

  localStorage.setItem('lastCheckin', today);
  localStorage.setItem('checkinStreak', streak);

  // Calculate reward
  var reward = 1;
  var bonus = 0;
  if (streak === 7) { bonus = 5; reward = 6; }

  userBeans += reward;
  updateBeanDisplay();
  updateCheckinUI();

  var msg = '✅ 签到成功！+'+reward+'乐豆（连续'+streak+'天）';
  if (bonus) msg += ' 🎉 连续7天额外+5！';
  showToast(msg);
}

function updateCheckinUI() {
  var today = new Date().toDateString();
  var lastCheckin = localStorage.getItem('lastCheckin');
  var streak = parseInt(localStorage.getItem('checkinStreak') || '0');
  var statusEl = document.getElementById('checkinStatus');
  var btnEl = document.getElementById('checkinBtn');

  if (lastCheckin === today) {
    if (statusEl) statusEl.textContent = '今日已签到 · 连续' + streak + '天 🔥';
    if (btnEl) btnEl.style.opacity = '0.65';
  } else {
    if (statusEl) statusEl.textContent = '签到赚乐豆，连续7天额外奖励';
    if (btnEl) btnEl.style.opacity = '1';
  }
}

function openRecharge() {
  pushNav('recharge');
  document.getElementById('rechargeModal').classList.add('show');
  updateBalance();
  updateWithdrawUI();
}

function closeRecharge() {
  document.getElementById('rechargeModal').classList.remove('show');
}

function updateBalance() {
  document.getElementById('rechargeBalance').textContent = '🪙 ' + userCoins + '乐币';
  var cnyEl = document.getElementById('rechargeBalanceCNY');
  if (cnyEl) cnyEl.textContent = (userCoins * 0.01).toFixed(2);
}

var pendingRecharge = 0;
function recharge(coins, price) {
  pendingRecharge = coins;
  document.getElementById('payTitle').textContent = '乐币充值';
  document.getElementById('payPrice').textContent = '¥'+price;
  document.getElementById('payDesc').textContent = coins+'乐币 · ¥'+price;
  document.getElementById('payMethods').style.display = 'flex';
  document.getElementById('payQR').style.display = 'none';
  document.getElementById('payCancel').style.display = 'block';
  document.getElementById('payCheckWechat').innerHTML = '';
  document.getElementById('payCheckAlipay').innerHTML = '';
  document.getElementById('payWechat').style.border = '1px solid var(--border)';
  document.getElementById('payAlipay').style.border = '1px solid var(--border)';
  document.getElementById('paymentModal').classList.add('show');
  pushNav('payment');
}

function confirmRechargePayment() {
  userCoins += pendingRecharge;
  pendingRecharge = 0;
  updateBalance();
  try { localStorage.setItem('userCoins', userCoins); } catch(e) {}
  showToast('✅ 充值成功！+'+userCoins+'乐币');
  var walletVal = document.querySelector('.wallet-card-value');
  if (walletVal) walletVal.textContent = userCoins.toLocaleString();
  closePayment();
}

// ==================== VIP SYSTEM ====================
var payTier = 'monthly';
var payMethod = '';

function openPayment(tier) {
  pendingRecharge = 0;
  payTier = tier;
  payMethod = '';
  var n = {monthly:'月卡',quarterly:'季卡',annual:'年卡'};
  var p = {monthly:'¥29',quarterly:'¥49.9',annual:'¥168'};
  var d = {monthly:'30首免费创作',quarterly:'100首免费创作',annual:'500首免费创作'};
  document.getElementById('payTitle').textContent = '选择支付方式';
  document.getElementById('payPrice').textContent = p[tier];
  document.getElementById('payDesc').textContent = n[tier]+' · '+d[tier];
  document.getElementById('payMethods').style.display = 'flex';
  document.getElementById('payQR').style.display = 'none';
  document.getElementById('payCancel').style.display = 'block';
  document.getElementById('payAdminBtn').style.display = 'none';
  document.getElementById('payCheckWechat').innerHTML = '';
  document.getElementById('payCheckAlipay').innerHTML = '';
  document.getElementById('payWechat').style.border = '1px solid var(--border)';
  document.getElementById('payAlipay').style.border = '1px solid var(--border)';
  document.getElementById('paymentModal').classList.add('show');
  pushNav('payment');
}

function selectPayMethod(method) {
  payMethod = method;
  document.getElementById('payCheckWechat').innerHTML = method==='wechat' ? '<div style="width:10px;height:10px;background:var(--accent);border-radius:50%"></div>' : '';
  document.getElementById('payCheckAlipay').innerHTML = method==='alipay' ? '<div style="width:10px;height:10px;background:var(--accent);border-radius:50%"></div>' : '';
  document.getElementById('payWechat').style.border = method==='wechat' ? '2px solid var(--accent)' : '1px solid var(--border)';
  document.getElementById('payAlipay').style.border = method==='alipay' ? '2px solid var(--accent)' : '1px solid var(--border)';
  // Show QR area
  document.getElementById('payTitle').textContent = method==='wechat' ? '微信支付' : '支付宝支付';
  document.getElementById('payMethods').style.display = 'none';
  document.getElementById('payQR').style.display = 'flex';
  document.getElementById('payCancel').style.display = 'none';
  document.getElementById('payQRAmount').textContent = '支付金额：'+document.getElementById('payPrice').textContent;
  // Show admin confirm button only for recharge, not VIP
  document.getElementById('payAdminBtn').style.display = pendingRecharge > 0 ? 'block' : 'none';
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('show');
}

function buyVip() { openPayment('monthly'); }

// Only for testing/admin: activate VIP directly
function adminActivateVip(tier) {
  buyVipTier(tier);
  closePayment();
  closeVipPopup();
}

function buyVipTier(tier) {
  isVip = true; vipTier = tier; freeSongsLeft = VIP_QUOTAS[tier];
  try {
    localStorage.setItem('isVip','1');
    localStorage.setItem('vipTier', tier);
    localStorage.setItem('freeSongsLeft', freeSongsLeft);
  } catch(e) {}
  updateVipUI();
  var n = {monthly:'月卡',quarterly:'季卡',annual:'年卡'};
  showToast('👑 VIP '+n[tier]+'已开通！'+freeSongsLeft+'首免费创作');
}

function resetVip() {
  isVip = false; vipTier = 'none'; freeSongsLeft = 0;
  try { localStorage.removeItem('isVip'); localStorage.removeItem('vipTier'); localStorage.removeItem('freeSongsLeft'); } catch(e) {}
  updateVipUI();
  showToast('已退出VIP，恢复为新用户状态');
}

function showVipPopup() {
  document.getElementById('vipPopup').classList.add('show');
  pushNav('vipPopup');
}
function closeVipPopup() { document.getElementById('vipPopup').classList.remove('show'); }

function showVipPrompt(title, desc) {
  if (title) document.getElementById('vipPromptTitle').textContent = title;
  if (desc) document.getElementById('vipPromptDesc').textContent = desc;
  document.getElementById('vipUpgradePrompt').classList.add('show');
  pushNav('vipPrompt');
}
function closeVipPrompt() {
  document.getElementById('vipUpgradePrompt').classList.remove('show');
}

function vipRequired(title, desc) {
  if (isVip) return false;
  showVipPrompt(title || 'VIP专属功能', desc || '开通VIP会员即可解锁');
  return true;
}

function updateVipUI() {
  var costEl = document.getElementById('btnGenCost');
  if (costEl) {
    if (isVip && freeSongsLeft > 0) costEl.textContent = 'VIP免费('+freeSongsLeft+'首)';
    else if (isVip) costEl.textContent = 'VIP额度用完·充乐币';
    else costEl.textContent = '消耗300乐币';
  }
  var badge = document.querySelector('.profile-badges');
  if (badge) {
    var t = {monthly:'月卡',quarterly:'季卡',annual:'年卡'};
    badge.innerHTML = isVip ? '<span class="profile-badge">👑 VIP '+ (t[vipTier]||'') +'</span>' : '<span class="profile-badge">🎵 新晋用户</span>';
  }
  var resetArea = document.getElementById('vipResetArea');
  if (resetArea) resetArea.style.display = isVip ? 'block' : 'none';
  ['monthly','quarterly','annual'].forEach(function(k){
    var btn = document.getElementById('vipBtn'+k.charAt(0).toUpperCase()+k.slice(1));
    if (!btn) return;
    if (isVip && vipTier === k) { btn.textContent = '已开通 ✅'; btn.style.opacity = '0.6'; btn.onclick = function(){ showToast('👑 您已是VIP '+({monthly:'月卡',quarterly:'季卡',annual:'年卡'}[k])+'会员，剩余'+freeSongsLeft+'首免费创作'); }; }
    else { btn.textContent = isVip ? '升级' : '开通'; btn.style.opacity = '1'; btn.onclick = function(){ openPayment(k); }; }
  });
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  stopPlayback();
});

// ==================== GENERIC PANEL ====================
function openMusicianCenter() {
  openPanel('🎵 音乐人中心',
    '<div class=settings-about-text style=font-size:13px>'+
    '<p><b>认证音乐人</b></p>'+
    '<p>🏆 创作达人 · 累计发布 0 首原创</p>'+
    '<p>🎧 总播放量 0 · 获赞 0</p>'+
    '<p>📀 收入 0 乐币</p>'+
    '<p style=margin-top:8px;color:var(--accent)>发布作品即可解锁更多数据</p>'+
    '</div>'+
    '<button class=settings-btn primary id=btnApplyVerify style=width:100%>申请认证</button>'
  );
  setTimeout(function(){
    var b = document.getElementById('btnApplyVerify');
    if (b) b.onclick = function(){ showToast('申请已提交'); };
  }, 50);
}

function openPanel(title, html) {
  document.getElementById('panelTitle').textContent = title;
  document.getElementById('panelBody').innerHTML = html;
  document.getElementById('panelOverlay').classList.add('show');
  pushNav('panel');
}
function closePanel() {
  document.getElementById('panelOverlay').classList.remove('show');
}
function showCreatePanel(type) {
  if (type === 'mv' && vipRequired('🎬 生成MV', 'AI自动为歌曲生成精美MV画面')) return;
  if (type === 'publish' && vipRequired('🌐 全网发行', '一键发布作品到各大音乐平台')) return;
  if (type === 'copyright' && vipRequired('🛡️ 原创保护', '区块链版权存证+侵权监测')) return;
  var t, h;
  if (type === 'mv') {
    t = '🎬 生成MV';
    h = '<div class=settings-input-group><label>选择画面风格</label><div style=display:grid;grid-template-columns:1fr 1fr;gap:8px>'
      + ['唯美清新','赛博朋克','复古胶片','手绘动画','科幻大片','水墨国风'].map(function(s){return '<div class=opt-chip onclick="showToast(\'已选择:'+s+'\')" style=text-align:center>'+s+'</div>'}).join('')
      + '</div></div><button class=settings-btn primary onclick="showToast(\'MV生成中...\')" style=width:100%>开始生成MV</button>';
  } else if (type === 'earn') {
    t = '💰 每日赚钱';
    h = (function(){
      var items = [{icon:'🎧',title:'每日听歌',desc:'听满30分钟',reward:'+5豆'},{icon:'❤️',title:'每日点赞',desc:'点赞10首歌',reward:'+3豆'},{icon:'💬',title:'每日评论',desc:'发表5条评论',reward:'+3豆'},{icon:'📤',title:'分享歌曲',desc:'分享3首歌',reward:'+5豆'},{icon:'🎵',title:'发布作品',desc:'发布1首原创',reward:'+10豆'}];
      return '<div style=display:flex;flex-direction:column;gap:10px>' + items.map(function(x){return '<div style=background:var(--card);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;border:1px solid var(--border)><div style=font-size:28px>'+x.icon+'</div><div style=flex:1><div style=font-weight:600>'+x.title+'</div><div style=font-size:11px;color:var(--text3)>'+x.desc+'</div></div><div style=color:var(--accent);font-weight:700>'+x.reward+'</div></div>'}).join('') + '</div>';
    })();
  } else if (type === 'collab') {
    t = '💬 互动成歌';
    h = '<div class=settings-about-text style=font-size:13px><p><b>和朋友一起创作</b></p><p>邀请好友加入创作房间，共同编写歌词、选择编曲风格。多人协作模式下，每个人都可以实时看到修改。</p><p style=margin-top:8px><b>使用步骤：</b></p><p>1. 点击「创建房间」生成邀请链接</p><p>2. 分享链接给好友</p><p>3. 一起在线创作</p></div><button class=settings-btn primary onclick="showToast(\'链接已复制\')" style=width:100%>创建协作房间</button>';
  } else if (type === 'pic2song') {
    t = '🖼 图片成歌';
    h = '<div class=settings-input-group><label>上传一张图片</label><div style=width:100%;height:180px;background:var(--card);border-radius:14px;display:flex;align-items:center;justify-content:center;border:2px dashed var(--border);cursor:pointer;font-size:48px onclick="showToast(\'请从相册选择\')">📷</div><div style=font-size:11px;color:var(--text3);text-align:center;margin-top:8px>AI根据图片生成匹配音乐</div></div><button class=settings-btn primary onclick="showToast(\'图片解析中...\')" style=width:100%>开始分析生成</button>';
  } else if (type === 'publish') {
    t = '🌐 全网发行';
    h = '<div class=settings-about-text style=font-size:13px><p><b>一键发布到各大平台</b></p><p>同步发布至：网易云音乐、QQ音乐、酷狗音乐、抖音、Spotify、Apple Music</p><p style=margin-top:8px;color:var(--accent)>👑 VIP会员享有一键全网发行权益</p></div><button class=settings-btn primary onclick="showToast(\'发行申请已提交\')" style=width:100%>提交发行申请</button>';
  } else if (type === 'copyright') {
    t = '🛡️ 原创保护';
    h = '<div class=settings-about-text style=font-size:13px><p><b>区块链版权存证</b></p><p>每首原创作品自动上链存证。</p><p><b>保护内容：</b>旋律指纹、歌词检测、时间戳存证、侵权监测、自动维权</p><p style=margin-top:8px;color:var(--accent)>所有用户自动享有基础保护</p></div><button class=settings-btn primary onclick="showToast(\'版权保护已开启\')" style=width:100%>查看我的版权</button>';
  }
  openPanel(t, h);
}
function showProfilePanel(type) {
  var t, h;
  if (type === 'works') {
    t = '📀 我的作品';
    h = '<div style=text-align:center;padding:40px 20px><div style=font-size:48px>🎵</div><div style=font-size:14px;color:var(--text2);margin-top:12px>还没有作品</div><div style=font-size:12px;color:var(--text3);margin-top:4px>开始创作你的第一首歌吧</div></div>';
  } else if (type === 'drafts') {
    t = '📝 草稿箱';
    h = '<div style=text-align:center;padding:40px 20px><div style=font-size:48px>📝</div><div style=font-size:14px;color:var(--text2);margin-top:12px>草稿箱是空的</div><div style=font-size:12px;color:var(--text3);margin-top:4px>开始创作你的第一首歌吧</div></div>';
  } else if (type === 'albums') {
    t = '💿 我的专辑';
    h = '<div style=text-align:center;padding:40px 20px><div style=font-size:48px>💿</div><div style=font-size:14px;color:var(--text2);margin-top:12px>还没有专辑</div><div style=font-size:12px;color:var(--text3);margin-top:4px>整理你的作品，创建第一张专辑</div></div>';
  } else if (type === 'likes') {
    t = '❤️ 我喜欢的';
    h = '<div style=display:flex;flex-direction:column;gap:10px>' +
      [{title:'春日晚风',artist:'花开半夏',time:'03:42'},{title:'雨中曲',artist:'一只叔片',time:'05:10'},{title:'月光漫步',artist:'鹿先森',time:'04:33'}]
      .map(function(s){return '<div style=background:var(--card);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;border:1px solid var(--border)><div style=font-size:24px>❤️</div><div style=flex:1><div style=font-weight:600>'+s.title+'</div><div style=font-size:11px;color:var(--text3)>'+s.artist+' · '+s.time+'</div></div><div style=font-size:20px;cursor:pointer onclick="showToast(\'播放:'+s.title+'\')">▶</div></div>'}).join('') +
      '</div>';
  }
  openPanel(t, h);
}

// ==================== SETTINGS ====================
function openSettings() {
  pushNav('settings');
  document.getElementById('settingsOverlay').classList.add('show');
  showSettingsPanel('main');
  // Estimate cache size
  try { document.getElementById('cacheSize').textContent = (JSON.stringify(localStorage).length / 1024).toFixed(1) + 'KB'; } catch(e) {}
}
function closeSettings() { document.getElementById('settingsOverlay').classList.remove('show'); }
function settingsBack() {
  const main = document.getElementById('settingsMain');
  if (main.classList.contains('show')) { closeSettings(); return; }
  showSettingsPanel('main');
}
function showSettingsPanel(name) {
  document.querySelectorAll('#settingsOverlay .settings-panel').forEach(p => p.classList.remove('show'));
  const panelIds = {main:'settingsMain',profile:'settingsProfile',verify:'settingsVerify',personalize:'settingsPersonalize',about:'settingsAbout',help:'settingsHelp',deleteAccount:'settingsDelete'};
  const el = document.getElementById(panelIds[name] || 'settingsMain');
  if (el) el.classList.add('show');
  document.getElementById('settingsTitle').textContent = name === 'main' ? '设置' :
    {profile:'个人资料',verify:'实名认证',personalize:'个性化服务',about:'关于我们',help:'帮助与服务',deleteAccount:'注销账号'}[name] || '设置';
}
function toggleSwitch(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.toggle('on'); try { localStorage.setItem('tgl_'+id, el.classList.contains('on')?'1':'0'); } catch(e) {} }
}
// Load toggle states on init
(function(){ ['tglRec','tglDark','tglAuto','tglNotif','tglData'].forEach(function(id){ try { if(localStorage.getItem('tgl_'+id)==='0') document.getElementById(id).classList.remove('on'); } catch(e) {} }); })();
function clearCache() {
  const size = document.getElementById('cacheSize');
  localStorage.clear();
  sessionStorage.clear();
  if (size) size.textContent = '0KB';
  showToast('✅ 缓存已清除');
}
function saveProfile() {
  const nick = document.getElementById('setNickname').value;
  const bio = document.getElementById('setBio').value;
  try { localStorage.setItem('profile_nick', nick); localStorage.setItem('profile_bio', bio); } catch(e) {}
  showToast('✅ 资料已保存');
}
function submitVerify() {
  if (!localStorage.getItem('regPhone')) {
    phoneVerifyCallback = function(){ submitVerify(); };
    document.getElementById('phoneVerifyModal').style.display = 'flex';
    return;
  }
  const name = document.getElementById('verifyName').value;
  const id = document.getElementById('verifyId').value;
  const phone = document.getElementById('verifyPhone').value;
  if (!name || !id || !phone) { showToast('请填写完整信息'); return; }
  document.getElementById('verifyStatus').textContent = '已认证';
  showToast('✅ 实名认证提交成功');
  showSettingsPanel('main');
}
function deleteAccount() {
  localStorage.clear();
  sessionStorage.clear();
  closeSettings();
  showToast('账号已注销');
  setTimeout(function(){ window.location.reload(); }, 1500);
}

var regCodeTimer = null, regCodeCountdown = 0;
function sendRegCode() {
  var phone = document.getElementById('regPhoneInput').value.trim();
  if (!phone || phone.length !== 11) { showToast('请输入正确的11位手机号'); return; }
  if (regCodeCountdown > 0) return;
  regCodeCountdown = 60;
  var btn = document.getElementById('regSendCodeBtn');
  btn.disabled = true; btn.style.opacity = '0.6';
  regCodeTimer = setInterval(function(){
    regCodeCountdown--;
    btn.textContent = regCodeCountdown + 's';
    if (regCodeCountdown <= 0) {
      clearInterval(regCodeTimer);
      btn.textContent = '获取验证码';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }, 1000);
  showToast('📱 验证码已发送');
}

function verifyRegPhone() {
  var phone = document.getElementById('regPhoneInput').value.trim();
  var code = document.getElementById('regCodeInput').value.trim();
  if (!phone || phone.length !== 11) { showToast('请输入正确的11位手机号'); return; }
  if (!code) { showToast('请输入验证码'); return; }
  try { localStorage.setItem('regPhone', phone); } catch(e) {}
  document.getElementById('phoneVerifyModal').style.display = 'none';
  showToast('✅ 验证成功！');
  // Resume pending action
  if (phoneVerifyCallback) { var cb = phoneVerifyCallback; phoneVerifyCallback = null; cb(); }
}

var phoneVerifyCallback = null;
function requirePhone(callback) {
  if (localStorage.getItem('regPhone')) {
    return true;
  }
  phoneVerifyCallback = callback || null;
  document.getElementById('phoneVerifyModal').style.display = 'flex';
  return false;
}
function toggleFaq(el) { el.classList.toggle('open'); }
function previewAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    document.getElementById('avatarPreview').innerHTML = '<img src="'+ev.target.result+'" style="width:100%;height:100%;object-fit:cover">';
    try { localStorage.setItem('avatar', ev.target.result); } catch(ex) {}
  };
  reader.readAsDataURL(file);
}
// Load saved avatar on startup
(function(){ try { var a=localStorage.getItem('avatar'); if(a) document.getElementById('avatarPreview').innerHTML='<img src="'+a+'" style="width:100%;height:100%;object-fit:cover">'; }catch(e){} })();

// ==================== STARTUP ====================
try { init(); } catch(e) { alert('JS ERROR: ' + e.message + ' at line ' + (e.lineNumber || '?')); console.error(e); }
