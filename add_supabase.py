"""Add Supabase backend integration to Ai乐酷"""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Supabase CDN before </head>
supabase_cdn = '\n  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n</head>'
content = content.replace('</head>', supabase_cdn)

# 2. Add auth UI HTML after splash screen, before app-container
auth_html = '''
<!-- ===== AUTH MODAL ===== -->
<div class="auth-overlay" id="authOverlay">
  <div class="auth-card">
    <div class="auth-logo">🎵</div>
    <div class="auth-title" id="authTitle">登录 Ai乐酷</div>
    <div class="auth-desc" id="authDesc">同步你的作品和数据到云端</div>
    <input type="email" id="authEmail" class="auth-input" placeholder="邮箱">
    <input type="password" id="authPassword" class="auth-input" placeholder="密码">
    <button class="auth-btn" id="authSubmitBtn" onclick="handleAuth()">登录</button>
    <div class="auth-switch">
      <span id="authSwitchText">没有账号？</span>
      <a href="#" onclick="toggleAuthMode()" id="authSwitchLink">注册</a>
    </div>
    <a href="#" class="auth-skip" onclick="skipAuth()">跳过，离线使用</a>
    <div class="auth-error" id="authError"></div>
  </div>
</div>

'''

# Insert after splash screen (after </div> closing splash)
splash_end = '<!-- ===== SPLASH SCREEN ===== -->'
splash_div_end = content.index(splash_end)
# Find the closing </div> of the splash
search_from = splash_div_end
end_div = content.index('</div>', search_from) + 6
# After the splash screen's closing div, before <div class="app-container"
content = content[:end_div] + auth_html + content[end_div:]

# 3. Add auth CSS before </style>
auth_css = '''
/* ===== AUTH ===== */
.auth-overlay {
  position: fixed; inset: 0; z-index: 9990;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.auth-overlay.hidden { display: none; }
.auth-card {
  background: var(--bg); border-radius: 20px; padding: 32px 24px;
  width: 90%; max-width: 360px; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border: 1px solid var(--border);
}
.auth-logo { font-size: 48px; margin-bottom: 12px; }
.auth-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
.auth-desc { font-size: 12px; color: var(--text3); margin-bottom: 20px; }
.auth-input {
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--card);
  color: var(--text); font-size: 14px; margin-bottom: 10px;
  outline: none; box-sizing: border-box;
}
.auth-input:focus { border-color: var(--accent); }
.auth-btn {
  width: 100%; padding: 12px; border-radius: 12px; border: none;
  background: var(--accent); color: #000; font-size: 15px;
  font-weight: 700; cursor: pointer; margin-top: 6px;
}
.auth-btn:active { opacity: 0.8; }
.auth-switch { font-size: 12px; color: var(--text3); margin-top: 14px; }
.auth-switch a { color: var(--accent); text-decoration: none; }
.auth-skip { display: block; font-size: 12px; color: var(--text3); margin-top: 10px; text-decoration: none; }
.auth-error { color: var(--red); font-size: 12px; margin-top: 8px; min-height: 18px; }
'''

content = content.replace('</style>', auth_css + '\n</style>')

# 4. Add Supabase init and auth functions - insert before the STARTUP section
# Find the existing var songs or right before init()
supabase_js = '''
// ==================== SUPABASE BACKEND ====================
var SUPABASE_URL = 'https://vrfadiaqfissptfxwtex.supabase.co';
var SUPABASE_KEY = 'sb_publishable_8IOOiPXMEvg64PYVjKIfuQ_XO-OL06y';
var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
var authMode = 'login'; // 'login' or 'register'
var currentUser = null;

// Show auth UI after splash
setTimeout(function(){
  // Check if already logged in
  supabase.auth.getSession().then(function(res){
    if (res.data.session) {
      currentUser = res.data.session.user;
      document.getElementById('authOverlay').classList.add('hidden');
    } else {
      document.getElementById('authOverlay').classList.remove('hidden');
    }
  });
}, 5200); // after splash fades out (5s)

function handleAuth() {
  var email = document.getElementById('authEmail').value.trim();
  var password = document.getElementById('authPassword').value.trim();
  var errEl = document.getElementById('authError');
  if (!email || !password) { errEl.textContent = '请填写邮箱和密码'; return; }
  if (password.length < 6) { errEl.textContent = '密码至少6位'; return; }

  var btn = document.getElementById('authSubmitBtn');
  btn.textContent = '处理中...'; btn.disabled = true;

  var fn = authMode === 'register' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
  fn.call(supabase.auth, {email: email, password: password}).then(function(res){
    if (res.error) {
      errEl.textContent = res.error.message;
      btn.textContent = authMode === 'register' ? '注册' : '登录';
      btn.disabled = false;
    } else if (authMode === 'register') {
      errEl.textContent = '';
      showToast('注册成功！请查看邮箱验证');
      toggleAuthMode(); // switch to login mode
      btn.textContent = '登录';
      btn.disabled = false;
    } else {
      currentUser = res.data.user;
      document.getElementById('authOverlay').classList.add('hidden');
      showToast('登录成功！');
      // Sync user data
      syncUserData();
    }
  });
}

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  document.getElementById('authTitle').textContent = authMode === 'login' ? '登录 Ai乐酷' : '注册 Ai乐酷';
  document.getElementById('authDesc').textContent = authMode === 'login' ? '同步你的作品和数据到云端' : '创建账号，云端保存你的创作';
  document.getElementById('authSubmitBtn').textContent = authMode === 'login' ? '登录' : '注册';
  document.getElementById('authSwitchText').textContent = authMode === 'login' ? '没有账号？' : '已有账号？';
  document.getElementById('authSwitchLink').textContent = authMode === 'login' ? '注册' : '登录';
  document.getElementById('authError').textContent = '';
}

function skipAuth() {
  document.getElementById('authOverlay').classList.add('hidden');
  showToast('离线模式，数据仅保存在本地');
}

function syncUserData() {
  if (!currentUser) return;
  // Sync beans
  var beans = parseInt(localStorage.getItem('beans') || '0');
  if (beans > 0) {
    supabase.from('user_coins').upsert({
      user_id: currentUser.id,
      beans: beans,
      updated_at: new Date().toISOString()
    }).then(function(){});
  }
  // Load remote beans
  supabase.from('user_coins').select('beans').eq('user_id', currentUser.id).single().then(function(res){
    if (res.data && res.data.beans) {
      var local = parseInt(localStorage.getItem('beans') || '0');
      if (res.data.beans > local) {
        localStorage.setItem('beans', res.data.beans);
        updateBeanDisplay();
      }
    }
  });
}

function saveSongToCloud(song) {
  if (!currentUser) return;
  supabase.from('songs').upsert({
    id: song.id,
    user_id: currentUser.id,
    title: song.title,
    artist: song.artist,
    style: song.style || '',
    lyric: song.lyric || '',
    created_at: new Date().toISOString()
  }).then(function(res){
    if (res.error) console.error('Save song error:', res.error);
  });
}

function loadSongsFromCloud() {
  if (!currentUser) return;
  supabase.from('songs').select('*').eq('user_id', currentUser.id).order('created_at', {ascending: false}).then(function(res){
    if (res.data && res.data.length > 0) {
      // Merge with local songs
      var localIds = songs.map(function(s){return s.id;});
      res.data.forEach(function(s){
        if (localIds.indexOf(s.id) === -1) {
          songs.push({
            id: s.id, title: s.title, artist: s.artist,
            style: s.style || '', lyric: s.lyric || '词: AI创作',
            coverIdx: Math.floor(Math.random()*8),
            likes: 0, comments: 0, liked: false, favorited: false,
            isAI: true
          });
        }
      });
      renderHome();
      renderSquare();
    }
  });
}

</script>
'''

# The supabase_js already contains </script> so I need to handle this differently
# Actually, let me just insert JS code before the closing </script>
# Find the last </script> in the file
last_script = content.rfind('</script>')
# Insert Supabase init BEFORE the last closing script tag
# But actually, all this code needs to be INSIDE the script tag
# Let me find the main script tag

# Find the startup section
startup_marker = '// ==================== STARTUP ===================='
idx = content.find(startup_marker)
if idx > 0:
    # Insert before startup
    content = content[:idx] + supabase_js[:-len('</script>\n')] + '\n' + content[idx:]

with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(content)
print('Done: ' + str(len(content)) + ' bytes')
