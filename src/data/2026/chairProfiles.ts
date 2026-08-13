import type { SpeakerId } from "./schedule";

interface ProfileBase {
  name: string;
  affiliation: string;
}

interface CompleteChairProfile extends ProfileBase {
  status: "complete";
  source: "email" | "submission" | "public-web";
  bio: string;
  introduction: string;
}

interface PendingChairProfile extends ProfileBase {
  status: "pending";
  source: "pending";
  statusNote: string;
}

export type ChairProfile = CompleteChairProfile | PendingChairProfile;

export const chairProfiles = {
  "roger-luo": {
    name: "Xiu-Zhe (Roger) Luo",
    affiliation: "QuEra Computing",
    status: "complete",
    source: "submission",
    introduction: "Roger Luo is Director of Scientific Software at QuEra Computing, where he leads compiler infrastructure, numerical tools, and algorithms for neutral-atom platforms. His doctoral work at the University of Waterloo and Perimeter Institute explored computational quantum many-body physics and machine learning. A recipient of the Wittek Quantum Prize, he leads Yao.jl and has contributed to Julia and PyTorch.",
    bio: "Xiu-Zhe (Roger) Luo is the Director of Scientific Software at QuEra Computing, where he leads the development of quantum compiler infrastructure, numerical tools, and algorithms for neutral atom platforms. Roger did his PhD work at the University of Waterloo and the Perimeter Institute studying computational quantum many-body physics and machine learning methods. He is the recipient of the 2020 Wittek Quantum Prize for his outstanding contributions to open-source quantum software. He is the lead developer of Yao.jl, a high-performance and differentiable quantum circuit simulation framework, and the primary architect of QuEra's compiler pipeline for neutral atom systems. He has also contributed to a number of widely used open-source projects in the scientific computing ecosystem, including the Julia compiler and PyTorch.",
  },
  "lukas-burgholzer": {
    name: "Lukas Burgholzer",
    affiliation: "Technical University of Munich",
    status: "complete",
    source: "submission",
    introduction: "Lukas Burgholzer is a postdoctoral researcher at the Technical University of Munich and CTO of the Munich Quantum Software Company. He is a key contributor to the Munich Quantum Toolkit and the Munich Quantum Software Stack project, building practical open-source tools for quantum computers. His work has received the EDAA Outstanding Dissertation Award and the Heinz Zemanek Prize.",
    bio: "Lukas Burgholzer is a postdoc at the Technical University of Munich as well as the CTO of the Munich Quantum Software Company, where he is on a mission to build actually useful software for quantum computers. As one of the masterminds behind the Munich Quantum Toolkit (MQT) and a key player in the Munich Quantum Software Stack (MQSS) project, he is dedicated to creating tools that do not just work but work for the community. His work has earned him accolades like the EDAA Outstanding Dissertation Award and the Heinz Zemanek Prize, but he is most proud of building bridges in the open-source quantum world.",
  },
  "kyungjoo-noh": {
    name: "Kyungjoo Noh",
    affiliation: "NVIDIA",
    status: "complete",
    source: "email",
    introduction: "Kyungjoo Noh is a Senior Quantum Error Correction Research Scientist at NVIDIA, working on fault-tolerant quantum computing with neutral-atom systems. He previously researched hardware-efficient error correction with bosonic cat qubits at the Amazon Center for Quantum Computing, and holds a PhD in Physics from Yale. His talk examines how atom loss reshapes compilation, verification, simulation, and decoding.",
    bio: "Kyungjoo Noh is a Senior Quantum Error Correction Research Scientist at NVIDIA, where he works on fault-tolerant quantum computing with neutral atom systems. Prior to NVIDIA, he was at the Amazon Center for Quantum Computing, researching hardware-efficient ways to implement quantum error correction using noise-biased bosonic cat qubits. He received his BSc in Physics from Seoul National University in 2014 and his PhD in Physics from Yale University in 2020. His research interests include fault-tolerant quantum computing, quantum error correction, classical simulation of quantum systems, and quantum communication theory.",
  },
  "tim-chen": {
    name: "Tim (Yi-Ting) Chen",
    affiliation: "Amazon Braket",
    status: "complete",
    source: "email",
    introduction: "Tim Chen is an Applied Scientist on the Amazon Braket team, working on programming models and compilation for quantum computers. He architects software for fault-tolerant quantum computing and builds OpenQASM analysis, compilation infrastructure, and dynamic-circuit support. He earned his PhD in Applied Physics at Stanford, using atom manipulation to study the microscopic structure of electrons.",
    bio: "Tim (Yi-Ting) Chen is an Applied Scientist on the Amazon Braket team, where he works on programming models and compilation for quantum computers. His work includes architecting the software stack for fault-tolerant quantum computing, building OpenQASM program analysis and compilation infrastructure, and extending the programming model to support dynamic circuits. Previously, he focused test suites and statistical methods for verifying the quantum stack across hardware and software. He received his PhD in Applied Physics from Stanford University, where he used atom manipulation to probe the microscopic structure of electrons in condensed matter systems.",
  },
  "phillip-weinberg": {
    name: "Phillip Weinberg",
    affiliation: "QuEra Computing",
    status: "complete",
    source: "submission",
    introduction: "Phillip Weinberg is a Senior Scientific Software Engineer at QuEra Computing and leads development of Bloqade, QuEra's open-source SDK and compiler infrastructure. His work spans high-level circuit interfaces, atom movement, and trap scheduling. After doctoral work at Boston University and a postdoc at Northeastern, he joined QuEra in 2022 and contributed to the Aquila system and logical magic-state distillation demonstration.",
    bio: "Phillip Weinberg is a Senior Scientific Software Engineer at QuEra Computing, where he leads the development of Bloqade, QuEra's open-source SDK and compiler infrastructure for neutral atom quantum computers. Phillip did his PhD work at Boston University studying non-equilibrium quantum dynamics under Anatoli Polkovnikov and Anders Sandvik. After completing his PhD, he held a postdoctoral position at Northeastern University before joining QuEra in 2022. At QuEra, his work spans the full neutral atom software stack—from high-level circuit programming interfaces to low-level hardware control via Bloqade Shuttle, which provides abstractions for atom movement and trap scheduling on neutral atom devices. He has also contributed to key experimental milestones at QuEra, including the Aquila 256-qubit neutral atom quantum computer and the recent demonstration of logical magic state distillation.",
  },
  "jason-ludmir": {
    name: "Jason Ludmir",
    affiliation: "Rice University",
    status: "complete",
    source: "public-web",
    introduction: "Jason Ludmir is a Computer Science PhD student at Rice University, advised by Tirthak Patel, working at the intersection of quantum computing and high-performance computing. His research focuses on hardware-aware compilation and systems optimization for Rydberg neutral-atom computers. His work on improving neutral-atom efficiency received first place in the graduate research competition at SC24.",
    bio: "Jason Ludmir is a Computer Science PhD student at Rice University, where he works under Tirthak Patel at the intersection of quantum computing and high-performance computing. His research spans optimized compilation for Rydberg-atom systems, hybrid quantum-classical algorithms, and machine-learning-driven quantum frameworks. He earned an MSc in Computer Science from Brown University, focusing on database systems and optimization, and a BS in Finance from Wake Forest University. His work on reducing qubit waste from measurement-related ejections in neutral-atom systems received first prize in the graduate category at SC24.",
  },
  "yannick-stade": {
    name: "Yannick Stade",
    affiliation: "Technical University of Munich",
    status: "complete",
    source: "submission",
    introduction: "Yannick Stade is a doctoral researcher at the Technical University of Munich working at the intersection of neutral-atom quantum computing and compiler design. He develops placement, routing, and scheduling techniques for zoned architectures and is the main contributor to the Quantum Device Management Interface. He has authored more than two dozen publications and collaborates with academic and industrial partners worldwide.",
    bio: "Yannick Stade is a doctoral researcher at the Technical University of Munich, working at the intersection of quantum computing based on neutral atoms and compiler design. In this domain, he has contributed several state-of-the-art techniques for placement, routing, and scheduling on zoned neutral-atom architectures, including the first routing-aware placement approach that significantly reduces qubit-rearrangement overheads. He is the main contributor to the Quantum Device Management Interface (QDMI), a low-latency C-based interface enabling seamless integration of diverse quantum hardware into the Munich Quantum Software Stack. His work also engages with community-driven efforts toward common circuit exchange formats and MLIR-based compiler infrastructures, helping bridge the gap between classical compiler engineering and quantum-software needs. Yannick has authored more than two dozen scientific publications across leading venues in quantum computing, design automation, and HPC, and collaborates with academic and industrial partners worldwide.",
  },
  "ying-wang": {
    name: "Ying Wang",
    affiliation: "Stevens Institute of Technology",
    status: "complete",
    source: "public-web",
    introduction: "Ying Wang is an Associate Professor of Systems Engineering at Stevens Institute of Technology. Her interdisciplinary research spans cybersecurity, wireless communications, health AI, and quantum computing. She holds a PhD in Electrical Engineering from Virginia Tech and brings experience from both academia and industry. At CEVNAC, she presents two studies addressing reliability in neutral-atom compilation and quantum error correction.",
    bio: "Ying Wang is an Associate Professor in the Department of Systems Engineering at Stevens Institute of Technology. Her interdisciplinary research spans cybersecurity, wireless communications, health AI, and quantum computing, and she has broad experience in both industry and academia. She earned her PhD in Electrical Engineering from Virginia Tech, her MS in Electrical Engineering from the University of Cincinnati, and her BS in Information Engineering from Beijing University of Posts and Telecommunications. Her recent quantum-computing research includes quantum neural networks and reinforcement-learning initializations for variational quantum circuits.",
  },
  "elham-kashefi": {
    name: "Elham Kashefi",
    affiliation: "University of Edinburgh",
    status: "pending",
    source: "pending",
    statusNote: "The invited slot is scheduled, but the talk title, abstract, and speaker biography have not yet been supplied.",
  },
  "hanyu-wang": {
    name: "Hanyu Wang",
    affiliation: "University of California, Los Angeles",
    status: "complete",
    source: "email",
    introduction: "Hanyu Wang is a PhD student in the Department of Computer Science at UCLA, advised by Professor Jason Cong, and is broadly interested in mathematical optimization problems in electronic design automation. This talk carries that optimization perspective into cross-layer compilation for fault-tolerant quantum computing, spanning logical circuit synthesis at the frontend and real-time scheduling and routing at the backend.",
    bio: "Hanyu Wang is a PhD student at UCLA in the Department of Computer Science advised by Prof. Jason Cong. Hanyu is broadly interested in mathematical optimization problems in electronic design automation.",
  },
  "rafael-haenel": {
    name: "Rafael Haenel",
    affiliation: "QuEra Computing",
    status: "complete",
    source: "submission",
    introduction: "Rafael Haenel is a Senior Scientific Software Developer in Quantum Error Correction at QuEra Computing, building scalable error-correction software through hardware–software co-design. He completed his PhD at the University of British Columbia, studying quantum computing, superconductivity, and strongly correlated quantum matter. Before joining QuEra, he developed QLDPC codes as a Quantum Software Engineer at Photonic.",
    bio: "Rafael Haenel is a Senior Scientific Software Developer in Quantum Error Correction at QuEra Computing, developing quantum error correction software for neutral atom platforms. Rafael did his PhD work at the University of British Columbia studying quantum computing, superconductivity, and strongly correlated quantum matter, with a research focus on scientific numerical computing and data analysis. After completing his PhD, Rafael worked as a Quantum Software Engineer at Vancouver-based startup Photonic Inc, where he focused on scientific software for discovery and development of QLDPC codes. He later joined QuEra where he works on building scalable quantum error correction software at the intersection of hardware and software co-design.",
  },
  "jixuan-ruan": {
    name: "Jixuan Ruan",
    affiliation: "University of California, San Diego",
    status: "complete",
    source: "email",
    introduction: "Jixuan Ruan is a second-year PhD student at the University of California, San Diego, advised by Professor Yufei Ding. Her research focuses on neutral-atom compilation and compiler–architecture co-design. She develops high-level intermediate representations and data structures for efficient, extensible compilation, and explores AI-assisted, circuit-specific optimization techniques for quantum programs.",
    bio: "Jixuan Ruan is a second-year Ph.D. student at the University of California San Diego, advised by Professor Yufei Ding. Her research focuses on quantum compilation for neutral-atom systems, particularly on incorporating emerging hardware capabilities and identifying key compiler-architecture co-design principles. She develops high-level intermediate representations and data structures to support efficient and extensible compilation, and also explores AI-assisted, circuit-specific optimization for quantum programs.",
  },
} satisfies Record<SpeakerId, ChairProfile>;
