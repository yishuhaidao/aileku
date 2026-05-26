-- ============================================
-- Miuse 音乐平台 - Supabase 数据库初始化
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 1. 歌曲表
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  style TEXT NOT NULL,
  key TEXT NOT NULL,
  bpm INTEGER NOT NULL,
  complexity INTEGER DEFAULT 5,
  duration INTEGER NOT NULL,
  density INTEGER DEFAULT 2,
  audio_url TEXT,
  is_public BOOLEAN DEFAULT true,
  plays INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- 3. 充值记录表
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 用户虾币表
CREATE TABLE IF NOT EXISTS user_coins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 自动创建用户虾币记录
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_coins (user_id, balance) VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- RLS 策略
-- ============================================

-- songs: 所有人可读公开歌曲，作者可管理自己的
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public songs are viewable by everyone"
  ON songs FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own private songs"
  ON songs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own songs"
  ON songs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs"
  ON songs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs"
  ON songs FOR DELETE USING (auth.uid() = user_id);

-- likes: 所有人可读，登录用户可操作
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT USING (true);

CREATE POLICY "Users can like/unlike"
  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
  ON likes FOR DELETE USING (auth.uid() = user_id);

-- user_coins: 仅本人可读
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coins"
  ON user_coins FOR SELECT USING (auth.uid() = user_id);

-- payments: 仅本人可读
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 存储桶：歌曲音频文件
-- 在 Supabase Dashboard → Storage 中手动创建名为 "songs" 的公开存储桶
-- ============================================

-- Storage RLS (在 Storage 页面配置):
-- 创建 bucket "songs" (Public bucket)
-- Policy: 所有人可读，登录用户可上传
-- CREATE POLICY "Anyone can read songs" ON storage.objects FOR SELECT USING (bucket_id = 'songs');
-- CREATE POLICY "Auth users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'songs' AND auth.role() = 'authenticated');
