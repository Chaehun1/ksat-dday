// 모의고사 일정 + 출제 범위 데이터
//
// scope 작성 형식 (옵션):
//   단일/공통: scope: [ { subject: '국어', range: '...' }, ... ]
//   학년 섹션: 활성화된 필터(source)와 일치하는 섹션만 표시, 정렬은 grade 내림차순 (고3 → 고2 → 고1)
//     scope: [
//       { grade: 3, source: 'pyeongwon',   label: '고3 (평가원)',  rows: [...] },
//       { grade: 2, source: 'gyoyukchung', label: '고2 (교육청)',  rows: [...] },
//       { grade: 1, source: 'gyoyukchung', label: '고1 (교육청)',  rows: [...] }
//     ]
// scope 미지정 시 모달에 "곧 업데이트" 안내가 뜸

// 사설 모의고사(서프/더프 등) 공통 scope: 직업탐구·제2외국어/한문 미시행, 나머지 전 범위
var SURF_SCOPE = [
    { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
    { subject: '수학', range: '전 범위\n(수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하)' },
    { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
    { subject: '한국사', range: '전 범위' },
    { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
    { subject: '과학탐구', range: '8과목 전 범위\n(물리학Ⅰ, 물리학Ⅱ, 화학Ⅰ, 화학Ⅱ,\n 생명과학Ⅰ, 생명과학Ⅱ, 지구과학Ⅰ, 지구과학Ⅱ)' }
];

var schedules = [
    { name: '3월 서바이벌 프로', date: '2026-03-16', displayDate: '2026년 3월 16일 (월)', category: 'surf', scope: SURF_SCOPE },
    { name: '3월 더 프리미엄', date: '2026-03-18', displayDate: '2026년 3월 18일 (수)', category: 'duff', scope: [
        { subject: '국어', range: '1,2학년 전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
        { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅰ. 경우의 수 - 1. 순열과 조합\n[미적분] Ⅰ. 수열의 극한 - 1. 수열의 극한\n[기하] Ⅰ. 이차곡선 - 1. 이차곡선' },
        { subject: '영어', range: '1,2학년 전 범위 (영어Ⅰ, 영어Ⅱ)' },
        { subject: '한국사', range: '전 범위' },
        { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
        { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅰ. 역학적 상호 작용 - 2. 행성의 운동과 상대성 - 02. 행성의 운동\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅰ. 물질의 세 가지 상태와 용액\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] Ⅱ. 세포의 특성\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅰ. 고체 지구 - 2. 지구 구성 물질과 자원 - 02. 암석의 조직 및 생성 환경' }
    ] },
    { name: '3월 모의고사', date: '2026-03-24', displayDate: '2026년 3월 24일 (화)', category: 'gyoyukchung', grades: '고1, 고2, 고3', scope: [
        { grade: 3, source: 'gyoyukchung', label: '고3 (교육청)', rows: [
            { subject: '국어', range: '1,2학년 전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅰ. 경우의 수 - 1. 순열과 조합\n[미적분] Ⅰ. 수열의 극한 - 1. 수열의 극한\n[기하] Ⅰ. 이차곡선 - 1. 이차곡선' },
            { subject: '영어', range: '1,2학년 전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '4과목 전 범위\n(물리학Ⅰ, 화학Ⅰ, 생명과학Ⅰ, 지구과학Ⅰ)\n※ 물리학Ⅱ·화학Ⅱ·생명과학Ⅱ·지구과학Ⅱ 미실시' }
        ] },
        { grade: 2, source: 'gyoyukchung', label: '고2 (교육청)', rows: [
            { subject: '국어', range: '공통국어1, 2 전 범위' },
            { subject: '수학', range: '공통수학1, 2 전 범위' },
            { subject: '영어', range: '공통영어1, 2 전 범위' },
            { subject: '한국사', range: '한국사1, 2 전 범위' },
            { subject: '통합사회', range: '통합사회1, 2 전 범위' },
            { subject: '통합과학', range: '통합과학1, 2 전 범위' }
        ] },
        { grade: 1, source: 'gyoyukchung', label: '고1 (교육청)', rows: [
            { subject: '전 영역', range: '중학교 교육과정 전 범위\n(국어/수학/영어/한국사/통합사회/통합과학)' }
        ] }
    ] },
    { name: '4월 더 프리미엄', date: '2026-04-17', displayDate: '2026년 4월 17일 (금)', category: 'duff', scope: [
        { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
        { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅰ. 경우의 수\n[미적분] Ⅱ. 미분법 - 1. 여러 가지 함수의 미분\n[기하] Ⅱ. 평면벡터 - 1. 벡터의 연산' },
        { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
        { subject: '한국사', range: '전 범위' },
        { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
        { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅱ. 전자기장 - 1. 전기장과 전기력선\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅱ. 반응엔탈피와 화학 평형 - 1. 반응엔탈피와 헤스 법칙\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] Ⅲ. 세포 호흡과 광합성\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅰ. 고체 지구 - 3. 한반도의 지질' }
    ] },
    { name: '4월 서바이벌 프로', date: '2026-04-26', displayDate: '2026년 4월 26일 (일)', category: 'surf', scope: SURF_SCOPE },
    { name: '5월 모의고사', date: '2026-05-07', displayDate: '2026년 5월 7일 (목)', category: 'gyoyukchung', grades: '고3', scope: [
        { grade: 3, source: 'gyoyukchung', label: '고3 (교육청)', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅱ. 확률 - 1. 확률의 뜻과 활용\n[미적분] Ⅱ. 미분법 - 2. 여러 가지 미분법\n[기하] Ⅱ. 평면벡터 - 1. 벡터의 연산' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅱ. 전자기장\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅱ. 반응엔탈피와 화학 평형 - 2. 화학 평형과 평형이동\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] IV. 유전자 발현의 조절\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅱ. 대기와 해양 - 1. 해수의 운동과 순환' }
        ] }
    ] },
    { name: '5월 더 프리미엄', date: '2026-05-20', displayDate: '2026년 5월 20일 (수)', category: 'duff', scope: [
        { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
        { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅱ. 확률\n[미적분] Ⅱ. 미분법\n[기하] Ⅱ. 평면벡터' },
        { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
        { subject: '한국사', range: '전 범위' },
        { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
        { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅱ. 전자기장\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅲ. 반응 속도와 촉매 - 1. 반응 속도\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] IV. 유전자 발현의 조절\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅱ. 대기와 해양 - 2. 대기의 운동과 순환' }
    ] },
    { name: '5월 서바이벌 프로', date: '2026-05-25', displayDate: '2026년 5월 25일 (월)', category: 'surf', scope: SURF_SCOPE },
    { name: '6월 모의고사', date: '2026-06-04', displayDate: '2026년 6월 4일 (목)', category: 'both', grades: { pyeongwon: '고3', gyoyukchung: '고1, 고2' }, resultDate: [
        { source: 'pyeongwon',   date: '2026-07-01', text: '고3(평가원) 7월 1일(수)' },
        { source: 'gyoyukchung', date: '2026-06-19', text: '고1·고2(교육청) 6월 19일(금)' }
    ], scope: [
        { grade: 3, source: 'pyeongwon', label: '고3 (평가원)', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅱ. 확률\n[미적분] Ⅱ. 미분법\n[기하] Ⅱ. 평면벡터' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅱ. 전자기장\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅲ. 반응 속도와 촉매\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] Ⅳ. 유전자 발현의 조절\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅱ. 대기와 해양 - 2. 대기의 운동과 순환' },
            { subject: '직업탐구', range: '6과목 전 범위\n(성공적인 직업 생활, 농업 기초 기술, 공업 일반,\n 상업 경제, 수산·해운 산업 기초, 인간 발달)' },
            { subject: '제2외국어/한문', range: '9과목 전 범위\n(독일어Ⅰ, 프랑스어Ⅰ, 스페인어Ⅰ, 중국어Ⅰ, 일본어Ⅰ,\n 러시아어Ⅰ, 베트남어Ⅰ, 아랍어Ⅰ, 한문Ⅰ)' }
        ] },
        { grade: 2, source: 'gyoyukchung', label: '고2 (교육청)', rows: [
            { subject: '국어', range: '6월 수준에 맞추어 출제\n(화법과 언어, 독서와 작문, 문학)' },
            { subject: '수학', range: '[대수] Ⅱ. 삼각함수' },
            { subject: '영어', range: '6월 수준에 맞추어 출제 (영어Ⅰ)' },
            { subject: '한국사', range: '한국사1, 2 전 범위' },
            { subject: '통합사회', range: '통합사회1, 2 전 범위' },
            { subject: '통합과학', range: '통합과학1, 2 전 범위' }
        ] },
        { grade: 1, source: 'gyoyukchung', label: '고1 (교육청)', rows: [
            { subject: '국어', range: '6월 수준에 맞추어 출제\n(공통국어1에서 출제)' },
            { subject: '수학', range: '6월 수준에 맞추어 출제\n[공통수학1] Ⅳ. 여러 가지 방정식과 부등식' },
            { subject: '영어', range: '6월 수준에 맞추어 출제\n(공통영어1에서 출제)' },
            { subject: '한국사', range: '[한국사1] Ⅱ. 근대이전 한국사의 탐구 - 4. 사상과 문화' },
            { subject: '통합사회', range: '[통합사회1] Ⅳ. 문화와 다양성 - 3. 문화 상대주의와 보편 윤리' },
            { subject: '통합과학', range: '[통합과학1] Ⅲ. 시스템과 상호작용 - 1. 지구시스템' }
        ] }
    ] },
    { name: '6월 서바이벌 프로', date: '2026-06-28', displayDate: '2026년 6월 28일 (일)', category: 'surf', scope: SURF_SCOPE },
    { name: '7월 모의고사', date: '2026-07-08', displayDate: '2026년 7월 8일 (수)', category: 'gyoyukchung', grades: '고3', scope: [
        { grade: 3, source: 'gyoyukchung', label: '고3 (교육청)', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅲ. 통계 - 1. 확률분포\n[미적분] Ⅲ. 적분법 (1. 여러 가지 적분법)\n[기하] Ⅲ. 공간도형과 공간좌표 (1. 공간도형)' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅲ. 파동과 물질의 성질 - 1. 전자기파의 성질과 활용\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅲ. 반응 속도와 촉매\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] Ⅴ. 생물의 진화와 다양성 - 02. 생물의 분류와 다양성\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅵ. 행성의 운동' }
        ] }
    ] },
    { name: '7월 더 프리미엄', date: '2026-07-16', displayDate: '2026년 7월 16일 (목)', category: 'duff', scope: [
        { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
        { subject: '수학', range: '[수학Ⅰ] 전 범위\n[수학Ⅱ] 전 범위\n[확률과 통계] Ⅲ. 통계 - 1. 확률분포\n[미적분] Ⅲ. 적분법 - 1. 여러 가지 적분법\n[기하] Ⅲ. 공간도형과 공간좌표 - 1. 공간도형' },
        { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
        { subject: '한국사', range: '전 범위' },
        { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
        { subject: '과학탐구', range: '[물리학Ⅰ] 전 범위\n[물리학Ⅱ] Ⅲ. 파동과 물질의 성질 - 1. 전자기파의 성질과 활용\n[화학Ⅰ] 전 범위\n[화학Ⅱ] Ⅲ. 반응 속도와 촉매\n[생명과학Ⅰ] 전 범위\n[생명과학Ⅱ] Ⅴ. 생물의 진화와 다양성\n[지구과학Ⅰ] 전 범위\n[지구과학Ⅱ] Ⅲ. 우주 - 1. 행성의 운동' }
    ] },
    { name: '2027 LEET (법학적성시험)', date: '2026-07-19', displayDate: '2026년 7월 19일 (일)', category: 'etc' },
    { name: '7월 서바이벌 프로', date: '2026-07-24', displayDate: '2026년 7월 24일 (금)', category: 'surf', scope: SURF_SCOPE },
    { name: '2027 사관학교 1차시험', date: '2026-08-01', displayDate: '2026년 8월 1일 (토)', category: 'etc', scope: [
        { subject: '국어', range: '독서, 문학\n(화법과 작문·언어와 매체 제외)', meta: '30문항 · 50분 · 100점' },
        { subject: '수학', range: '[공통] 수학Ⅰ, 수학Ⅱ\n[자연계열] 미적분, 기하 중 택1\n[인문계열] 확률과 통계, 미적분, 기하 중 택1', meta: '30문항 · 100분 · 100점' },
        { subject: '영어', range: '영어Ⅰ, 영어Ⅱ (듣기평가 없음)', meta: '30문항 · 50분 · 100점' }
    ] },
    { name: '2027 경찰대 1차시험', date: '2026-08-01', displayDate: '2026년 8월 1일 (토)', category: 'etc', scope: [
        { subject: '국어', range: '독서, 문학', meta: '45문항 · 60분 · 100점' },
        { subject: '수학', range: '수학Ⅰ, 수학Ⅱ', meta: '25문항 · 80분 · 100점' },
        { subject: '영어', range: '영어Ⅰ, 영어Ⅱ (듣기평가 없음)', meta: '45문항 · 60분 · 100점' }
    ] },
    { name: '8월 서바이벌 프로', date: '2026-08-17', displayDate: '2026년 8월 17일 (월)', category: 'surf', scope: SURF_SCOPE },
    { name: '8월 더 프리미엄', date: '2026-08-18', displayDate: '2026년 8월 18일 (화)', category: 'duff', scope: SURF_SCOPE },
    { name: '9월 모의고사', date: '2026-09-02', displayDate: '2026년 9월 2일 (수)', category: 'both', grades: { pyeongwon: '고3', gyoyukchung: '고1, 고2' }, scope: [
        { grade: 3, source: 'pyeongwon', label: '고3 (평가원)', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '전 범위\n(수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하)' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '8과목 전 범위\n(물리학Ⅰ, 물리학Ⅱ, 화학Ⅰ, 화학Ⅱ,\n 생명과학Ⅰ, 생명과학Ⅱ, 지구과학Ⅰ, 지구과학Ⅱ)' },
            { subject: '직업탐구', range: '6과목 전 범위\n(성공적인 직업 생활, 농업 기초 기술, 공업 일반,\n 상업 경제, 수산·해운 산업 기초, 인간 발달)' },
            { subject: '제2외국어/한문', range: '9과목 전 범위\n(독일어Ⅰ, 프랑스어Ⅰ, 스페인어Ⅰ, 중국어Ⅰ, 일본어Ⅰ,\n 러시아어Ⅰ, 베트남어Ⅰ, 아랍어Ⅰ, 한문Ⅰ)' }
        ] },
        { grade: 2, source: 'gyoyukchung', label: '고2 (교육청)', rows: [
            { subject: '국어', range: '9월 수준에 맞추어 출제\n(화법과 언어, 독서와 작문, 문학)' },
            { subject: '수학', range: '[대수] 전 범위\n[미적분Ⅰ] Ⅰ. 함수의 극한과 연속 - 1. 함수의 극한' },
            { subject: '영어', range: '9월 수준에 맞추어 출제 (영어Ⅰ)' },
            { subject: '한국사', range: '한국사1, 2 전 범위' },
            { subject: '통합사회', range: '통합사회1, 2 전 범위' },
            { subject: '통합과학', range: '통합과학1, 2 전 범위' }
        ] },
        { grade: 1, source: 'gyoyukchung', label: '고1 (교육청)', rows: [
            { subject: '국어', range: '9월 수준에 맞추어 출제\n(공통국어1, 2에서 출제)' },
            { subject: '수학', range: '9월 수준에 맞추어 출제\n[공통수학1] 전 범위' },
            { subject: '영어', range: '9월 수준에 맞추어 출제\n(공통영어1, 2에서 출제)' },
            { subject: '한국사', range: '[한국사1] 전 범위\n[한국사2] Ⅰ. 일제 식민 통치와 민족 운동 - 2. 일제의 수탈 정책과 한국인의 삶' },
            { subject: '통합사회', range: '[통합사회1] 전 범위\n[통합사회2] Ⅱ. 사회정의와 불평등' },
            { subject: '통합과학', range: '[통합과학1] 전 범위\n[통합과학2] Ⅰ. 1. 지구환경 변화와 생물다양성' }
        ] }
    ] },
    { name: '수시 원서 접수 시작', date: '2026-09-07', displayDate: '2026년 9월 7일 (월)', category: 'etc' },
    { name: '9월 더 프리미엄', date: '2026-09-16', displayDate: '2026년 9월 16일 (수)', category: 'duff', scope: SURF_SCOPE },
    { name: '9월 서바이벌 프로', date: '2026-09-24', displayDate: '2026년 9월 24일 (목)', category: 'surf', scope: SURF_SCOPE },
    { name: '10월 서바이벌 프로', date: '2026-10-09', displayDate: '2026년 10월 9일 (금)', category: 'surf', scope: SURF_SCOPE },
    { name: '10월 더 프리미엄', date: '2026-10-15', displayDate: '2026년 10월 15일 (목)', category: 'duff', scope: SURF_SCOPE },
    { name: '10월 모의고사', date: '2026-10-20', displayDate: '2026년 10월 20일 (화)', category: 'gyoyukchung', grades: '고1, 고2, 고3', scope: [
        { grade: 3, source: 'gyoyukchung', label: '고3 (교육청)', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '전 범위\n(수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하)' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '8과목 전 범위\n(물리학Ⅰ, 물리학Ⅱ, 화학Ⅰ, 화학Ⅱ,\n 생명과학Ⅰ, 생명과학Ⅱ, 지구과학Ⅰ, 지구과학Ⅱ)' },
            { subject: '직업탐구', range: '6과목 전 범위\n(성공적인 직업 생활, 농업 기초 기술, 공업 일반,\n 상업 경제, 수산·해운 산업 기초, 인간 발달)' },
            { subject: '제2외국어/한문', range: '7과목 전 범위\n(독일어Ⅰ, 프랑스어Ⅰ, 스페인어Ⅰ, 중국어Ⅰ, 일본어Ⅰ,\n 러시아어Ⅰ, 한문Ⅰ)\n※ 베트남어Ⅰ·아랍어Ⅰ 미실시' }
        ] },
        { grade: 2, source: 'gyoyukchung', label: '고2 (교육청)', rows: [
            { subject: '국어', range: '10월 수준에 맞추어 출제\n(화법과 언어, 독서와 작문, 문학)' },
            { subject: '수학', range: '[대수] 전 범위\n[미적분Ⅰ] Ⅱ. 미분 - (1) 미분계수' },
            { subject: '영어', range: '10월 수준에 맞추어 출제 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '한국사1, 2 전 범위' },
            { subject: '통합사회', range: '통합사회1, 2 전 범위' },
            { subject: '통합과학', range: '통합과학1, 2 전 범위' },
            { subject: '직업탐구', range: '[성공적인 직업생활] 전 범위' },
            { subject: '제2외국어/한문', range: '7과목 전 범위\n(독일어Ⅰ, 프랑스어Ⅰ, 스페인어Ⅰ, 중국어Ⅰ, 일본어Ⅰ,\n 러시아어Ⅰ, 한문Ⅰ)\n※ 베트남어Ⅰ·아랍어Ⅰ 미실시' }
        ] },
        { grade: 1, source: 'gyoyukchung', label: '고1 (교육청)', rows: [
            { subject: '국어', range: '10월 수준에 맞추어 출제\n(공통국어1, 2에서 출제)' },
            { subject: '수학', range: '10월 수준에 맞추어 출제\n[공통수학1] 전 범위\n[공통수학2] Ⅰ. 도형의 방정식' },
            { subject: '영어', range: '10월 수준에 맞추어 출제\n(공통영어1, 2에서 출제)' },
            { subject: '한국사', range: '[한국사1] 전 범위\n[한국사2] Ⅰ. 일제 식민 통치와 민족 운동 - 5. 광복을 위한 노력' },
            { subject: '통합사회', range: '[통합사회1] 전 범위\n[통합사회2] Ⅳ. 세계화와 평화 - 1. 세계화의 다양한 양상과 문제 해결' },
            { subject: '통합과학', range: '[통합과학1] 전 범위\n[통합과학2] Ⅱ. 환경과 에너지 - 1. 생태계와 환경 변화' }
        ] }
    ] },
    { name: '11월 더 프리미엄', date: '2026-11-02', displayDate: '2026년 11월 2일 (월)', category: 'duff', scope: SURF_SCOPE },
    { name: '11월 서바이벌 프로', date: '2026-11-02', displayDate: '2026년 11월 2일 (월)', category: 'surf', scope: SURF_SCOPE },
    { name: '2027학년도 수능', date: '2026-11-19', displayDate: '2026년 11월 19일 (목)', category: 'suneung', isSuneung: true, resultDate: [{ date: '2026-12-11', text: '2026년 12월 11일(금)' }], scope: [
        { grade: 3, source: 'suneung', label: '고3', rows: [
            { subject: '국어', range: '전 범위\n(독서, 문학, 화법과 작문, 언어와 매체)' },
            { subject: '수학', range: '전 범위\n(수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하)' },
            { subject: '영어', range: '전 범위 (영어Ⅰ, 영어Ⅱ)' },
            { subject: '한국사', range: '전 범위' },
            { subject: '사회탐구', range: '9과목 전 범위\n(생활과 윤리, 윤리와 사상, 한국지리, 세계지리,\n 동아시아사, 세계사, 정치와 법, 경제, 사회·문화)' },
            { subject: '과학탐구', range: '8과목 전 범위\n(물리학Ⅰ, 물리학Ⅱ, 화학Ⅰ, 화학Ⅱ,\n 생명과학Ⅰ, 생명과학Ⅱ, 지구과학Ⅰ, 지구과학Ⅱ)' },
            { subject: '직업탐구', range: '6과목 전 범위\n(성공적인 직업 생활, 농업 기초 기술, 공업 일반,\n 상업 경제, 수산·해운 산업 기초, 인간 발달)' },
            { subject: '제2외국어/한문', range: '9과목 전 범위\n(독일어Ⅰ, 프랑스어Ⅰ, 스페인어Ⅰ, 중국어Ⅰ, 일본어Ⅰ,\n 러시아어Ⅰ, 베트남어Ⅰ, 아랍어Ⅰ, 한문Ⅰ)' }
        ] }
    ] },
    { name: '정시 원서 접수 시작', date: '2027-01-04', displayDate: '2027년 1월 4일 (월)', category: 'etc' },
    { name: '2028학년도 수능', date: '2027-11-18', displayDate: '2027년 11월 18일 (목)', category: 'suneung', isSuneung: true }
];
