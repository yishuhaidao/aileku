import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point after renderMusicCircle(); call
old = '''  renderMusicCircle();
}
function updateHero() {'''

new_code = '''

// ==================== MUSIC CIRCLE ====================
var circlePosts = [
  {id:1,user:'花开半夏',avatar:'🌸',time:'2分钟前',text:'刚用AI写了首新歌《春日晚风》，大家听听看！🎵',media:[
    {type:'image',bg:'linear-gradient(135deg,#667eea,#764ba2)',emoji:'🌸'},
  ],likes:128,comments:32,liked:false},
  {id:2,user:'深夜旅人',avatar:'🌙',time:'18分钟前',text:'城市霓虹下的孤独，送给每一个夜归人 🌃',media:[
    {type:'image',bg:'linear-gradient(135deg,#f093fb,#f5576c)',emoji:'🌃'},
    {type:'image',bg:'linear-gradient(135deg,#4facfe,#00f2fe)',emoji:'🌊'},
  ],likes:256,comments:58,liked:false},
  {id:3,user:'墨染青衣',avatar:'🎨',time:'32分钟前',text:'雨中曲MV拍摄花絮，雨天的录音棚最有感觉 ☔',media:[
    {type:'video',bg:'linear-gradient(135deg,#2d1b69,#1a1a3e)',emoji:'🎬'},
  ],likes:89,comments:15,liked:false},
  {id:4,user:'星河旅人',avatar:'✨',time:'1小时前',text:'今天在广场弹唱，路人小姐姐即兴合唱，音乐的力量！🎸',media:[
    {type:'image',bg:'linear-gradient(135deg,#a18cd1,#fbc2eb)',emoji:'🎸'},
    {type:'image',bg:'linear-gradient(135deg,#ffecd2,#fcb69f)',emoji:'🎤'},
    {type:'image',bg:'linear-gradient(135deg,#ff9a9e,#fecfef)',emoji:'❤️'},
  ],likes:432,comments:87,liked:false},
  {id:5,user:'音乐制作人Leo',avatar:'🎧',time:'2小时前',text:'分享一波录音棚日常：新设备到位，音质起飞！下周发新歌🔥',media:[],likes:168,comments:41,liked:false},
  {id:6,user:'晴天娃娃',avatar:'☀️',time:'3小时前',text:'用Ai乐酷生成的《星海漫步》被朋友夸了！这AI太强了吧 🤯',media:[
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
          return '<div class="circle-post-video" style="background:'+m.bg+'" onclick="showToast(\\'🎬 播放视频: '+p.user+'的作品\\')"><span style="font-size:40px">'+m.emoji+'</span></div>';
        }
        return '<div class="circle-post-img" style="background:'+m.bg+'" onclick="showToast(\\'📷 查看图片: '+p.user+'的分享\\')">'+m.emoji+'</div>';
      }).join('') + '</div>';
    }
    return '<div class="circle-post">'+
      '<div class="circle-post-header">'+
        '<div class="circle-post-avatar" style="background:linear-gradient(135deg,'+['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe','#a18cd1,#fbc2eb','#ff9a9e,#fecfef','#fa709a,#fee140'][p.id%6]+')">'+p.avatar+'</div>'+
        '<div style="flex:1">'+
          '<div class="circle-post-name">'+p.user+'</div>'+
          '<div class="circle-post-time">'+p.time+'</div>'+
        '</div>'+
      '</div>'+
      (p.text ? '<div class="circle-post-text">'+p.text+'</div>' : '')+
      mediaHTML +
      '<div class="circle-post-actions">'+
        '<button class="circle-action '+ (p.liked?'liked':'') +'" id="circleLike'+p.id+'" onclick="likeCirclePost('+p.id+')">'+ (p.liked?'❤️':'🤍') +' <span>'+p.likes+'</span></button>'+
        '<button class="circle-action" onclick="showToast(\\'💬 评论功能即将开放\\')">💬 <span>'+p.comments+'</span></button>'+
        '<button class="circle-action" onclick="showToast(\\'📤 已分享\\')">↗ 分享</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function likeCirclePost(id) {
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

function postToCircle() {
  showToast('📝 发布功能即将上线，敬请期待！');
}

function updateHero() {'''

if old in content:
    content = content.replace(old, new_code)
    with open('index.html', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print("OK")
else:
    # Try to find the specific text
    idx = content.find('renderMusicCircle();')
    if idx >= 0:
        print(f"Found at {idx}, context: ...{repr(content[idx:idx+80])}...")
    else:
        print("renderMusicCircle() NOT FOUND in file")
