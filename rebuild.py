with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# 1. Square tab: artist -> circle
old = "switchSquareTab('artist',this)\">👑 音乐人<"
new = "switchSquareTab('circle',this)\">🎵 音乐圈<"
if old in content:
    content = content.replace(old, new); changes += 1; print('1 ok')

# 2. squareArtist -> squareCircle
old2 = 'id="squareArtist" style="display:none"></div>\n      <div class="square-content" id="squareGroup"'
new2 = 'id="squareCircle" style="display:none"></div>\n      <div class="square-content" id="squareGroup"'
if old2 in content:
    content = content.replace(old2, new2); changes += 1; print('2 ok')

# 3. switchSquareTab
old3 = """function switchSquareTab(type, btn) {
  document.querySelectorAll('.square-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  ['squareHot','squareNew','squareArtist','squareGroup'].forEach(id=>{
    document.getElementById(id).style.display='none';
  });
  const map = {hot:'squareHot',new:'squareNew',artist:'squareArtist',group:'squareGroup'};
  const el = document.getElementById(map[type]);
  if (el) el.style.display='block';
}"""
new3 = """function switchSquareTab(type, btn) {
  document.querySelectorAll('.square-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  ['squareHot','squareNew','squareCircle','squareGroup'].forEach(id=>{
    document.getElementById(id).style.display='none';
  });
  const map = {hot:'squareHot',new:'squareNew',circle:'squareCircle',group:'squareGroup'};
  const el = document.getElementById(map[type]);
  if (el) el.style.display='block';
  if (type === 'circle') renderMusicCircleToSquare();
}"""
if old3 in content:
    content = content.replace(old3, new3); changes += 1; print('3 ok')

# 4. Remove artist from renderSquare
old4 = """  const artists = [
    {name:'一只叔片',avatar:'🦞',fans:'12.8k',songs:32,grad:0},{name:'花开半夏',avatar:'🌸',fans:'8.6k',songs:18,grad:2},
    {name:'深夜旅人',avatar:'🌙',fans:'6.2k',songs:24,grad:3},{name:'追梦人',avatar:'🔥',fans:'5.1k',songs:15,grad:1},
    {name:'墨染青衣',avatar:'🖌',fans:'4.8k',songs:20,grad:5},{name:'电音小子',avatar:'⚡',fans:'3.9k',songs:12,grad:6},
  ];
  document.getElementById('squareArtist').innerHTML = '<div class=\"square-artist-grid\">'+artists.map(a=>`
    <div class=\"square-artist-card\">
      <div class=\"square-artist-avatar\" style=\"background:${gradients[a.grad]}\">${a.avatar}</div>
      <div class=\"square-artist-info\">
        <div class=\"square-artist-name\">${a.name}</div>
        <div class=\"square-artist-fans\">👥 ${a.fans} · 🎵 ${a.songs}首</div>
      </div>
    </div>
  `).join('')+'</div>';

  // Groups - NOW PROMINENT in its own tab"""
new4 = "  // Groups - NOW PROMINENT in its own tab"
if old4 in content:
    content = content.replace(old4, new4); changes += 1; print('4 ok')

# 5. Home page: musicCircle -> artistSection
old5 = """      <!-- 音乐圈 -->
      <div class="music-circle" id="musicCircle">
        <div class="circle-header">
          <span class="circle-header-title">🎵 音乐圈</span>
          <button class="circle-post-btn" onclick="postToCircle()">+ 发布</button>
        </div>
        <div class="circle-feed" id="circleFeed"></div>
      </div>"""
new5 = """      <!-- 音乐人 -->
      <div class="music-circle" id="artistSection">
        <div class="circle-header">
          <span class="circle-header-title">👑 音乐人</span>
        </div>
        <div class="circle-feed" id="artistList"></div>
      </div>"""
if old5 in content:
    content = content.replace(old5, new5); changes += 1; print('5 ok')

# 6. renderHome call
old6 = "  // Music circle - always render\n  renderMusicCircle();"
new6 = "  // Artist section\n  renderArtistSection();"
if old6 in content:
    content = content.replace(old6, new6); changes += 1; print('6 ok')

# 7. CSS
old7 = "#page-home.active .music-circle { flex: 1; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; }"
new7 = old7 + "\n#page-home.active #artistSection { display: flex; }"
if old7 in content:
    content = content.replace(old7, new7); changes += 1; print('7 ok')

# 8. Insert renderMusicCircleToSquare + artist section data
marker = "function postToCircle() {"
idx = content.find(marker)
if idx < 0:
    print('ERROR'); exit(1)

brace_start = content.index('{', idx)
bc = 0; end_idx = brace_start
for i in range(brace_start, len(content)):
    if content[i] == '{': bc += 1
    elif content[i] == '}':
        bc -= 1
        if bc == 0: end_idx = i + 1; break

new_code = """

function renderMusicCircleToSquare() {
  var el = document.getElementById('squareCircle');
  if (!el) return;
  el.style.padding = '0';
  var feedHTML = '<div class=\"circle-feed\" style=\"padding-top:8px\">' + circlePosts.map(function(p){
    var mediaHTML = '';
    if (p.media && p.media.length > 0) {
      var gridClass = p.media.length === 1 ? 'single' : p.media.length === 2 ? 'double' : 'triple';
      mediaHTML = '<div class=\"circle-post-media '+gridClass+'\">' + p.media.map(function(m){
        if (m.type === 'video') {
          return '<div class=\"circle-post-video\" style=\"background:'+m.bg+'\" onclick=\"event.stopPropagation();openCircleDetail('+p.id+')\"><span style=\"font-size:40px\">'+m.emoji+'</span></div>';
        }
        return '<div class=\"circle-post-img\" style=\"background:'+m.bg+'\" onclick=\"event.stopPropagation();openCircleDetail('+p.id+')\">'+m.emoji+'</div>';
      }).join('') + '</div>';
    }
    return '<div class=\"circle-post\" onclick=\"openCircleDetail('+p.id+')\">'+
      '<div class=\"circle-post-header\">'+
        '<div class=\"circle-post-avatar\" style=\"background:linear-gradient(135deg,'+['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe','#a18cd1,#fbc2eb','#ff9a9e,#fecfef','#fa709a,#fee140'][p.id%6]+')\">'+p.avatar+'</div>'+
        '<div style=\"flex:1\">'+
          '<div class=\"circle-post-name\">'+p.user+'<span class=\"circle-level lv'+p.level+'\">'+p.levelName+'</span></div>'+
          '<div class=\"circle-post-time\">'+p.time+'</div>'+
        '</div>'+
      '</div>'+
      (p.text ? '<div class=\"circle-post-text\">'+p.text+'</div>' : '')+
      mediaHTML +
      '<div class=\"circle-post-actions\" onclick=\"event.stopPropagation()\">'+
        '<button class=\"circle-action '+ (p.liked?'liked':'') +'\" id=\"circleLike'+p.id+'\" onclick=\"likeCirclePost('+p.id+')\">'+ (p.liked?'❤️':'🤍') +' <span>'+p.likes+'</span></button>'+
        '<button class=\"circle-action\" onclick=\"showToast(' + \"'💬 评论功能即将开放'\" + ')\">💬 <span>'+p.comments+'</span></button>'+
        '<button class=\"circle-action\" onclick=\"showToast(' + \"'📤 已分享'\" + ')\">↗ 分享</button>'+
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
    return '<div class=\"circle-post\" onclick=\"showToast(' + \"'💬 聊天功能即将上线'\" + ')\" style=\"cursor:pointer\">'+
      '<div class=\"circle-post-header\">'+
        '<div class=\"circle-post-avatar\" style=\"background:'+gradients[a.grad]+';position:relative\">'+a.avatar+
          (a.online ? '<div style=\"position:absolute;bottom:0;right:0;width:10px;height:10px;background:#2ecc71;border-radius:50%;border:2px solid var(--bg)\"></div>' : '')+
        '</div>'+
        '<div style=\"flex:1\">'+
          '<div class=\"circle-post-name\">'+a.name+'<span class=\"circle-level lv'+a.level+'\">'+a.levelName+'</span></div>'+
          '<div class=\"circle-post-time\">'+a.bio+'</div>'+
        '</div>'+
        '<div style=\"text-align:right;font-size:11px;color:var(--text3);flex-shrink:0\">'+
          '<div>👥 '+a.fans+'</div><div>🎵 '+a.songs+'首</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}
"""

content = content[:end_idx] + new_code + content[end_idx:]; changes += 1; print('8 ok')

with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print(f'Done: {changes} changes, {len(content)} bytes')
