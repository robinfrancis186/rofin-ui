"""Rebuild the original viewer samples; development-only reportlab/imageio-ffmpeg.
Run with a Python environment containing those tools. No application dependency.
"""
from pathlib import Path
import math, struct, subprocess, wave
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import imageio_ffmpeg

root = Path(__file__).resolve().parent.parent / 'examples' / 'assets'
root.mkdir(exist_ok=True)
art = {
    'dawn.svg': '<rect width="960" height="540" fill="#fff0df"/><circle cx="660" cy="235" r="130" fill="#f6ad68"/><path d="M0 430Q210 180 480 375T960 300V540H0Z" fill="#465f5a"/><path d="M0 500Q380 290 960 450V540H0Z" fill="#223e3a"/><path d="M100 150h120v180H100z" fill="#fff9ed"/><path d="M160 150v180M100 240h120" stroke="#c7ad92" stroke-width="8"/>',
    'orbit.svg': '<rect width="960" height="540" fill="#242338"/><circle cx="480" cy="270" r="130" fill="#b6a0f1"/><ellipse cx="480" cy="270" rx="325" ry="90" transform="rotate(-24 480 270)" fill="none" stroke="#e6dffb" stroke-width="10"/><circle cx="198" cy="388" r="23" fill="#e5b47e"/><circle cx="160" cy="90" r="4" fill="#e6dffb"/><circle cx="805" cy="150" r="5" fill="#e6dffb"/><circle cx="740" cy="445" r="3" fill="#e6dffb"/>',
    'studio.svg': '<rect width="960" height="540" fill="#e8e9e4"/><rect x="100" y="100" width="760" height="350" rx="30" fill="#f9faf6"/><rect x="145" y="145" width="220" height="250" rx="18" fill="#4b615c"/><circle cx="255" cy="238" r="50" fill="#e8b075"/><rect x="405" y="145" width="405" height="50" rx="10" fill="#b5a2e1"/><rect x="405" y="225" width="180" height="170" rx="15" fill="#ddd9ee"/><rect x="615" y="225" width="195" height="170" rx="15" fill="#eedfcb"/>'
}
for name, shapes in art.items():
    (root / name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">{shapes}</svg>\n')

with wave.open(str(root / 'three-notes.wav'), 'wb') as audio:
    audio.setparams((1, 2, 22050, 0, 'NONE', 'not compressed'))
    samples = []
    for n in range(22050 * 3):
        t = n / 22050
        value = sum(0.13 * math.sin(2 * math.pi * hz * (t - start)) * math.exp(-4 * (t - start)) * min(1, (t - start) * 100) for start, hz in [(0.2, 261.63), (1.0, 329.63), (1.8, 392.0)] if t >= start)
        samples.append(struct.pack('<h', round(max(-1, min(1, value)) * 32767)))
    audio.writeframes(b''.join(samples))
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
# Original RGB frames: a dot visits three cards and a progress bar advances.
for name, codec, audio_codec in [('small-momentum.mp4', 'libx264', 'aac'), ('small-momentum.webm', 'libvpx', 'libvorbis')]:
    process = subprocess.Popen([ffmpeg, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '640x360', '-r', '20', '-i', '-', '-i', str(root / 'three-notes.wav'), '-c:v', codec, '-pix_fmt', 'yuv420p', '-c:a', audio_codec, '-b:a', '64k', '-shortest', *(['-movflags', '+faststart'] if name.endswith('.mp4') else []), str(root / name)], stdin=subprocess.PIPE)
    for index in range(60):
        frame = bytearray(bytes([28, 29, 40]) * 640 * 360)
        def rectangle(x, y, width, height, rgb):
            for row in range(y, y + height):
                frame[(row * 640 + x) * 3:(row * 640 + x + width) * 3] = bytes(rgb) * width
        for x in [65, 245, 425]: rectangle(x, 120, 150, 135, [50, 51, 69])
        rectangle(65, 295, 510, 8, [50, 51, 69])
        rectangle(65, 295, round(510 * (index + 1) / 60), 8, [174, 153, 238])
        cx, cy = round(100 + index / 59 * 440), round(173 - 35 * math.sin(index / 59 * math.pi * 2))
        for row in range(cy - 22, cy + 23):
            half = int(math.sqrt(max(0, 22 ** 2 - (row - cy) ** 2)))
            rectangle(cx - half, row, half * 2 + 1, 1, [220, 190, 145])
        process.stdin.write(frame)
    process.stdin.close()
    if process.wait() != 0: raise RuntimeError('Sample encoding failed')
(root / 'small-momentum.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:03.000\n[Three soft notes. A golden dot crosses three cards as a lavender progress bar fills.]\n')

pdf = canvas.Canvas(str(root / 'project-brief.pdf'), pagesize=(595, 842), invariant=1)
pdf.setTitle('A small project, thoughtfully made')
pdf.setAuthor('Rofin UI')
chapters = [
    ('01', 'Make room for a good idea.', [('The idea', 'Build a useful workspace from small, reusable pieces.'), ('The people', 'Make it readable, keyboard friendly and comfortable on a phone.'), ('The shape', 'Start with a clear task, a short form and helpful feedback.')]),
    ('02', 'Give the details a little care.', [('Before sharing', 'Check navigation, forms, errors and actual file downloads.'), ('When it moves', 'Let people choose when media plays. Keep text alternatives.'), ('What stays', 'A product supplies its own accounts, services and durable data.')])
]
for number, heading, sections in chapters:
    pdf.setFillColor(HexColor('#f8f7fb')); pdf.rect(0, 0, 595, 842, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#6252ac')); pdf.roundRect(48, 748, 42, 42, 12, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#ffffff')); pdf.setFont('Helvetica-Bold', 19); pdf.drawString(62, 761, 'R')
    pdf.setFillColor(HexColor('#252431')); pdf.setFont('Helvetica-Bold', 14); pdf.drawString(108, 761, 'rofin ui')
    pdf.setFont('Helvetica', 11); pdf.drawString(48, 680, 'A SMALL PROJECT, THOUGHTFULLY MADE')
    pdf.setFont('Helvetica-Bold', 25); pdf.drawString(48, 628, heading)
    y = 538
    for title, text in sections:
        pdf.setFont('Helvetica-Bold', 14); pdf.drawString(48, y, title)
        pdf.setFont('Helvetica', 11); pdf.drawString(48, y - 26, text); y -= 118
    pdf.setStrokeColor(HexColor('#d4cfdf')); pdf.line(48, 88, 547, 88)
    pdf.setFont('Helvetica', 10); pdf.drawString(48, 64, 'Original Rofin UI sample - HTML text alternative supplied'); pdf.drawRightString(547, 64, number)
    pdf.showPage()
pdf.save()
