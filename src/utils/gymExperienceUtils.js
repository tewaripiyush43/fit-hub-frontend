/**
 * Gym Experience Utilities:
 * - Muscle-targeted Pre-Workout Dynamic Warm-ups with Step-by-Step Instructions & Technique Guides
 * - Muscle-targeted Post-Workout Static Cooldown Stretches with Biomechanical Form Cues
 * - Warm-Up Sets Pyramid Calculator
 * - Barbell Plate Calculator (kg and lbs)
 * - Web Audio API Chimes
 * - Muscle Fatigue & Recovery Heatmap Calculator
 */

// ── 1. PRE-WORKOUT DYNAMIC WARM-UP ROUTINES (COMPREHENSIVE FOR ALL MUSCLES) ───
export const WARMUP_ROUTINES_BY_MUSCLE = {
  chest: [
    {
      name: "Band Pull-Aparts & Chest Openers",
      duration: "45s",
      reps: "15-20 reps",
      target: "Pectoralis Major, Anterior Delts & Scapular Retractors",
      instructions: [
        "Hold resistance band at shoulder height in front of chest.",
        "Squeeze shoulder blades together as you pull hands apart until arms form a straight line.",
        "Control the return with continuous tension.",
      ],
      cue: "Feel chest open up while actively firing rhomboids and middle trapezius.",
    },
    {
      name: "Push-up to Downward Dog",
      duration: "45s",
      reps: "8-10 reps",
      target: "Pectorals, Serratus Anterior & Shoulder Stabilizers",
      instructions: [
        "Perform a controlled standard push-up lowering chest to 2 inches off floor.",
        "Press up explosively through palms, driving hips straight up and back.",
      ],
      cue: "Synchronize deep inhale on the push-up and full exhale into Downward Dog.",
    },
  ],
  shoulders: [
    {
      name: "Arm Circles & Cross-Body Swings",
      duration: "30s",
      reps: "15 each way",
      target: "Anterior & Lateral Deltoids, Rotator Cuff",
      instructions: [
        "Extend arms parallel to floor; make small controlled circles gradually increasing diameter.",
        "Follow with full cross-body swings alternating top arm.",
      ],
      cue: "Keep shoulders depressed away from ears throughout.",
    },
    {
      name: "Prone Y-T-W Raises",
      duration: "45s",
      reps: "8 each",
      target: "Rotator Cuff, Rear Deltoids & Lower Traps",
      instructions: [
        "Lie face down with thumbs to ceiling; lift arms into 'Y', 'T', and 'W' positions.",
        "Hold 1-second top contraction on each rep.",
      ],
      cue: "Initiate movement from shoulder blades, not by craning your neck.",
    },
  ],
  biceps: [
    {
      name: "Forearm Supination & Elbow Flips",
      duration: "30s",
      reps: "15 reps",
      target: "Biceps Brachii & Antecubital Tendons",
      instructions: [
        "Extend arms forward with fists clenched, rotate palms upward (supination) then downward.",
        "Follow with light bodyweight dynamic curls against isometric hand pressure.",
      ],
      cue: "Warm up the distal bicep tendon before loading heavy barbell curls.",
    },
    {
      name: "Light Incline Push-ups / Band Curls",
      duration: "40s",
      reps: "15 reps",
      target: "Biceps Brachii & Brachialis Activation",
      instructions: [
        "Step on a light band and perform rhythmic, rapid partial curls focusing on the squeeze.",
      ],
      cue: "Pump blood into the bicep belly without fatiguing the muscle.",
    },
  ],
  triceps: [
    {
      name: "Overhead Arm Reach & Tricep Kickback Mobilizer",
      duration: "40s",
      reps: "12 each side",
      target: "Triceps Long Head & Elbow Joint Fluid",
      instructions: [
        "Reach one arm overhead, bending elbow behind neck, gently pulse with opposite hand.",
        "Follow with unweighted full-range tricep kickbacks squeezing at lockout.",
      ],
      cue: "Lubricate the olecranon bursa before heavy pressing or skull crushers.",
    },
    {
      name: "Bench Dip Pulses",
      duration: "35s",
      reps: "12 reps",
      target: "Lateral and Medial Tricep Heads",
      instructions: [
        "Hands on bench behind hips, lower 3 inches and press straight up with smooth rhythm.",
      ],
      cue: "Keep elbows pointed straight back — do not flare out.",
    },
  ],
  forearms: [
    {
      name: "Wrist Flexor & Extensor Circles",
      duration: "30s",
      reps: "20 each way",
      target: "Brachioradialis, Wrist Flexors & Extensors",
      instructions: [
        "Interlace fingers and roll wrists in smooth fluid circles.",
        "Extend arm forward with palm facing up, gently pull fingers back for 5 seconds.",
      ],
      cue: "Critical for preventing golfer's/tennis elbow during heavy gripping.",
    },
    {
      name: "Fist Clenches & Finger Spreads",
      duration: "30s",
      reps: "25 reps",
      target: "Deep Finger Flexors & Grip Endurance",
      instructions: [
        "Rapidly clench tight fists then flare fingers wide open to drive blood flow.",
      ],
      cue: "Perform rapidly until you feel warmth through the entire forearm.",
    },
  ],
  abs: [
    {
      name: "Deadbugs",
      duration: "45s",
      reps: "10 each side",
      target: "Rectus Abdominis & Transverse Abdominis",
      instructions: [
        "Lie on back, arms to ceiling, knees bent at 90°. Press lower back flat into floor.",
        "Slowly extend opposite arm and leg toward floor without arching lower back.",
      ],
      cue: "Exhale forcefully on extension to lock in deep core brace.",
    },
    {
      name: "Cat-Cow Core Dynamic Stretch",
      duration: "40s",
      reps: "8 cycles",
      target: "Spinal Articulation & Abdominal Wall Stretch",
      instructions: [
        "On all fours, arch spine upward tucking pelvis, then drop belly stretching abs.",
      ],
      cue: "Move vertebrae segment by segment with deep rhythmic breathing.",
    },
  ],
  obliques: [
    {
      name: "Standing Lateral Torso Bends",
      duration: "40s",
      reps: "12 each side",
      target: "Internal & External Obliques, Quadratus Lumborum",
      instructions: [
        "Reach right arm overhead, gently lean torso to the left feeling the lateral stretch.",
        "Engage right oblique to pull torso back to center, then switch sides.",
      ],
      cue: "Keep hips square; do not twist your hips as you lean.",
    },
    {
      name: "Cross-Body Mountain Climbers (Slow)",
      duration: "40s",
      reps: "10 each side",
      target: "Rotational Core & Oblique Activation",
      instructions: [
        "In high plank, drive right knee across toward left elbow, hold 1s, return and switch.",
      ],
      cue: "Keep shoulders locked square and squeeze the twisting oblique.",
    },
  ],
  quads: [
    {
      name: "Bodyweight Pause Squats",
      duration: "45s",
      reps: "10 reps",
      target: "Quadriceps (Rectus Femoris, Vastus Medialis) & Knees",
      instructions: [
        "Feet shoulder-width apart, sink into deep squat below parallel.",
        "Pause 2 seconds in the hole, actively pushing knees outward over toes, then stand.",
      ],
      cue: "Fire your VMO teardrop muscle as you lock out at the top.",
    },
    {
      name: "Walking Quad Pulls with Forward Reach",
      duration: "45s",
      reps: "8 each leg",
      target: "Rectus Femoris & Hip Flexor Dynamic Mobility",
      instructions: [
        "Grab ankle pulling heel to glute while reaching opposite arm forward.",
        "Hold 2 seconds, step forward and switch legs.",
      ],
      cue: "Tuck pelvis slightly to maximize the stretch through the front of the hip.",
    },
  ],
  calves: [
    {
      name: "Ankle Wall Drives & Dorsiflexion",
      duration: "40s",
      reps: "12 each side",
      target: "Gastrocnemius, Soleus & Tibialis Anterior",
      instructions: [
        "Toes 3 inches from wall, drive knee forward over toes without heel lifting.",
        "Follow with 15 rapid bodyweight toe lifts (tibialis raises).",
      ],
      cue: "Crucial for allowing deep knee flexion on squats and leg press.",
    },
    {
      name: "Downward Dog Calf Pedaling",
      duration: "45s",
      reps: "15 reps",
      target: "Calf Bellies & Achilles Tendon Mobility",
      instructions: [
        "In Downward Dog, press one heel firmly into floor while bending opposite knee.",
        "Alternate feet with a slow 2-second hold per side.",
      ],
      cue: "Keep hips high in the air to maximize leverage onto the calf stretch.",
    },
  ],
  traps: [
    {
      name: "Shoulder Shrug Rolls (Forward & Reverse)",
      duration: "35s",
      reps: "15 reps each",
      target: "Upper Trapezius & Levator Scapulae",
      instructions: [
        "Elevate shoulders straight up to ears, roll backward squeezing scapulae, then depress.",
      ],
      cue: "Release tension accumulated from desk posture before heavy pulling.",
    },
    {
      name: "Scapular Wall Slides",
      duration: "40s",
      reps: "12 reps",
      target: "Lower & Middle Traps, Serratus Anterior",
      instructions: [
        "Forearms flat against wall, slide upward into 'Y' position while maintaining wall contact.",
      ],
      cue: "Feel lower traps engage near the bottom of your shoulder blades.",
    },
  ],
  lats: [
    {
      name: "Scapular Retraction Pulls / Dead Hang",
      duration: "40s",
      reps: "10 reps",
      target: "Latissimus Dorsi & Rhomboids",
      instructions: [
        "Hang from pull-up bar with straight arms; pull shoulder blades down and together.",
        "Hold 1 second at top, then smoothly release to dead hang.",
      ],
      cue: "Isolate movement purely to scapular depression — do not bend elbows.",
    },
    {
      name: "Kneeling Lat Stretch with Reach",
      duration: "40s",
      reps: "5 each side",
      target: "Latissimus Dorsi Lateral Insertion",
      instructions: [
        "Kneel in front of bench, place forearms on bench, drop chest toward floor.",
      ],
      cue: "Deep inhale into ribs to expand and lengthen the latissimus dorsi.",
    },
  ],
  rear_delts: [
    {
      name: "Band Face Pulls with External Rotation",
      duration: "45s",
      reps: "15 reps",
      target: "Posterior Deltoids & Infraspinatus",
      instructions: [
        "Pull band to eye level, leading with elbows and rotating forearms upward.",
        "Squeeze rear shoulder blades together for 1 full second.",
      ],
      cue: "Keep neck relaxed and focus on squeezing the back of the shoulder cap.",
    },
  ],
  triceps_back: [
    {
      name: "Band Tricep Pushdown Warmup",
      duration: "40s",
      reps: "20 reps",
      target: "Triceps Long, Lateral & Medial Heads",
      instructions: [
        "Elbows pinned to sides, push band down to full lockout with a 1-second pause.",
      ],
      cue: "Warm up the elbow joint with lightweight continuous tension.",
    },
  ],
  lower_back: [
    {
      name: "Bird-Dogs & Hip Hinges",
      duration: "45s",
      reps: "10 each side",
      target: "Erector Spinae & Glute-Hamstring Tie-in",
      instructions: [
        "Extend opposite arm and leg on all fours without tilting hips.",
        "Follow with 10 bodyweight Romanian Deadlift hip hinges with hands behind head.",
      ],
      cue: "Keep lumbar spine completely neutral; hinge purely from the hips.",
    },
  ],
  glutes: [
    {
      name: "Glute Bridges with 2-Second Squeeze",
      duration: "45s",
      reps: "12 reps",
      target: "Gluteus Maximus & Hip Extensors",
      instructions: [
        "Lie on back with knees bent, feet flat. Drive hips to ceiling through heels.",
        "Squeeze glutes hard at top lockout for 2 full seconds before lowering.",
      ],
      cue: "Do not hyperextend lower back — lock out using glutes and posterior pelvic tilt.",
    },
    {
      name: "Fire Hydrants & Clamshells",
      duration: "40s",
      reps: "10 each side",
      target: "Gluteus Medius & Hip Rotators",
      instructions: [
        "On all fours, lift knee out to side at 90° without tilting torso.",
      ],
      cue: "Essential for knee stability and hip tracking during squats.",
    },
  ],
  hamstrings: [
    {
      name: "Dynamic Leg Swings (Front to Back)",
      duration: "40s",
      reps: "12 each leg",
      target: "Biceps Femoris, Semitendinosus & Hip Flexors",
      instructions: [
        "Hold wall for balance, swing leg forward and back with gentle pendulum rhythm.",
      ],
      cue: "Keep standing knee soft and maintain an upright torso.",
    },
    {
      name: "Inchworms to Plank",
      duration: "45s",
      reps: "6 reps",
      target: "Hamstrings, Calves & Posterior Chain",
      instructions: [
        "Hinge forward with straight legs, walk hands out to plank, then walk feet forward.",
      ],
      cue: "Feel deep stretch in hamstrings as your hands walk away from feet.",
    },
  ],
  default: [
    {
      name: "World's Greatest Stretch",
      duration: "60s",
      reps: "5 each side",
      target: "Full Body Mobility, Hips, Spine & Ankles",
      instructions: [
        "Step into deep lunge, rotate chest and arm to ceiling, then hinge back.",
      ],
      cue: "Take full breaths at end-range positions.",
    },
  ],
};

// ── 2. POST-WORKOUT STATIC COOLDOWN STRETCHES (FOR ALL MUSCLES) ────────────────
export const COOLDOWN_STRETCHES_BY_MUSCLE = {
  chest: [
    {
      name: "Doorway Pec Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Pectoralis Major & Sternal Head",
      instructions: [
        "Place forearm flush on door jamb at 90°, step forward until deep stretch is felt.",
      ],
      cue: "Keep torso upright and breathe into the ribcage.",
    },
  ],
  shoulders: [
    {
      name: "Cross-Body Shoulder Hug Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Posterior Deltoid & Infraspinatus",
      instructions: [
        "Bring arm across chest at shoulder level, hug elbow in with opposite forearm.",
      ],
      cue: "Depress shoulder down away from ear while pulling.",
    },
  ],
  biceps: [
    {
      name: "Wall Bicep & Anterior Shoulder Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Biceps Brachii & Distal Tendon",
      instructions: [
        "Place palm flat on wall behind you at shoulder height with straight arm.",
        "Gently rotate chest away from the wall until stretch is felt in bicep.",
      ],
      cue: "Keep shoulder depressed and do not force joint angle.",
    },
  ],
  triceps: [
    {
      name: "Overhead Triceps Reach Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Triceps Long Head & Latissimus Dorsi",
      instructions: [
        "Reach hand down center of spine, gently press elbow downward with opposite hand.",
      ],
      cue: "Keep spine neutral without arching your lower back.",
    },
  ],
  forearms: [
    {
      name: "Prayer Wrist & Flexor Stretch",
      duration: 30,
      hold: "30s hold",
      target: "Wrist Flexors & Extensors",
      instructions: [
        "Press palms together in front of chest, lower wrists downward while keeping palms connected.",
      ],
      cue: "Maintain gentle pressure to decompress the carpal tunnel.",
    },
  ],
  abs: [
    {
      name: "Cobra / Sphinx Pose",
      duration: 35,
      hold: "35s hold",
      target: "Rectus Abdominis & Psoas",
      instructions: [
        "Lie face down, press through palms to lift chest off floor with hips relaxed on mat.",
      ],
      cue: "Lengthen spine upward rather than jamming into the lumbar spine.",
    },
  ],
  obliques: [
    {
      name: "Seated Side Mermaid Stretch",
      duration: 30,
      hold: "30s per side",
      target: "External Obliques & Quadratus Lumborum",
      instructions: [
        "Sit tall, reach right arm up and over head to the left while keeping right hip grounded.",
      ],
      cue: "Breathe deeply into the lateral ribcage.",
    },
  ],
  quads: [
    {
      name: "Standing / Lying Quad Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Rectus Femoris & Hip Flexors",
      instructions: [
        "Grasp ankle, pull heel to glute, tuck pelvis under into posterior tilt.",
      ],
      cue: "Keep knees aligned together — avoid flaring knee out to the side.",
    },
  ],
  calves: [
    {
      name: "Wall Calf & Achilles Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Gastrocnemius & Soleus",
      instructions: [
        "Step back in split stance with rear heel pressed firmly into floor, lean into wall.",
      ],
      cue: "Keep rear leg completely straight to target the gastrocnemius.",
    },
  ],
  traps: [
    {
      name: "Upper Trap Ear-to-Shoulder Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Upper Trapezius & Levator Scapulae",
      instructions: [
        "Gently tilt head toward right shoulder, reach left hand behind back to depress shoulder.",
      ],
      cue: "Use only gentle hand weight on top of head — never yank or pull.",
    },
  ],
  lats: [
    {
      name: "Child's Pose Lat Reach",
      duration: 35,
      hold: "35s per side",
      target: "Latissimus Dorsi & Thoracolumbar Fascia",
      instructions: [
        "In child's pose, walk both hands 10 inches to the left to deeply stretch right lat.",
      ],
      cue: "Sink hips back onto heels with every exhale.",
    },
  ],
  rear_delts: [
    {
      name: "Cross-Body Posterior Capsule Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Rear Deltoid & Infraspinatus",
      instructions: [
        "Bring arm across chest, gently hug elbow with opposite arm while keeping shoulder depressed.",
      ],
      cue: "Hold steady and breathe slowly to downregulate nervous system.",
    },
  ],
  lower_back: [
    {
      name: "Knees-to-Chest Lumbar Stretch",
      duration: 35,
      hold: "35s hold",
      target: "Erector Spinae & Sacroiliac Decompression",
      instructions: [
        "Lie on back, hug both knees gently into chest, rock softly side-to-side.",
      ],
      cue: "Allow lower back to flatten completely and release tension.",
    },
  ],
  glutes: [
    {
      name: "Pigeon Pose / Figure-4 Glute Stretch",
      duration: 35,
      hold: "35s per side",
      target: "Gluteus Maximus, Piriformis & Deep Hip Rotators",
      instructions: [
        "Cross right ankle over left knee, pull left hamstring toward chest.",
      ],
      cue: "Keep head relaxed on floor and hips square.",
    },
  ],
  hamstrings: [
    {
      name: "Seated Single-Leg Hamstring Stretch",
      duration: 30,
      hold: "30s per side",
      target: "Biceps Femoris & Semitendinosus",
      instructions: [
        "Sit with one leg straight, hinge forward at hips with flat back reaching toward toes.",
      ],
      cue: "Lead with chest toward toes rather than hunching upper back.",
    },
  ],
  default: [
    {
      name: "Full Body Deep Child's Pose",
      duration: 40,
      hold: "40s hold",
      target: "Spine, Lats, Hips & Nervous System Downregulation",
      instructions: [
        "Sink hips onto heels with arms extended forward, breathing slow and deep.",
      ],
      cue: "Focus on 4-second inhales and 6-second slow exhales.",
    },
  ],
};

// Aliases for general categories
WARMUP_ROUTINES_BY_MUSCLE.back = WARMUP_ROUTINES_BY_MUSCLE.lats;
WARMUP_ROUTINES_BY_MUSCLE.legs = WARMUP_ROUTINES_BY_MUSCLE.quads;
WARMUP_ROUTINES_BY_MUSCLE.arms = WARMUP_ROUTINES_BY_MUSCLE.biceps;
WARMUP_ROUTINES_BY_MUSCLE.core = WARMUP_ROUTINES_BY_MUSCLE.abs;

COOLDOWN_STRETCHES_BY_MUSCLE.back = COOLDOWN_STRETCHES_BY_MUSCLE.lats;
COOLDOWN_STRETCHES_BY_MUSCLE.legs = COOLDOWN_STRETCHES_BY_MUSCLE.quads;
COOLDOWN_STRETCHES_BY_MUSCLE.arms = COOLDOWN_STRETCHES_BY_MUSCLE.biceps;
COOLDOWN_STRETCHES_BY_MUSCLE.core = COOLDOWN_STRETCHES_BY_MUSCLE.abs;

// Determines dominant muscle group from routine exercises
export function getDominantMuscleGroup(exercises = []) {
  if (!exercises || exercises.length === 0) return "default";

  const muscleCounts = {};
  exercises.forEach((ex) => {
    const raw = (ex.targetMuscle || ex.target || ex.bodyPart || ex.exerciseName || "").toLowerCase();
    if (raw.includes("chest") || raw.includes("pectoral") || raw.includes("push") || raw.includes("bench")) {
      muscleCounts.chest = (muscleCounts.chest || 0) + 1;
    } else if (raw.includes("back") || raw.includes("lat") || raw.includes("pull") || raw.includes("row") || raw.includes("deadlift")) {
      muscleCounts.back = (muscleCounts.back || 0) + 1;
    } else if (raw.includes("leg") || raw.includes("quad") || raw.includes("hamstring") || raw.includes("glute") || raw.includes("squat") || raw.includes("calf")) {
      muscleCounts.legs = (muscleCounts.legs || 0) + 1;
    } else if (raw.includes("shoulder") || raw.includes("delt") || raw.includes("press")) {
      muscleCounts.shoulders = (muscleCounts.shoulders || 0) + 1;
    } else if (raw.includes("bicep") || raw.includes("tricep") || raw.includes("arm")) {
      muscleCounts.arms = (muscleCounts.arms || 0) + 1;
    } else if (raw.includes("ab") || raw.includes("core") || raw.includes("waist")) {
      muscleCounts.core = (muscleCounts.core || 0) + 1;
    }
  });

  let dominant = "default";
  let maxCount = 0;
  Object.keys(muscleCounts).forEach((m) => {
    if (muscleCounts[m] > maxCount) {
      maxCount = muscleCounts[m];
      dominant = m;
    }
  });

  return dominant;
}

// ── 3. WARM-UP SETS PYRAMID CALCULATOR ─────────────────────────────────────────
export function calculateWarmupPyramid(workingWeight = 60, barWeight = 20) {
  const target = Math.max(workingWeight, barWeight);
  const diff = target - barWeight;

  if (diff <= 10) {
    return [
      { step: 1, percent: "Bar Only", weight: barWeight, reps: 10, cue: "Focus on form, groove, and range of motion" },
      { step: 2, percent: "Working Set", weight: target, reps: "Working Reps", cue: "Ready for your heavy working sets!" },
    ];
  }

  const set1 = { step: 1, percent: "Empty Bar", weight: barWeight, reps: 10, cue: "Joint lubrication & motion prep" };
  const set2Weight = Math.round((barWeight + diff * 0.5) / 2.5) * 2.5;
  const set2 = { step: 2, percent: "50% Load", weight: set2Weight, reps: 5, cue: "Crisp, explosive tempo" };
  const set3Weight = Math.round((barWeight + diff * 0.75) / 2.5) * 2.5;
  const set3 = { step: 3, percent: "75% Load", weight: set3Weight, reps: 3, cue: "Acclimate central nervous system" };
  const set4Weight = Math.round((barWeight + diff * 0.9) / 2.5) * 2.5;
  const set4 = { step: 4, percent: "90% Load", weight: set4Weight, reps: 1, cue: "Single potentiation rep, do not fatigue" };

  return [set1, set2, set3, set4];
}

// ── 4. BARBELL PLATE CALCULATOR ───────────────────────────────────────────────
export const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const LBS_PLATES = [45, 35, 25, 10, 5, 2.5];

export const PLATE_COLORS_KG = {
  25: "#ef4444", // Red
  20: "#3b82f6", // Blue
  15: "#eab308", // Yellow
  10: "#22c55e", // Green
  5: "#ffffff",  // White
  2.5: "#000000",// Black
  1.25: "#6b7280"// Grey
};

export const PLATE_COLORS_LBS = {
  45: "#3b82f6", // Blue
  35: "#eab308", // Yellow
  25: "#22c55e", // Green
  10: "#ffffff", // White
  5: "#000000",  // Black
  2.5: "#6b7280" // Grey
};

export function calculatePlates(targetWeight, unit = "kg", customBarWeight = null) {
  const isKg = unit.toLowerCase() === "kg";
  const barWeight = customBarWeight !== null ? customBarWeight : (isKg ? 20 : 45);
  const availablePlates = isKg ? KG_PLATES : LBS_PLATES;

  if (targetWeight <= barWeight) {
    return {
      barWeight,
      totalWeight: barWeight,
      perSideWeight: 0,
      platesPerSide: [],
      exact: targetWeight === barWeight,
      remainder: 0,
    };
  }

  let weightNeededPerSide = (targetWeight - barWeight) / 2;
  const platesPerSide = [];

  for (const plate of availablePlates) {
    while (weightNeededPerSide >= plate - 0.001) {
      platesPerSide.push(plate);
      weightNeededPerSide -= plate;
    }
  }

  const remainder = Math.round(weightNeededPerSide * 2 * 100) / 100;
  const totalLoaded = barWeight + platesPerSide.reduce((acc, p) => acc + p * 2, 0);

  return {
    barWeight,
    totalWeight: totalLoaded,
    perSideWeight: (totalLoaded - barWeight) / 2,
    platesPerSide,
    exact: remainder === 0,
    remainder,
  };
}

// ── 5. WEB AUDIO REST TIMER CHIME ─────────────────────────────────────────────
export function playRestTimerChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;

    // Tone 1: High crisp notification ping (880 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: Success resolution ping (1320 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.15);
    gain2.gain.setValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.65);

    // Vibration on mobile if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (err) {
    console.warn("Web Audio chime could not play:", err);
  }
}

export const playGymTimerChime = playRestTimerChime;

// ── 6. MUSCLE FATIGUE & RECOVERY HEATMAP ───────────────────────────────────────
export const MUSCLE_GROUPS_LIST = [
  { id: "chest", label: "Chest", emoji: "🛡️" },
  { id: "back", label: "Back", emoji: "🦅" },
  { id: "legs", label: "Legs", emoji: "🦵" },
  { id: "shoulders", label: "Shoulders", emoji: "🥋" },
  { id: "arms", label: "Arms", emoji: "💪" },
  { id: "core", label: "Core", emoji: "⚡" },
];

export const DETAILED_MUSCLES_LIST = [
  { id: "chest", label: "Chest", anatomicalName: "Pectoralis Major", searchKey: "chest", view: "front", emoji: "🛡️" },
  { id: "shoulders", label: "Shoulders", anatomicalName: "Anterior & Lateral Deltoids", searchKey: "shoulders", view: "front", emoji: "🥋" },
  { id: "biceps", label: "Biceps", anatomicalName: "Biceps Brachii", searchKey: "biceps", view: "front", emoji: "💪" },
  { id: "forearms", label: "Forearms", anatomicalName: "Brachioradialis & Flexors", searchKey: "forearms", view: "front", emoji: "✊" },
  { id: "abs", label: "Abs & Core", anatomicalName: "Rectus Abdominis", searchKey: "abs", view: "front", emoji: "⚡" },
  { id: "obliques", label: "Obliques", anatomicalName: "External Obliques", searchKey: "obliques", view: "front", emoji: "🌀" },
  { id: "quads", label: "Quads", anatomicalName: "Quadriceps Femoris", searchKey: "quads", view: "front", emoji: "🦵" },
  { id: "calves", label: "Calves", anatomicalName: "Gastrocnemius & Soleus", searchKey: "calves", view: "both", emoji: "🦿" },
  { id: "traps", label: "Traps", anatomicalName: "Trapezius", searchKey: "traps", view: "back", emoji: "🏔️" },
  { id: "lats", label: "Lats & Upper Back", anatomicalName: "Latissimus Dorsi & Rhomboids", searchKey: "back", view: "back", emoji: "🦅" },
  { id: "rear_delts", label: "Rear Delts", anatomicalName: "Posterior Deltoids", searchKey: "shoulders", view: "back", emoji: "🎯" },
  { id: "triceps", label: "Triceps", anatomicalName: "Triceps Brachii", searchKey: "triceps", view: "back", emoji: "💥" },
  { id: "lower_back", label: "Lower Back", anatomicalName: "Erector Spinae", searchKey: "back", view: "back", emoji: "🧱" },
  { id: "glutes", label: "Glutes", anatomicalName: "Gluteus Maximus", searchKey: "glutes", view: "back", emoji: "🍑" },
  { id: "hamstrings", label: "Hamstrings", anatomicalName: "Biceps Femoris", searchKey: "hamstrings", view: "back", emoji: "🏃" },
];

export function calculateGranularMuscleRecovery(sessionHistory = []) {
  const now = Date.now();
  const muscleLastTrained = {};

  (sessionHistory || []).forEach((session) => {
    const sessionTime = session.timestamp ? new Date(session.timestamp).getTime() : new Date(session.date || 0).getTime();
    if (isNaN(sessionTime)) return;

    const exercises = session.exercises || [];
    exercises.forEach((ex) => {
      const target = (ex.targetMuscle || ex.target || ex.bodyPart || ex.exerciseName || "").toLowerCase();
      
      const record = (muscleKey) => {
        if (!muscleLastTrained[muscleKey] || sessionTime > muscleLastTrained[muscleKey]) {
          muscleLastTrained[muscleKey] = sessionTime;
        }
      };

      if (target.includes("chest") || target.includes("pectoral") || target.includes("bench") || target.includes("push up") || target.includes("pushup") || target.includes("fly")) record("chest");
      if (target.includes("front delt") || target.includes("overhead press") || target.includes("lateral raise") || target.includes("shoulder") || target.includes("military")) {
        record("shoulders");
      }
      if (target.includes("rear delt") || target.includes("face pull") || target.includes("reverse fly")) {
        record("rear_delts");
      }
      if (target.includes("bicep") || target.includes("curl") || target.includes("chin up") || target.includes("chinup")) record("biceps");
      if (target.includes("tricep") || target.includes("dip") || target.includes("skull crusher") || target.includes("pushdown")) record("triceps");
      if (target.includes("forearm") || target.includes("wrist") || target.includes("grip")) record("forearms");
      if (target.includes("ab") || target.includes("crunch") || target.includes("plank") || target.includes("leg raise") || target.includes("core")) record("abs");
      if (target.includes("oblique") || target.includes("russian twist") || target.includes("woodchopper") || target.includes("side plank")) record("obliques");
      if (target.includes("trap") || target.includes("shrug") || target.includes("upright row") || target.includes("farmer")) record("traps");
      if (target.includes("lat") || target.includes("pull down") || target.includes("pulldown") || target.includes("pull up") || target.includes("pullup") || target.includes("row") || (target.includes("back") && !target.includes("lower"))) record("lats");
      if (target.includes("lower back") || target.includes("erector") || target.includes("hyperextension") || target.includes("good morning")) record("lower_back");
      if (target.includes("glute") || target.includes("hip thrust") || target.includes("bridge") || target.includes("kickback")) record("glutes");
      if (target.includes("quad") || target.includes("squat") || target.includes("leg press") || target.includes("lunge") || target.includes("leg extension")) record("quads");
      if (target.includes("hamstring") || target.includes("deadlift") || target.includes("leg curl") || target.includes("rdl") || target.includes("romanian")) record("hamstrings");
      if (target.includes("calf") || target.includes("calves") || target.includes("tibialis") || target.includes("toe raise")) record("calves");
    });
  });

  return DETAILED_MUSCLES_LIST.map((muscle) => {
    const lastTime = muscleLastTrained[muscle.id];
    if (!lastTime) {
      return {
        ...muscle,
        status: "ready",
        statusText: "Ready to Train",
        hoursAgo: null,
        recoveryPercent: 100,
      };
    }

    const hoursAgo = Math.max(0, Math.round((now - lastTime) / (1000 * 60 * 60)));

    if (hoursAgo < 24) {
      const recoveryPercent = Math.min(60, Math.round((hoursAgo / 24) * 60));
      return {
        ...muscle,
        status: "fatigued",
        statusText: "Fatigued (< 24h)",
        hoursAgo,
        recoveryPercent,
      };
    } else if (hoursAgo < 48) {
      const recoveryPercent = 60 + Math.round(((hoursAgo - 24) / 24) * 35);
      return {
        ...muscle,
        status: "recovering",
        statusText: "Recovering (24–48h)",
        hoursAgo,
        recoveryPercent,
      };
    } else {
      return {
        ...muscle,
        status: "ready",
        statusText: "Fully Recovered (48h+)",
        hoursAgo,
        recoveryPercent: 100,
      };
    }
  });
}

export function calculateMuscleRecovery(sessionHistory = []) {
  const now = Date.now();
  const muscleLastTrained = {};

  (sessionHistory || []).forEach((session) => {
    const sessionTime = session.timestamp ? new Date(session.timestamp).getTime() : new Date(session.date || 0).getTime();
    if (isNaN(sessionTime)) return;

    const exercises = session.exercises || [];
    exercises.forEach((ex) => {
      const target = (ex.targetMuscle || ex.target || ex.bodyPart || ex.exerciseName || "").toLowerCase();
      
      const checkAndSet = (muscleKey) => {
        if (!muscleLastTrained[muscleKey] || sessionTime > muscleLastTrained[muscleKey]) {
          muscleLastTrained[muscleKey] = sessionTime;
        }
      };

      if (target.includes("chest") || target.includes("pectoral") || target.includes("push") || target.includes("bench")) checkAndSet("chest");
      if (target.includes("back") || target.includes("lat") || target.includes("pull") || target.includes("row") || target.includes("deadlift")) checkAndSet("back");
      if (target.includes("leg") || target.includes("quad") || target.includes("hamstring") || target.includes("glute") || target.includes("squat") || target.includes("calf")) checkAndSet("legs");
      if (target.includes("shoulder") || target.includes("delt") || target.includes("press")) checkAndSet("shoulders");
      if (target.includes("bicep") || target.includes("tricep") || target.includes("arm") || target.includes("curl")) checkAndSet("arms");
      if (target.includes("ab") || target.includes("core") || target.includes("waist") || target.includes("plank")) checkAndSet("core");
    });
  });

  return MUSCLE_GROUPS_LIST.map((mg) => {
    const lastTime = muscleLastTrained[mg.id];
    if (!lastTime) {
      return {
        ...mg,
        status: "ready",
        statusText: "Ready to Train",
        hoursAgo: null,
        recoveryPercent: 100,
      };
    }

    const hoursAgo = Math.max(0, Math.round((now - lastTime) / (1000 * 60 * 60)));

    if (hoursAgo < 24) {
      const recoveryPercent = Math.min(60, Math.round((hoursAgo / 24) * 60));
      return {
        ...mg,
        status: "fatigued",
        statusText: "Fatigued (< 24h)",
        hoursAgo,
        recoveryPercent,
      };
    } else if (hoursAgo < 48) {
      const recoveryPercent = 60 + Math.round(((hoursAgo - 24) / 24) * 35);
      return {
        ...mg,
        status: "recovering",
        statusText: "Recovering (24–48h)",
        hoursAgo,
        recoveryPercent,
      };
    } else {
      return {
        ...mg,
        status: "ready",
        statusText: "Fully Recovered (48h+)",
        hoursAgo,
        recoveryPercent: 100,
      };
    }
  });
}
