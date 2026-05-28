with open('rebuild.py', 'r', encoding='utf-8') as f:
    c = f.read()

# The issue: inside the triple-quoted string in rebuild.py,
# we wrote \\' which Python interprets as \' (backslash-quote)
# We need just ' (a raw single quote)
# In triple-quoted strings, ' is fine - it doesn't terminate.
# Fix: \\'  -> '

c = c.replace("\\'image\\'", "'image'")
c = c.replace("\\'file\\'", "'file'")
c = c.replace("\\'Enter\\'", "'Enter'")

with open('rebuild.py', 'w', encoding='utf-8') as f:
    f.write(c)
print('Fixed')
