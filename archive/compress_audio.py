#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""기출_업로드 폴더 안의 듣기 음원을 96kbps MP3로 일괄 압축.

수능/모의고사 영어 듣기 음원은 음성이라 96kbps면 충분히 명료하고,
원본(보통 50MB 안팎)보다 훨씬 작아집니다(약 18MB).

  - '듣기'로 시작하는 오디오 파일만 대상 (문제·정답 PDF는 건드리지 않음)
  - 더 작아질 때만 원본을 교체 (이미 작은 파일은 건너뜀)
  - ⚠️ 원본을 덮어씁니다. 원본을 보관하려면 미리 복사해두세요.

실행:
    python compress_audio.py            # ./기출_업로드 대상
    python compress_audio.py D:\\기출    # 폴더 지정
"""
import os
import sys
import shutil
import subprocess

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

def default_root():
    home = os.path.expanduser("~")
    for cand in (os.path.join(home, "OneDrive", "바탕 화면", "기출_업로드"),
                 os.path.join(home, "Desktop", "기출_업로드"),
                 os.path.join(home, "OneDrive", "Desktop", "기출_업로드"),
                 "기출_업로드"):
        if os.path.isdir(cand):
            return cand
    return "기출_업로드"


ROOT = sys.argv[1] if len(sys.argv) > 1 else default_root()
AUDIO_EXT = {".mp3", ".m4a", ".wav", ".aac", ".ogg", ".flac", ".wma"}
BITRATE = "96k"


def main():
    if not shutil.which("ffmpeg"):
        print("ffmpeg가 설치돼 있지 않습니다.")
        print("  설치(Windows): 터미널에서  winget install Gyan.FFmpeg")
        print("  또는 https://www.gyan.dev/ffmpeg/builds/ 에서 받아 PATH에 추가")
        sys.exit(1)

    if not os.path.isdir(ROOT):
        print(f'폴더를 찾을 수 없습니다: {ROOT}')
        sys.exit(1)

    targets = []
    for dirpath, _, files in os.walk(ROOT):
        for fn in files:
            name, ext = os.path.splitext(fn)
            if ext.lower() in AUDIO_EXT and name.startswith("듣기"):
                targets.append(os.path.join(dirpath, fn))

    if not targets:
        print(f'"{ROOT}" 안에 듣기 음원이 없습니다.')
        return

    print(f"듣기 음원 {len(targets)}개 발견 → 96kbps로 압축합니다.\n")
    done = skipped = failed = 0
    saved_mb = 0.0

    for src in targets:
        dirpath = os.path.dirname(src)
        name = os.path.splitext(os.path.basename(src))[0]
        rel = os.path.relpath(src, ROOT)
        before = os.path.getsize(src) / 1024 / 1024
        tmp = os.path.join(dirpath, "_tmp_96k.mp3")

        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", src, "-vn", "-b:a", BITRATE, tmp],
                check=True, capture_output=True,
            )
        except subprocess.CalledProcessError:
            print(f"  [FAIL] 변환 실패: {rel}")
            if os.path.exists(tmp):
                os.remove(tmp)
            failed += 1
            continue

        after = os.path.getsize(tmp) / 1024 / 1024
        if after < before * 0.95:
            dst = os.path.join(dirpath, name + ".mp3")
            # 원본이 mp3가 아니면(예: 듣기.m4a) 제거해 확장자를 .mp3로 통일
            if os.path.abspath(dst) != os.path.abspath(src) and os.path.exists(src):
                os.remove(src)
            os.replace(tmp, dst)
            saved_mb += before - after
            done += 1
            print(f"  [OK]   {before:5.1f}MB -> {after:5.1f}MB  {rel}")
        else:
            os.remove(tmp)
            skipped += 1
            print(f"  [skip] 이미 충분히 작음: {rel}")

    print(f"\n완료: {done}개 압축, {skipped}개 건너뜀"
          + (f", {failed}개 실패" if failed else "")
          + f" · 총 {saved_mb:.1f}MB 절약")


if __name__ == "__main__":
    main()
