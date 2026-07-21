import { Article, Author, AlertNotification } from './types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'elena-vance',
    name: 'Dr. Elena Vance',
    role: 'Principal Researcher',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvIJL90v92YQGkuNPosB5O-IRQazswmtiWeXUSDXsJPZE3GjD4Q3458lKT_kZFB_hajslR0STYgDvjz7zVi4W0spw6b0hUB-w72PpLxpus5hD8l-_4Pq_Ez6nLTAXTLlmnvXLPd0F3NQ0ZYrCrXfcJ5JJrj8Kl0LWXdH35dnTQ5GyFh1HK8mQ5x9sXc-6qgpVdqHDRMJRP5LbTmKM1j0IBQE0qtxwjrOGSU7JZzKqve8U_rD6NXx7Var1zCoJDygrG1bHcmtO96UQ',
    bio: 'Bridging the gap between neural networks and human intuition.',
    followed: false
  },
  {
    id: 'elias-vance',
    name: 'Dr. Elias Vance',
    role: 'Editor-at-Large',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVRsdbg9qVgAgyoXLUXJT68iHJOV5q-Y1IOR4gV85Q93H6CQMElVYgnEC-si2QZ-Z33stZDNR0HcQavUqOuzLRT2lQRvpzPUU4KU3UzsSF4o94wODU2R6UO2VCR-tWHL4yiCi5M91vFsb3B9pYByswOJjcRI5ym6YdccmUoRmyKq98EBKFLsQglR7sUcjkyZfsL-0LPA49oIDbWqyI3ZxpAu1KxLOE5nSoyWiOs2T2EnryslvUeuyo_9PM-eSWPybLGFZLMftCH_E',
    bio: 'Analyzing the risk-reward calculus of deep technologies.',
    followed: true
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    role: 'VC Partner',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANy8Dl2-nNtcmGPmaV3Kwcw4h3ZL4zUjg947YtaKMs-8G5jaqmMWYl59ITKpLpNNS_0u1_5v9MR6eRCxim7j1pI-bVWIViFBeRgHHd7ktBkUslBPRHw57EWbYnY3cCTwI1zPr_xo8k50_5I32AYD70a0opW8iqDWSQz7E8--NOaWnxFYislAOYFawWE30KMey2xLEjDUU76LWpCQ5AzXDvwOdgOYyfc8J_w2ycqt5PhHArJsY7etrV9t7TdU5SR5s30d76lWZfn58',
    bio: 'Analyzing the mechanics of hyper-growth in sustainable tech.',
    followed: false
  },
  {
    id: 's-hashimoto',
    name: 'S. Hashimoto',
    role: 'Web3 Architect',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtwOZ1ghio_ia0KN7o5sll5fQLhHas2AMJQeSCkKeOFbEpLFhoakSXd39hTPk_QZVWjfW0XVkBLUVjw6H96RPKDCoMKpxN7_N-yK6QPL7MuClShv4TrSjpck7DFWDenR0xZmT0gzQwCXHvymUmIFkAwxpL3vJR80W8tFkhqwIgpZaXjdSRIvaymyv5tH5SPyO5YKrwaJfioLh163JUWMDsiUNo5ukCbX99ljF-NOPKL1rpIKG_InBrm8DMnNtyECkE3o2s4tJTypU',
    bio: 'Decentralized protocol design and cryptoeconomic systems.',
    followed: false
  },
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    role: 'Tech Journalist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtF67HBXvmL4_1FCVsbqBlqvuJXCd1vQ9Dflp-IR5Gsog3Tou1iRi8Jq0R0Lz8wvc1MlksW4XBIz-Mpixsz1Dp4_xYIRLHyoMtPEjkaT51oQOSqAp0XxulV-gLZapaCt29hyxLBJEeGOGO47Q7rygPWa3QNsFNfgBt61hPOyNcrnCqIIbe5OJN3QE30idE2Zu3VO0s9g2eWfRIRIoRIXZS0wikNW6trQOXYV5t87njiIV7c1YFePFlKkPtd5hhKp62bkSD1XEa1Ew',
    bio: 'Uncovering the stories that shape our digital future.',
    followed: false
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'neural-synthesis',
    title: 'The Neural Synthesis: How LLMs are Redefining Creative Agency',
    category: 'Artificial Intelligence',
    readTime: '6 min read',
    author: INITIAL_AUTHORS[0], // Elena Vance
    date: 'Oct 18, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqdXZTqG57UcFS5AjVX8VpgF00WCHgKpkfEH7sMqJo49SDRKclGaPymukyyUdgWAcOqXx7C-O8v-W8kfQlA9xVMhBTE1gHktoBIlouX1_ipMUJjE20ynsCMWDz-5QJUx_s0VUwOfiGchYCm_w4By2d-A6cNWodTPEs4uytkRgL9VTznAkhNtZgyv4zQ8_AyPNoL4ntHCXiM51DhZL3mCLP4rliEXqX2BuNwlI6blAD7WptGS2ZGhfFvaonUBgl3LSiHApsuy1BnC8',
    isFeatured: true,
    likes: 342,
    commentsCount: 28,
    commentsList: [
      {
        id: '1',
        authorName: 'Marcus Thorne',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVRsdbg9qVgAgyoXLUXJT68iHJOV5q-Y1IOR4gV85Q93H6CQMElVYgnEC-si2QZ-Z33stZDNR0HcQavUqOuzLRT2lQRvpzPUU4KU3UzsSF4o94wODU2R6UO2VCR-tWHL4yiCi5M91vFsb3B9pYByswOJjcRI5ym6YdccmUoRmyKq98EBKFLsQglR7sUcjkyZfsL-0LPA49oIDbWqyI3ZxpAu1KxLOE5nSoyWiOs2T2EnryslvUeuyo_9PM-eSWPybLGFZLMftCH_E',
        text: 'This is a fascinating breakdown of the relationship between human intention and neural synthesis. Looking forward to see how this impacts agency in design.',
        timestamp: '3 hours ago'
      }
    ],
    status: 'approved',
    tags: ['AI', 'LLM', 'Creative Technology', 'Synthesis'],
    aiSummary: 'This piece explores the subtle intersection of machine learning and human intuition, detailing how large language models act as creative co-pilots rather than mere automation engines.',
    content: `
As we navigate the intersection of academic rigor and market agility, a new paradigm is emerging. Creative agency, once a discipline of pure human intuition and iterative testing, is being supercharged by the computational might of neural frameworks.

The "paper-on-surface" metaphor we often use in UI design also applies to our strategic models. We lay out the possibilities, thin and precise, and use data as the high-energy accent that guides our creative eye.

### The Collaborative Co-Pilot

Traditional creative workflows suffer from the linear complexity of generation and filtering. With generative AI, the bottleneck changes from "how do we make this?" to "how do we select and synthesize the best outcomes?". LLMs act as a divergent catalyst, sparking hundreds of novel permutations in seconds, while the human director acts as the convergent filters.

> "The future of creativity isn't just about finding the right prompt; it's about computing the right environments for concepts to adapt and thrive."

We invite you to explore this fluid grid of possibilities with us.
    `
  },
  {
    id: 'sustainable-scaling',
    title: 'Sustainable Scaling: The Post-Growth Era of Tech',
    category: 'Startups',
    readTime: '6 min read',
    author: INITIAL_AUTHORS[0], // Elena Vance
    date: 'Oct 22, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtbcU75VDmB38AKuo4huCkJkuKa-q4LjVnKrFoz59Ni-l2T_5rkh_xO8CIdY-KniBrdcFyqWihwLTKlTPp_S3maGJTN9XtVyP2alomdHrzGUF0T8N9rknra3yoUgT55-TTYnmWh6D1gOh70XpZpseVLkVT67ZbnvW7PI0FCUtrGp8vwmiZr2YJZmsplFNfUXeK3djhFxwuQb2282wytzHNNFyYlTQLqTeYgAYb0c9XVxaDSvlxdbQ2mV5jDFArBhzJGFNeKJ3-p-A',
    isTrending: true,
    likes: 189,
    commentsCount: 12,
    commentsList: [],
    status: 'approved',
    tags: ['Startups', 'Venture Capital', 'Economics', 'Sustainable Scale'],
    aiSummary: 'A critical review of the VC hyper-growth cycle and how modern startups are adapting post-inflation models to build durable, self-sustaining businesses.',
    content: `
For too long, the default blueprint of Silicon Valley was growth at all costs. Today, a quieter revolution is taking hold: sustainable scaling. Startup founders are prioritizing early unit economics, robust margin structures, and real cash flow over speculative valuations and high burn rates.

We analyze how these macroeconomic shifts are changing the very architecture of venture creation, steering teams towards longevity.
    `
  },
  {
    id: 'quantum-supremacy',
    title: 'Quantum Supremacy in Practical Materials Science',
    category: 'Innovation',
    readTime: '12 min read',
    author: INITIAL_AUTHORS[2], // Marcus Thorne
    date: 'Oct 21, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiiVuAAtmGfR7HrXdevHmyezSY-jr_zmFqfCSjlWsjky6QFPNHG5En83E_3mFGUFUhJZ6kx9tttEuQC-R-fFwcOGgaYsU986mtzfuyO_t7-IEM5JpIe_dVCyDtQiv41BnfSmsZAeKk0W650sup6yrKtRTLZykHNa1uazNKS10OaGsSEAiJkh-vwcs9Zt8Rx8jM0EfsiBNsl1P78AtIPJGR8Nc_Gts-d79MryRgEo5BcH9lPD6Ed0K1aUlC5p2VZz_qmR69co05OP8',
    isTrending: true,
    likes: 245,
    commentsCount: 31,
    commentsList: [],
    status: 'approved',
    tags: ['Quantum Computing', 'Physics', 'Materials Science', 'DeepTech'],
    aiSummary: 'How quantum simulators are bypassing traditional supercomputer limits to synthesize revolutionary superconductors and battery chemistry in real-time.',
    content: `
Materials science has long been a bottleneck for battery storage and superconductor transmission. By simulating atomic grids in highly controlled quantum chambers, researchers are unlocking practical material composites that were once considered pure theory.
    `
  },
  {
    id: 'decentralized-compute',
    title: 'Decentralized Compute: The Next Frontier of Web3',
    category: 'Technology',
    readTime: '8 min read',
    author: INITIAL_AUTHORS[3], // S. Hashimoto
    date: 'Oct 24, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOo8xVipyZkefG3ArvV-wZ8z0NnhWaxuxvhCEWyfCxZkcvpBVw2Bp0oyYwJwwDmZ4O76pnmY6PLP_wu7LENlitAFkUsjvA50SQ3GXZdxX2uzvlZSogTX-iXdDXJxhm9zIhbVv5H9Mpr-rBC96HKoFQLQa6PCU8hoUmbRjSF9foRevZ2Rd365PmNyuNAtJUMtxePU8ZLPXunSjbKZwNw8upsVhFJPIkJebyrP7c3IXzlg3338QnVJx2qAzKvAd-i3Eq_lgBqkndLkU',
    isLatest: true,
    likes: 412,
    commentsCount: 45,
    commentsList: [],
    status: 'approved',
    tags: ['Web3', 'Compute', 'Decentralized', 'Cryptography'],
    aiSummary: 'Analyzing why local-first and decentralized computing environments are fast becoming the security standard for sensitive enterprise processing in 2026.',
    content: `
Centralized cloud services present key risks in data privacy and sovereignty. Decentralized physical infrastructure networks (DePIN) offer a distributed computational alternative. By pooling unused GPU power globally and validating processes via cryptographic proofs, enterprises can process deep-learning tasks securely, privately, and at a fraction of the cost.
    `
  },
  {
    id: 'quantum-venture-convergence',
    title: 'The Convergence of Quantum Computing and Venture Architecture',
    category: 'Innovation',
    readTime: '10 min read',
    author: INITIAL_AUTHORS[1], // Elias Vance
    date: 'Oct 24, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtbcU75VDmB38AKuo4huCkJkuKa-q4LjVnKrFoz59Ni-l2T_5rkh_xO8CIdY-KniBrdcFyqWihwLTKlTPp_S3maGJTN9XtVyP2alomdHrzGUF0T8N9rknra3yoUgT55-TTYnmWh6D1gOh70XpZpseVLkVT67ZbnvW7PI0FCUtrGp8vwmiZr2YJZmsplFNfUXeK3djhFxwuQb2282wytzHNNFyYlTQLqTeYgAYb0c9XVxaDSvlxdbQ2mV5jDFArBhzJGFNeKJ3-p-A',
    likes: 1200,
    commentsCount: 48,
    commentsList: [
      {
        id: 'c1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-GGyoCKOtLs8HKgPnhCTm9GKx0ByM82HQqiENUz4hFBar6rFAqLIMh8xqkhkGdRNik9RfGUjUWl477yqwI2rIBYRxE2HEvN4udgwcpRu68_o8uoJIu_G9ELquNpuiwRWjx67IRU-DQawjfDP_4a2NGsTXWFXORy_Oji4_4JNfZ1f9bKB6Ckc6CTMIYst8H3WxWil5Cz53QaRCjFnQjK3_dm___EiHyskQbO9VE2QLWB_HBu_j3f7Bkq9Yx--5b14-H6caY9UNa6g',
        text: 'An outstanding thesis on venture risk models! Computing environments instead of just auditing founders is a profound shift.',
        timestamp: '1 day ago'
      },
      {
        id: 'c2',
        authorName: 'Marcus Wu',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauA9eWRP-mK1la2d8ku3IQCUFheeOnqXcuL7WDBVe5cPcWKr_TMtprpsD69Pa17hWVcNw6tG0MudXZgWkn8M6i8PbVrThJ50GHSudMFqldlUSHKtcdXgkuYjOyiJPp3Cf1rrrBuuD9rtJK-vsFEFsNjzOJhuiF4fAUNOUfdn6QSBWUIMin_4iSSQN8-rQOffwZzqUag053j-s2vqwn0KbVBXaXBV6t4hy58rA28r0Fav0iplXCEb9u88Z_2ktlShsOXSMIGrC0W0',
        text: 'Highly insightful read! Thanks Elias.',
        timestamp: '18 hours ago'
      }
    ],
    status: 'approved',
    tags: ['Quantum Tech', 'Venture Capital', 'Future of Work', 'Ecosystems'],
    aiSummary: 'This analysis explores how emerging quantum frameworks are fundamentally altering the risk-reward calculus for tech incubators, enabling 100x faster simulation of market volatility and product-market fit.',
    content: `
As we navigate the intersection of academic rigor and market agility, a new paradigm is emerging. Venture architecture, once a discipline of intuition and iterative testing, is being supercharged by the computational might of quantum frameworks.

The "paper-on-surface" metaphor we often use in UI design also applies to our strategic models. We lay out the possibilities, thin and precise, and use data as the high-energy accent that guides our investment eye.

### The Quantum Advantage

Traditional binary systems struggle with the multi-dimensional complexity of early-stage startup ecosystems. By contrast, quantum-inspired algorithms allow us to process thousands of variables—from global supply chain shifts to micro-trends in consumer psychology—simultaneously.

> "The future of venture isn't just about finding the right founders; it's about computing the right environments for them to thrive."

At CIE Daily, we monitor these shifts with a minimalist lens. We strip away the noise of the hype cycle to focus on the core structural integrity of these innovations. This clean, authoritative approach ensures that our readers—whether they be scholars or CEOs—receive the most distilled version of the truth.

Looking ahead to 2025, the vertical rhythm of industry change is accelerating. The base units of our economy are being recalculated. We invite you to explore this fluid grid of possibilities with us.
    `
  },
  {
    id: 'quantum-leap-atoms',
    title: 'The Quantum Leap: Why Silicon Valley is Betting on Cold Atoms',
    category: 'Technology',
    readTime: '4 min read',
    author: INITIAL_AUTHORS[4], // Sofia Chen (or Sarah Jenkins as per Explore tab title)
    date: 'Oct 23, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiiVuAAtmGfR7HrXdevHmyezSY-jr_zmFqfCSjlWsjky6QFPNHG5En83E_3mFGUFUhJZ6kx9tttEuQC-R-fFwcOGgaYsU986mtzfuyO_t7-IEM5JpIe_dVCyDtQiv41BnfSmsZAeKk0W650sup6yrKtRTLZykHNa1uazNKS10OaGsSEAiJkh-vwcs9Zt8Rx8jM0EfsiBNsl1P78AtIPJGR8Nc_Gts-d79MryRgEo5BcH9lPD6Ed0K1aUlC5p2VZz_qmR69co05OP8',
    likes: 312,
    commentsCount: 19,
    commentsList: [],
    status: 'approved',
    tags: ['Tech Revolution', 'Silicon Valley', 'Cold Atoms', 'Quantum'],
    aiSummary: 'A deep look into cold-atom technology and why it represents the hardware foundation that top-tier investors are locking in for physical qubits.',
    content: `
Silicon Valley’s elite venture funds are looking past superconducting circuits to invest in neutral-atom and cold-atom processors. Neutral atoms held by laser-powered optical tweezers offer superior scalability, coherence times, and 3D grid layout configurations. We explore how these machines operate and when they will reach commercial relevance.
    `
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alert-1',
    title: 'New Submission',
    message: 'Dr. Aris Thorne submitted a new draft: "Neural Networks in Modern Scholarly Research".',
    timestamp: '2 hours ago',
    read: false,
    type: 'info'
  },
  {
    id: 'alert-2',
    title: 'Congratulations!',
    message: 'Your publication "The Convergence of Quantum Computing..." crossed 1,200 likes!',
    timestamp: '5 hours ago',
    read: false,
    type: 'achievement'
  },
  {
    id: 'alert-3',
    title: 'Draft Approved',
    message: 'Marcus Wu’s article "Synthesizing Sustainability..." was approved for Live release.',
    timestamp: 'Yesterday',
    read: true,
    type: 'success'
  }
];

export const DRAFT_ARTICLES: Article[] = [
  {
    id: 'neural-networks-scholarly',
    title: 'Neural Networks in Modern Scholarly Research',
    category: 'Academic Tech',
    readTime: '6 min read',
    author: {
      id: 'aris-thorne',
      name: 'Dr. Aris Thorne',
      role: 'Associate Professor',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVRsdbg9qVgAgyoXLUXJT68iHJOV5q-Y1IOR4gV85Q93H6CQMElVYgnEC-si2QZ-Z33stZDNR0HcQavUqOuzLRT2lQRvpzPUU4KU3UzsSF4o94wODU2R6UO2VCR-tWHL4yiCi5M91vFsb3B9pYByswOJjcRI5ym6YdccmUoRmyKq98EBKFLsQglR7sUcjkyZfsL-0LPA49oIDbWqyI3ZxpAu1KxLOE5nSoyWiOs2T2EnryslvUeuyo_9PM-eSWPybLGFZLMftCH_E'
    },
    date: 'Oct 24, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqdXZTqG57UcFS5AjVX8VpgF00WCHgKpkfEH7sMqJo49SDRKclGaPymukyyUdgWAcOqXx7C-O8v-W8kfQlA9xVMhBTE1gHktoBIlouX1_ipMUJjE20ynsCMWDz-5QJUx_s0VUwOfiGchYCm_w4By2d-A6cNWodTPEs4uytkRgL9VTznAkhNtZgyv4zQ8_AyPNoL4ntHCXiM51DhZL3mCLP4rliEXqX2BuNwlI6blAD7WptGS2ZGhfFvaonUBgl3LSiHApsuy1BnC8',
    likes: 0,
    commentsCount: 0,
    commentsList: [],
    status: 'pending',
    tags: ['Academic', 'Research', 'Neural Networks'],
    aiSummary: 'Analyzing how transformer architectures and LLMs are speeding up literature reviews, hypothesis synthesis, and citation mapping across research fields.',
    content: 'Neural networks are revolutionizing the landscape of modern scholarly research. By automating deep text retrieval, validating cross-references, and highlighting structural logic holes, scholars can compress months of literature reviews into afternoons. This article presents several real-world examples of transformer models deployed in biology and social research labs.'
  },
  {
    id: 'lab-prototype-pivot',
    title: 'The Pivot: From Lab Prototype to Market Fit',
    category: 'Startup Culture',
    readTime: '4 min read',
    author: INITIAL_AUTHORS[0], // Elena Vance
    date: 'Oct 24, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtbcU75VDmB38AKuo4huCkJkuKa-q4LjVnKrFoz59Ni-l2T_5rkh_xO8CIdY-KniBrdcFyqWihwLTKlTPp_S3maGJTN9XtVyP2alomdHrzGUF0T8N9rknra3yoUgT55-TTYnmWh6D1gOh70XpZpseVLkVT67ZbnvW7PI0FCUtrGp8vwmiZr2YJZmsplFNfUXeK3djhFxwuQb2282wytzHNNFyYlTQLqTeYgAYb0c9XVxaDSvlxdbQ2mV5jDFArBhzJGFNeKJ3-p-A',
    likes: 0,
    commentsCount: 0,
    commentsList: [],
    status: 'pending',
    tags: ['Startups', 'Prototypes', 'Product-Market Fit'],
    aiSummary: 'Practical rules on bridging deep tech lab prototypes into venture capital-backed commercialized assets ready for production scales.',
    content: 'Taking a prototype out of an academic lab into the real world requires a complete mindset shift. The metrics that validate an innovation in research—such as technical limits or high theoretical yields—often clash with market metrics like cost-of-goods-sold and simple, bulletproof installation pathways. We present the critical transition stages of deep science venture creation.'
  },
  {
    id: 'sustainability-algae-textiles',
    title: 'Synthesizing Sustainability: Algae-Based Textiles',
    category: 'Bio-Engineering',
    readTime: '12 min read',
    author: {
      id: 'marcus-wu',
      name: 'Marcus Wu',
      role: 'Bio-Innovator',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCauA9eWRP-mK1la2d8ku3IQCUFheeOnqXcuL7WDBVe5cPcWKr_TMtprpsD69Pa17hWVcNw6tG0MudXZgWkn8M6i8PbVrThJ50GHSudMFqldlUSHKtcdXgkuYjOyiJPp3Cf1rrrBuuD9rtJK-vsFEFsNjzOJhuiF4fAUNOUfdn6QSBWUIMin_4iSSQN8-rQOffwZzqUag053j-s2vqwn0KbVBXaXBV6t4hy58rA28r0Fav0iplXCEb9u88Z_2ktlShsOXSMIGrC0W0'
    },
    date: 'Oct 23, 2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOo8xVipyZkefG3ArvV-wZ8z0NnhWaxuxvhCEWyfCxZkcvpBVw2Bp0oyYwJwwDmZ4O76pnmY6PLP_wu7LENlitAFkUsjvA50SQ3GXZdxX2uzvlZSogTX-iXdDXJxhm9zIhbVv5H9Mpr-rBC96HKoFQLQa6PCU8hoUmbRjSF9foRevZ2Rd365PmNyuNAtJUMtxePU8ZLPXunSjbKZwNw8upsVhFJPIkJebyrP7c3IXzlg3338QnVJx2qAzKvAd-i3Eq_lgBqkndLkU',
    likes: 0,
    commentsCount: 0,
    commentsList: [],
    status: 'pending',
    tags: ['Bio-Engineering', 'Sustainability', 'Materials'],
    aiSummary: 'A complete synthesis on algae bio-polymers and how they can be scaled to replace petroleum-derived synthetic fibers in high-performance garments.',
    content: 'Synthetic textiles like polyester and nylon account for huge amounts of microplastic waste and high oil consumption. Bio-engineered algae biopolymers can now be extruded into continuous filament fibers that are biodegradable, flame-retardant, and highly breathable. This article covers the chemical architecture, tensile limits, and coloring dynamics.'
  }
];
