import os
import glob

# Files to update
files = glob.glob('/home/nishu/TechStack/codes/nishu.dev/app/**/*.tsx', recursive=True)
files += glob.glob('/home/nishu/TechStack/codes/nishu.dev/app/**/*.jsx', recursive=True)

replacements = {
    'text-purple-300': 'text-foreground',
    'bg-purple-500/10': 'bg-zinc-500/10',
    'border-purple-500/20': 'border-zinc-500/20',
    'hover:border-purple-500/30': 'hover:border-zinc-500/30',
    'border-purple-500/15': 'border-zinc-500/15',
    'bg-purple-500/20': 'bg-zinc-500/20',
    'text-purple-500': 'text-zinc-500',
    'text-purple-400': 'text-zinc-400',
    'from-purple-500': 'from-zinc-500',
    'to-purple-500': 'to-zinc-500',
    'via-purple-500': 'via-zinc-500',
    'from-purple-600/80': 'from-zinc-600/80',
    'to-cyan-600/80': 'to-zinc-600/80',
    'text-amber-400': 'text-zinc-400', # amber also adds color, user wants monotone
    'text-amber-500/50': 'text-zinc-500/50',
    'bg-cyan-500/8': 'bg-zinc-400/5',
    'bg-purple-500/10': 'bg-zinc-500/10',
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")
