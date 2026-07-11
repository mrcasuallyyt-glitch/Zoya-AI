import os
import subprocess

logo_path = 'src/assets/images/zoya_logo_1783341903630.jpg'
bg_color = '#E9EFED'

res_base = 'android/app/src/main/res'

# Density folders and their icon / adaptive foreground sizes
density_config = {
    'mipmap-mdpi': {
        'icon': 48,
        'foreground': 108
    },
    'mipmap-hdpi': {
        'icon': 72,
        'foreground': 162
    },
    'mipmap-xhdpi': {
        'icon': 96,
        'foreground': 216
    },
    'mipmap-xxhdpi': {
        'icon': 144,
        'foreground': 324
    },
    'mipmap-xxxhdpi': {
        'icon': 192,
        'foreground': 432
    }
}

# Splash screens configurations
splash_config = {
    'drawable': (1024, 1024),
    'drawable-land-mdpi': (480, 320),
    'drawable-land-hdpi': (800, 480),
    'drawable-land-xhdpi': (1280, 720),
    'drawable-land-xxhdpi': (1600, 960),
    'drawable-land-xxxhdpi': (1920, 1280),
    'drawable-port-mdpi': (320, 480),
    'drawable-port-hdpi': (480, 800),
    'drawable-port-xhdpi': (720, 1280),
    'drawable-port-xxhdpi': (960, 1600),
    'drawable-port-xxxhdpi': (1280, 1920)
}

def run_cmd(args):
    print("Running:", " ".join(args))
    subprocess.run(args, check=True)

def generate_assets():
    # 1. Generate Icons
    for folder, config in density_config.items():
        folder_path = os.path.join(res_base, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Sqr icon size
        icon_size = config['icon']
        icon_path = os.path.join(folder_path, 'ic_launcher.png')
        # Standard icon
        run_cmd([
            'convert', logo_path,
            '-strip',
            '-resize', f'{icon_size}x{icon_size}!',
            icon_path
        ])
        
        # Round icon (crop with transparent circle mask)
        round_path = os.path.join(folder_path, 'ic_launcher_round.png')
        radius = icon_size / 2
        run_cmd([
            'convert', logo_path,
            '-strip',
            '-resize', f'{icon_size}x{icon_size}!',
            '-alpha', 'on',
            '-background', 'none',
            '(', '+clone', '-threshold', '-1', '-fill', 'black', '-draw', f'circle {radius},{radius} {radius},0', ')',
            '-compose', 'CopyOpacity', '-composite',
            round_path
        ])
        
        # Foreground icon (adaptive) - centered inside safe zone (approx 66% of target size)
        fg_size = config['foreground']
        inner_logo_size = int(fg_size * 0.66)
        fg_path = os.path.join(folder_path, 'ic_launcher_foreground.png')
        run_cmd([
            'convert', logo_path,
            '-strip',
            '-resize', f'{inner_logo_size}x{inner_logo_size}',
            '-background', 'none',
            '-gravity', 'center',
            '-extent', f'{fg_size}x{fg_size}',
            fg_path
        ])
        
    # 2. Generate Splash Screens
    for folder, size in splash_config.items():
        folder_path = os.path.join(res_base, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        width, height = size
        splash_path = os.path.join(folder_path, 'splash.png')
        
        # Base logo size on the splash screen - maximum 35% of the smallest screen edge, min 160px
        min_edge = min(width, height)
        logo_splash_size = max(160, int(min_edge * 0.35))
        if folder == 'drawable': # Square fallback splash
            logo_splash_size = 512
            
        run_cmd([
            'convert', logo_path,
            '-strip',
            '-resize', f'{logo_splash_size}x{logo_splash_size}',
            '-background', bg_color,
            '-gravity', 'center',
            '-extent', f'{width}x{height}',
            splash_path
        ])

    print("Success! All icons and splash screens regenerated.")

if __name__ == '__main__':
    generate_assets()
