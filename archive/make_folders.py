#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""기출문제 자료실 업로드용 빈 폴더 트리 생성기.

생성 규칙은 관리자 페이지의 "📁 폴더 일괄 업로드"가 인식하는 경로 구조
( 시험ID / 과목그룹 / 세부과목 / 문제.pdf )와 정확히 일치합니다.

실행:
    python make_folders.py            # ./기출_업로드 에 생성
    python make_folders.py D:\\기출    # 원하는 위치 지정

만들어진 각 과목 폴더에 시험지(문제.pdf)·정답지(정답.pdf)를 넣고,
관리자 페이지에서 최상위 폴더(기출_업로드)를 통째로 선택하면 됩니다.
자료가 없는 과목 폴더는 비워두면 업로드 시 자동으로 무시됩니다.
"""
import os
import sys

# Windows 콘솔에서도 완료 메시지(한글)가 깨지지 않도록 출력 인코딩 보정
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# 2022~2026학년도 (가장 최근 시행 완료된 5개년)
YEARS = range(2022, 2027)

# 학년 — 수능 대비 자료실이므로 고3
GRADE = 3

# 시험 종류 · 회차
#   평가원(pyeongga):    수능 / 6월모평 / 9월모평
#   교육청(gyoyukcheong): 3·4·7·10월 학력평가 (6·9월은 평가원, 11월은 수능)
EXAMS = (
    [("pyeongga", s)     for s in ("suneung", "6mo", "9mo")] +
    [("gyoyukcheong", s) for s in ("3wol", "4wol", "7wol", "10wol")]
)

# 과목그룹(폴더명) → 세부과목 목록
SUBJECTS = {
    "국어":      ["국어"],
    "수학":      ["수학"],
    "영어":      ["영어"],
    "한국사":    ["한국사"],
    "사회탐구":  ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리",
                "동아시아사", "세계사", "정치와 법", "경제", "사회·문화"],
    "과학탐구":  ["물리학1", "물리학2", "화학1", "화학2",
                "생명과학1", "생명과학2", "지구과학1", "지구과학2"],
    "직업탐구":  ["성공적인 직업생활", "농업 기초 기술", "공업 일반",
                "상업 경제", "수산·해운 산업 기초", "인간 발달"],
    "제2외국어": ["독일어", "프랑스어", "스페인어", "중국어", "일본어",
                "러시아어", "아랍어", "베트남어", "한문"],
}

README = """■ 기출문제 자료실 업로드 가이드

이 폴더 안에는 시험별 · 과목별 빈 폴더가 만들어져 있습니다.

1) 각 과목 폴더에 파일을 넣으세요.
   - 시험지 → 파일명을 "문제"로  (예: 문제.pdf)
   - 정답지 → 파일명을 "정답"으로 (예: 정답.pdf)
   * 확장자는 .pdf 가 아니어도 됩니다. 파일명만 '문제' / '정답' 이면 됩니다.

2) 자료가 있는 과목만 채우면 됩니다.
   비어 있는 폴더는 업로드할 때 자동으로 무시됩니다.

3) 다 채운 뒤, 관리자 페이지의
   "📁 자료실 — 폴더 일괄 업로드" 에서
   이 최상위 폴더를 통째로 선택하면 한 번에 올라갑니다.

■ 폴더 구조
   시험ID / 과목그룹 / 세부과목 / 문제.pdf (또는 정답.pdf)
   예) 2026-pyeongga-g3-suneung / 과학탐구 / 물리학1 / 문제.pdf

■ 시험ID 읽는 법   (학년도-종류-g학년-회차)
   pyeongga      = 평가원   (suneung 수능 · 6mo 6월모평 · 9mo 9월모평)
   gyoyukcheong  = 교육청   (3wol·4wol·7wol·10wol 학력평가)
   예) 2026-gyoyukcheong-g3-3wol = 2026학년도 고3 3월 학력평가
"""


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "기출_업로드"
    folder_count = 0
    exam_ids = []

    for year in YEARS:
        for type_, subtype in EXAMS:
            exam_id = f"{year}-{type_}-g{GRADE}-{subtype}"
            exam_ids.append(exam_id)
            for group, subjects in SUBJECTS.items():
                for subj in subjects:
                    os.makedirs(os.path.join(root, exam_id, group, subj), exist_ok=True)
                    folder_count += 1

    with open(os.path.join(root, "_사용법.txt"), "w", encoding="utf-8") as f:
        f.write(README)

    print(f"완료 → {os.path.abspath(root)}")
    print(f"  시험 {len(exam_ids)}개 · 과목 폴더 {folder_count}개 생성")
    print("  각 과목 폴더에 '문제.pdf' / '정답.pdf' 를 넣은 뒤,")
    print("  관리자 페이지 → 폴더 일괄 업로드에서 이 폴더를 통째로 선택하세요.")


if __name__ == "__main__":
    main()
