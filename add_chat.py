with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find renderArtistSection's closing }
marker = 'function renderArtistSection()'
idx = content.find(marker)
if idx < 0: print('NOT FOUND'); exit(1)
brace_start = content.index('{', idx)
bc = 0; end_idx = brace_start
for i in range(brace_start, len(content)):
    if content[i] == '{': bc += 1
    elif content[i] == '}':
        bc -= 1
        if bc == 0: end_idx = i + 1; break

# Also update the onclick from toast to openArtistChat
# Find: onclick=\"showToast(' + \"'💬 聊天功能即将上线'\" + ')\"
old_click = """onclick=\"showToast(' + \"'💬 聊天功能即将上线'\" + ')\""""
new_click = """onclick=\"openArtistChat('+a.id+')\""""
if old_click in content:
    content = content.replace(old_click, new_click)
    print('Fixed onclick')

chat_code = """

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
    return '<div style=\"display:flex;'+(isMe?'justify-content:flex-end':'')+';margin-bottom:10px\">'+
      '<div style=\"max-width:75%;padding:10px 14px;border-radius:16px;'+(isMe?
        'background:var(--accent);color:#000;border-bottom-right-radius:4px':
        'background:var(--card);color:var(--text);border-bottom-left-radius:4px')+
      ';font-size:13px;line-height:1.5\">'+
        (m.type==='image' ? '<div style=\"font-size:40px;text-align:center\">🖼</div><div style=\"font-size:10px;text-align:center;margin-top:4px\">[图片]</div>' : '')+
        (m.type==='file' ? '<div style=\"font-size:32px;text-align:center\">📄</div><div style=\"font-size:10px;text-align:center;margin-top:4px\">['+m.fileName+']</div>' : '')+
        (m.text||'')+
      '<div style=\"font-size:10px;margin-top:4px;opacity:0.6;text-align:right\">'+m.time+'</div>'+
      '</div></div>';
  }).join('');
  if (msgs.length === 0) msgHTML = '<div style=\"text-align:center;color:var(--text3);padding:40px\">打个招呼吧 👋</div>';

  var html = '<div style=\"display:flex;flex-direction:column;height:100%\">'+
    '<div style=\"display:flex;align-items:center;gap:10px;padding:4px 0 10px;border-bottom:1px solid var(--border);margin-bottom:10px\">'+
      '<div class=\"circle-post-avatar\" style=\"background:'+gradients[a.grad]+';position:relative;width:36px;height:36px;font-size:18px\">'+a.avatar+
        (a.online?'<div style=\"position:absolute;bottom:0;right:0;width:8px;height:8px;background:#2ecc71;border-radius:50%;border:2px solid var(--bg)\"></div>':'')+
      '</div>'+
      '<div><div style=\"font-weight:700;font-size:14px\">'+a.name+'</div><div style=\"font-size:11px;color:'+(a.online?'#2ecc71':'var(--text3)')+'\">'+(a.online?'在线':'离线')+'</div></div>'+
    '</div>'+
    '<div id=\"chatMsgs\" style=\"flex:1;overflow-y:auto;padding-right:4px;min-height:200px\">'+msgHTML+'</div>'+
    '<div style=\"display:flex;gap:6px;padding-top:10px;border-top:1px solid var(--border);margin-top:8px\">'+
      '<button onclick=\"sendChatMedia(' + \"'image'\" + ')\" style=\"padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:18px;cursor:pointer;flex-shrink:0\">🖼</button>'+
      '<button onclick=\"sendChatMedia(' + \"'file'\" + ')\" style=\"padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:18px;cursor:pointer;flex-shrink:0\">📎</button>'+
      '<input type=\"text\" id=\"chatInput\" placeholder=\"输入消息...\" onkeydown=\"if(event.key===' + \"'Enter'\" + ')sendChatMsg()\" style=\"flex:1;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;min-width:0\">'+
      '<button onclick=\"sendChatMsg()\" style=\"padding:10px 16px;border-radius:10px;border:none;background:var(--accent);color:#000;font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0\">发送</button>'+
    '</div>'+
  '</div>';
  openPanel('💬 '+a.name, html);
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
  openArtistChat(chatPartner.id);
  setTimeout(function(){
    var replies = ['👍 收到！','哈哈 😄','说得太好了','继续聊~','有新作品记得分享','🎵 音乐无界'];
    var reply = replies[Math.floor(Math.random()*replies.length)];
    var rt = new Date();
    var rtime = rt.getHours().toString().padStart(2,'0')+':'+rt.getMinutes().toString().padStart(2,'0');
    chatData[chatPartner.id].push({from:'them',text:reply,time:rtime});
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
"""

content = content[:end_idx] + chat_code + content[end_idx:]

with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(content)
print(f'Done: {len(content)} bytes')
