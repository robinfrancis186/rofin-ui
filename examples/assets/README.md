# Original viewer samples

These SVG illustrations, two-page PDF, three-note WAV, three-second MP4/WebM
animation and WebVTT text alternative are original Rofin UI samples under the
repository's MIT license. They are local assets; no stock media or external
media service is needed. The PDF includes the same text as its HTML alternative.

Rebuild with `scripts/generate-viewer-assets.py` in a development Python
environment containing `reportlab` and `imageio-ffmpeg`. These tools are not
library/runtime dependencies and normal builds use the committed files.

The video includes the original WAV soundtrack. MP4/H.264/AAC and WebM/VP8/Vorbis
sources let the native browser choose a supported codec. No player autoplays.
