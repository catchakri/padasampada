import { EnglishConcept } from '@/types/dictionary';

export const INITIAL_CONCEPTS: EnglishConcept[] = [
  {
    id: 'concept-computer',
    englishWord: 'Computer',
    category: 'దైనందిన సాంకేతికత (Daily Tech)',
    englishDefinition: 'An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program.',
    createdAt: '2026-08-10T08:00:00.000Z',
    createdBy: 'విజ్ఞాన అన్వేషకుడు',
    creatorId: 'user_telugu_1',
    status: 'approved',
    proposals: [
      {
        id: 'prop-comp-b',
        conceptId: 'concept-computer',
        teluguWord: 'గణకి',
        transliteration: 'Ganaki',
        rationale: 'గణన (compute/calculate) చేసే పరికరం. అత్యంత సంక్షిప్తమైన, పలకడానికి తేలికైన రెండు అక్షరాల సహజ పదం. (Shorter & concise).',
        exampleSentence: 'నా కొత్త గణకి లో వేగంగా పని చేసుకోవచ్చు.',
        contributorName: 'నవీన తెలుగు',
        contributorId: 'user_telugu_5',
        createdAt: '2026-08-12T10:00:00.000Z',
        upvotes: 42,
        downvotes: 1,
        status: 'approved',
        isStandardized: true,
        votedUserIds: { 'demo_user_1': 'up', 'demo_user_2': 'up' }
      },
      {
        id: 'prop-comp-a',
        conceptId: 'concept-computer',
        teluguWord: 'సంగణకం',
        transliteration: 'Sanganakam',
        rationale: 'సమగ్రంగా గణన చేసే ఉపకరణం. ప్రామాణిక సంస్కృత-తెలుగు ధాతువుల కలయిక.',
        exampleSentence: 'పాఠశాలలో విద్యార్థుల కోసం సరికొత్త సంగణకాలు ఏర్పాటు చేశారు.',
        contributorName: 'సాహితీ ప్రియుడు',
        contributorId: 'user_telugu_2',
        createdAt: '2026-08-11T09:30:00.000Z',
        upvotes: 28,
        downvotes: 3,
        status: 'approved',
        isStandardized: false
      },
      {
        id: 'prop-comp-c',
        conceptId: 'concept-computer',
        teluguWord: 'గణకయంత్రం',
        transliteration: 'Ganaka Yantram',
        rationale: 'లెక్కలు వేసే యంత్రం అనే సాంప్రదాయ పదం. అర్థం స్పష్టంగా ఉన్నప్పటికీ పదం కాస్త పొడవుగా ఉంటుంది.',
        exampleSentence: 'గణకయంత్రం ద్వారా సంక్లిష్టమైన గణాంకాలను తేలికగా పరిష్కరించవచ్చు.',
        contributorName: 'తెలుగు మిత్రుడు',
        contributorId: 'user_telugu_3',
        createdAt: '2026-08-10T08:30:00.000Z',
        upvotes: 19,
        downvotes: 5,
        status: 'approved',
        isStandardized: false
      },
      {
        id: 'prop-comp-pending',
        conceptId: 'concept-computer',
        teluguWord: 'మేధాయంత్రం',
        transliteration: 'Medha Yantram',
        rationale: 'మేధస్సుతో పనిచేసే సరికొత్త డిజిటల్ యంత్రం.',
        exampleSentence: 'ఈ ఆధునిక యుగంలో మేధాయంత్రం లేని ఇల్లు లేదు.',
        contributorName: 'కొత్త కంట్రిబ్యూటర్',
        contributorId: 'user_new_1',
        createdAt: '2026-08-20T08:00:00.000Z',
        upvotes: 1,
        downvotes: 0,
        status: 'pending',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-1',
    englishWord: 'Railway Station',
    category: 'రవాణా & ప్రయాణం (Transport)',
    englishDefinition: 'A place where trains regularly stop for passengers to get on and off or for goods to be loaded.',
    createdAt: '2026-08-15T10:00:00.000Z',
    createdBy: 'విజ్ఞాన అన్వేషకుడు',
    creatorId: 'user_telugu_1',
    status: 'approved',
    proposals: [
      {
        id: 'prop-1-1',
        conceptId: 'concept-1',
        teluguWord: 'రైలురేవు',
        transliteration: 'Railurevu',
        rationale: 'ఓడలు ఆగే రేవు (port/harbor) లాగే రైళ్లు ఆగి ప్రయాణీకులు ఎక్కిదిగే స్థావరం. చిన్నదైన, సహజమైన తెలుగింపు.',
        exampleSentence: 'సాయంత్రం 5 గంటలకి సికింద్రాబాద్ రైలురేవు వద్ద కలుద్దాం.',
        contributorName: 'విజ్ఞాన అన్వేషకుడు',
        contributorId: 'user_telugu_1',
        createdAt: '2026-08-15T10:15:00.000Z',
        upvotes: 36,
        downvotes: 1,
        status: 'approved',
        isStandardized: true,
        votedUserIds: { 'demo_user_1': 'up', 'demo_user_2': 'up' }
      },
      {
        id: 'prop-1-2',
        conceptId: 'concept-1',
        teluguWord: 'ధూమశకట నిలయం',
        transliteration: 'Dhoomashakata Nilayam',
        rationale: 'ధూమశకటం (రైలు) ఆగే సాంప్రదాయ నిలయం. కొంచెం గ్రాంథిక పదమైనా స్పష్టమైన భావం ఇస్తుంది.',
        exampleSentence: 'ప్రయాణీకులందరూ ధూమశకట నిలయంలో వేచి ఉన్నారు.',
        contributorName: 'సాహితీ ప్రియుడు',
        contributorId: 'user_telugu_2',
        createdAt: '2026-08-15T11:20:00.000Z',
        upvotes: 8,
        downvotes: 4,
        status: 'approved',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-2',
    englishWord: 'Web Browser',
    category: 'దైనందిన సాంకేతికత (Daily Tech)',
    englishDefinition: 'An application program that allows you to view and interact with information on the World Wide Web.',
    createdAt: '2026-08-16T08:30:00.000Z',
    createdBy: 'తెలుగు మిత్రుడు',
    creatorId: 'user_telugu_3',
    status: 'approved',
    proposals: [
      {
        id: 'prop-2-1',
        conceptId: 'concept-2',
        teluguWord: 'వలన్వేషి',
        transliteration: 'Valanveshi',
        rationale: 'వల (Web) + అన్వేషి (Explorer/Finder). అంతర్జాల వలలో మనకు కావలసిన సమాచారాన్ని అన్వేషించి చూపే ఉపకరణం.',
        exampleSentence: 'కొత్త సమాచారం కోసం మీ వలన్వేషి తెరచి వెతకండి.',
        contributorName: 'తెలుగు మిత్రుడు',
        contributorId: 'user_telugu_3',
        createdAt: '2026-08-16T09:00:00.000Z',
        upvotes: 39,
        downvotes: 2,
        status: 'approved',
        isStandardized: true,
        votedUserIds: { 'demo_user_1': 'up' }
      },
      {
        id: 'prop-2-2',
        conceptId: 'concept-2',
        teluguWord: 'జాలవిహారి',
        transliteration: 'Jaalavihaari',
        rationale: 'అంతర్జాలంలో విహరించడానికి ఉపయోగపడే అనువర్తనం.',
        exampleSentence: 'నా జాలవిహారి లో చాలా బుక్‌మార్క్‌లు ఉన్నాయి.',
        contributorName: 'భాషా సేవకుడు',
        contributorId: 'user_telugu_4',
        createdAt: '2026-08-16T12:00:00.000Z',
        upvotes: 14,
        downvotes: 2,
        status: 'approved',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-3',
    englishWord: 'Screenshot',
    category: 'దైనందిన సాంకేతికత (Daily Tech)',
    englishDefinition: 'An image of the data displayed on the screen of a computer or mobile device.',
    createdAt: '2026-08-17T14:00:00.000Z',
    createdBy: 'నవీన తెలుగు',
    creatorId: 'user_telugu_5',
    status: 'approved',
    proposals: [
      {
        id: 'prop-3-1',
        conceptId: 'concept-3',
        teluguWord: 'తెరపటం',
        transliteration: 'Terapatam',
        rationale: 'తెర (Screen) పై కనిపించే దృశ్యాన్ని చిత్రంగా/పటంగా (Shot/Picture) నిక్షిప్తం చేసే ప్రక్రియ.',
        exampleSentence: 'లావాదేవీ రసీదును తెరపటం తీసి భద్రపరుచుకోండి.',
        contributorName: 'నవీన తెలుగు',
        contributorId: 'user_telugu_5',
        createdAt: '2026-08-17T14:30:00.000Z',
        upvotes: 34,
        downvotes: 1,
        status: 'approved',
        isStandardized: true
      },
      {
        id: 'prop-3-2',
        conceptId: 'concept-3',
        teluguWord: 'తెరఛాయ',
        transliteration: 'Terachaaya',
        rationale: 'తెర యొక్క ఛాయాచిత్రం అనే భావనతో తేలికగా పలికే పదం.',
        exampleSentence: 'ముఖ్యమైన సమాచారం తెరఛాయ రూపంలో ఉంచాను.',
        contributorName: 'రచయిత రాంబాబు',
        contributorId: 'user_telugu_6',
        createdAt: '2026-08-17T16:00:00.000Z',
        upvotes: 9,
        downvotes: 3,
        status: 'approved',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-4',
    englishWord: 'Artificial Intelligence',
    category: 'శాస్త్ర సాంకేతికత (Science & Tech)',
    englishDefinition: 'The simulation of human intelligence processes by machines, especially computer systems.',
    createdAt: '2026-08-18T10:00:00.000Z',
    createdBy: 'కంప్యూటర్ తెలుగు',
    creatorId: 'user_telugu_7',
    status: 'approved',
    proposals: [
      {
        id: 'prop-4-1',
        conceptId: 'concept-4',
        teluguWord: 'కృత్రిమ మేధ',
        transliteration: 'Krutrima Medha',
        rationale: 'మానవ నిర్మితమైన మేధస్సును సూచించే సమగ్రమైన, లోతైన పదం.',
        exampleSentence: 'కృత్రిమ మేధ రంగంలో నూతన ఆవిష్కరణలు వేగంగా వస్తున్నాయి.',
        contributorName: 'కంప్యూటర్ తెలుగు',
        contributorId: 'user_telugu_7',
        createdAt: '2026-08-18T10:20:00.000Z',
        upvotes: 38,
        downvotes: 0,
        status: 'approved',
        isStandardized: true
      },
      {
        id: 'prop-4-2',
        conceptId: 'concept-4',
        teluguWord: 'యంత్రప్రజ్ఞ',
        transliteration: 'Yantra Pragnya',
        rationale: 'యంత్రానికి కల్పించబడిన వివేకం లేదా ప్రజ్ఞ.',
        exampleSentence: 'వైద్య రంగంలో యంత్రప్రజ్ఞ సాయం ఎంతో పెరిగింది.',
        contributorName: 'భాషా వికాసం',
        contributorId: 'user_telugu_8',
        createdAt: '2026-08-18T11:45:00.000Z',
        upvotes: 18,
        downvotes: 1,
        status: 'approved',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-5',
    englishWord: 'Podcast',
    category: 'కళలు & మాధ్యమాలు (Arts & Media)',
    englishDefinition: 'A digital audio file made available on the internet for downloading to a computer or mobile device.',
    createdAt: '2026-08-19T07:15:00.000Z',
    createdBy: 'ధ్వని తరంగం',
    creatorId: 'user_telugu_9',
    status: 'approved',
    proposals: [
      {
        id: 'prop-5-1',
        conceptId: 'concept-5',
        teluguWord: 'శ్రవ్యమాలిక',
        transliteration: 'Shravya Maalika',
        rationale: 'వినదగిన శ్రవ్య భాగాల వరుస/మాలిక. ఆడియో ఎపిసోడ్‌ల సమాహారాన్ని అందంగా వ్యక్తీకరిస్తుంది.',
        exampleSentence: 'ప్రతి ఆదివారం మా కొత్త శ్రవ్యమాలిక విడుదలవుతుంది.',
        contributorName: 'ధ్వని తరంగం',
        contributorId: 'user_telugu_9',
        createdAt: '2026-08-19T07:45:00.000Z',
        upvotes: 24,
        downvotes: 1,
        status: 'approved',
        isStandardized: false
      },
      {
        id: 'prop-5-2',
        conceptId: 'concept-5',
        teluguWord: 'ధ్వనిసంచిక',
        transliteration: 'Dhvani Sanchika',
        rationale: 'డిజిటల్ ధ్వని రూపంలో ఉండే పత్రిక/సంచిక.',
        exampleSentence: 'చరిత్ర విశేషాలతో కూడిన ధ్వనిసంచికను వినండి.',
        contributorName: 'సాంస్కృతిక సేవ',
        contributorId: 'user_telugu_10',
        createdAt: '2026-08-19T09:00:00.000Z',
        upvotes: 11,
        downvotes: 2,
        status: 'approved',
        isStandardized: false
      }
    ]
  },
  {
    id: 'concept-pending-sample',
    englishWord: 'Smartwatch',
    category: 'దైనందిన సాంకేతికత (Daily Tech)',
    englishDefinition: 'A wearable computer in the form of a watch that provides a touchscreen interface for daily use.',
    createdAt: '2026-08-20T07:00:00.000Z',
    createdBy: 'కొత్త రచయిత',
    creatorId: 'user_new_2',
    status: 'pending',
    proposals: [
      {
        id: 'prop-sw-1',
        conceptId: 'concept-pending-sample',
        teluguWord: 'తెలిగడియారం',
        transliteration: 'Teligadiyaaram',
        rationale: 'తెలివైన (Smart) గడియారం. దైనందిన జీవితంలో పలకడానికి సరళమైన ప్రయోగం.',
        exampleSentence: 'ఆయన చేతికి ఉన్న తెలిగడియారం గుండె వేగాన్ని కొలుస్తుంది.',
        contributorName: 'కొత్త రచయిత',
        contributorId: 'user_new_2',
        createdAt: '2026-08-20T07:15:00.000Z',
        upvotes: 1,
        downvotes: 0,
        status: 'pending',
        isStandardized: false
      }
    ]
  }
];

export const TELUGU_CATEGORIES = [
  'అన్నీ (All Categories)',
  'దైనందిన సాంకేతికత (Daily Tech)',
  'రవాణా & ప్రయాణం (Transport)',
  'శాస్త్ర సాంకేతికత (Science & Tech)',
  'వైద్యం & ఆరోగ్యం (Health & Medicine)',
  'పాలన & న్యాయం (Admin & Law)',
  'కళలు & మాధ్యమాలు (Arts & Media)',
  'వ్యాపారం & వాణిజ్యం (Commerce)',
  'ఇతర భావనలు (General)'
];
