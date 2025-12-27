# Assets Directory Structure

```
assets/
├── logo/          # Logo images
│   └── logo.png   # Main application logo
├── audio/         # Audio files for bingo numbers
│   ├── number-1.mp3
│   ├── number-2.mp3
│   └── ...
└── images/        # Images for bingo numbers
    ├── number-1.jpg
    ├── number-2.jpg
    └── ...
```

## File Naming Conventions

1. Logo:
   - Place in the `logo/` directory
   - Use descriptive names (e.g., `logo.png`, `logo-dark.png`)

2. Audio Files:
   - Place in the `audio/` directory
   - Name format: `number-{N}.mp3` where N is the bingo number
   - Example: `number-1.mp3`, `number-2.mp3`, etc.

3. Images:
   - Place in the `images/` directory
   - Name format: `number-{N}.jpg` where N is the bingo number
   - Example: `number-1.jpg`, `number-2.jpg`, etc.

## Supported Formats

- Images: .png, .jpg, .jpeg
- Audio: .mp3