from pathlib import Path
import math
import struct
import zlib


def mix(a, b, amount):
    return tuple(round(x + (y - x) * amount) for x, y in zip(a, b))


def icon(size):
    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            nx, ny = x / size, y / size
            color = mix((255, 248, 223), (118, 169, 137), min(1, (nx + ny) / 2))

            cx, cy = 0.5, 0.46
            distance = math.hypot(nx - cx, ny - cy)
            angle = math.atan2(ny - cy, nx - cx)
            ray = abs(math.sin(angle * 4))
            if 0.24 < distance < 0.37 and ray > 0.88:
                color = mix(color, (244, 174, 47), 0.82)
            if distance < 0.205:
                amount = min(1, distance / 0.205)
                color = mix((255, 248, 166), (235, 150, 28), amount)

            far_mountain = 0.19 + 0.07 * math.sin(nx * 10.5) + 0.035 * math.sin(nx * 23)
            near_mountain = 0.10 + 0.055 * math.sin(nx * 13 + 0.7) + 0.025 * math.sin(nx * 28)
            if ny < far_mountain:
                color = mix(color, (82, 127, 100), 0.8)
            if ny < near_mountain:
                color = mix(color, (49, 94, 71), 0.9)

            row.extend((*color, 255))
        rows.append(b"\x00" + bytes(row))

    raw = b"".join(reversed(rows))
    signature = b"\x89PNG\r\n\x1a\n"

    def chunk(kind, data):
        return (
            struct.pack(">I", len(data))
            + kind
            + data
            + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        )

    return (
        signature
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


output = Path(__file__).resolve().parent.parent / "assets"
output.mkdir(exist_ok=True)
for dimension in (180, 192, 512):
    (output / f"app-icon-{dimension}.png").write_bytes(icon(dimension))
