/**
 * Gym Experience Utilities:
 * - Muscle-targeted Pre-Workout Dynamic Warm-ups with Step-by-Step Instructions & Technique Guides
 * - Muscle-targeted Post-Workout Static Cooldown Stretches with Biomechanical Form Cues
 * - Warm-Up Sets Pyramid Calculator
 * - Barbell Plate Calculator (kg and lbs)
 * - Web Audio API Chimes
 * - Muscle Fatigue & Recovery Heatmap Calculator
 */

// ── 1. PRE-WORKOUT DYNAMIC WARM-UP ROUTINES ───────────────────────────────────
export const WARMUP_ROUTINES_BY_MUSCLE = {
  chest: [
    {
      name: "Arm Circles (Forward & Backward)",
      duration: "30s",
      reps: "15 each way",
      target: "Shoulders, Rotator Cuff & Upper Chest",
      instructions: [
        "Extend arms straight out to sides parallel to the ground at shoulder height.",
        "Begin making small, controlled circles forward, gradually increasing circle diameter.",
        "Reverse direction after 15 repetitions to open up the glenohumeral joint capsule.",
      ],
      cue: "Keep core braced and shoulders depressed — avoid shrugging your traps up to your ears.",
    },
    {
      name: "Band Pull-Aparts / Chest Openers",
      duration: "45s",
      reps: "15-20 reps",
      target: "Anterior Chest, Scapular Retractors & Rear Delts",
      instructions: [
        "Hold resistance band (or arms outstretched) at shoulder height in front of chest.",
        "Squeeze shoulder blades together as you pull hands apart until arms form a straight line.",
        "Slowly control the return to start position with tension throughout.",
      ],
      cue: "Feel chest open up while actively firing rhomboids and middle trapezius.",
    },
    {
      name: "Push-up to Downward Dog",
      duration: "45s",
      reps: "8-10 reps",
      target: "Chest, Serratus Anterior, Triceps & Hamstrings",
      instructions: [
        "Perform a controlled standard push-up lowering chest to 2 inches off the floor.",
        "Press up explosively through palms, driving hips straight up and back into Downward Dog.",
        "Press chest gently toward thighs to stretch calves and activate shoulder stabilizers.",
      ],
      cue: "Synchronize deep inhale on the push-up and full exhale into Downward Dog.",
    },
    {
      name: "Scapular Wall Slides",
      duration: "40s",
      reps: "12 reps",
      target: "Serratus Anterior & Scapular Mobility for Bench Press",
      instructions: [
        "Stand with lower back, head, elbows, and wrists flush against a smooth wall.",
        "Slide forearms upward into a 'Y' position while maintaining full wall contact.",
        "Squeeze shoulder blades downward at the top, then slowly slide back to start.",
      ],
      cue: "Don't let your lower back arch off the wall; keep ribs tucked down.",
    },
  ],
  back: [
    {
      name: "Cat-Cow Dynamic Mobility",
      duration: "45s",
      reps: "10 cycles",
      target: "Spinal Articulation, Lats & Thoracic Mobility",
      instructions: [
        "Start on all fours with wrists under shoulders and knees directly under hips.",
        "Inhale: drop belly toward floor, lift chest and tailbone upward into Cow.",
        "Exhale: round spine upward toward ceiling, tucking chin to chest into Cat.",
      ],
      cue: "Move vertebrae segment by segment rather than hinging only at the lower back.",
    },
    {
      name: "Scapular Retraction Pulls",
      duration: "40s",
      reps: "12-15 reps",
      target: "Rhomboids, Lower Traps & Lat Activation",
      instructions: [
        "Hang from a pull-up bar or light cable row with straight arms.",
        "Without bending elbows, pull shoulder blades down and together, lifting chest slightly.",
        "Hold contraction for 1 second, then slowly release to a dead hang.",
      ],
      cue: "Isolate movement purely to scapular glide — do not use your biceps.",
    },
    {
      name: "Dead Hang / Lat Stretch",
      duration: "30s",
      reps: "2 × 15s holds",
      target: "Latissimus Dorsi & Intervertebral Decompression",
      instructions: [
        "Grip pull-up bar with overhand grip slightly wider than shoulder-width.",
        "Allow entire body weight to hang relaxed while keeping a slight core engagement.",
        "Take deep diaphragmatic breaths expanding your ribcage to stretch lat insertions.",
      ],
      cue: "Release tension in the lower back and let gravity elongate your spine.",
    },
    {
      name: "Band Dislocates / Pass-Throughs",
      duration: "40s",
      reps: "12 reps",
      target: "Shoulder Girdle & Lat Tie-in",
      instructions: [
        "Hold band or PVC pipe with wide grip in front of your thighs.",
        "Keeping arms straight, lift bar overhead and rotate fully behind your lower back.",
        "Reverse path smoothly back to the front without bending elbows.",
      ],
      cue: "Widen grip if elbows bend; keep movement fluid without forcing joint angles.",
    },
  ],
  legs: [
    {
      name: "Leg Swings (Front/Back & Lateral)",
      duration: "45s",
      reps: "12 each leg",
      target: "Hamstrings, Hip Flexors, Adductors & Glutes",
      instructions: [
        "Lightly hold wall or rack for balance while standing tall on one leg.",
        "Swing free leg forward and back in a pendulum motion with increasing range.",
        "Turn facing the wall and swing leg across body side-to-side to loosen adductors.",
      ],
      cue: "Keep torso upright and stable; do not twist lower back to force leg height.",
    },
    {
      name: "Deep Bodyweight Squats with Pause",
      duration: "45s",
      reps: "10 reps",
      target: "Quadriceps, Glutes, Adductors & Ankle Dorsiflexion",
      instructions: [
        "Stand feet shoulder-width apart, toes angled out 15–30 degrees.",
        "Break at hips and knees together, sinking into a full deep squat below parallel.",
        "Pause in the bottom 'hole' for 2 seconds, gently shifting weight between ankles.",
      ],
      cue: "Push knees outward in line with toes and keep chest upright and proud.",
    },
    {
      name: "Walking Lunges with Torso Twist",
      duration: "45s",
      reps: "8 per leg",
      target: "Hip Flexor Dynamic Opening & Thoracic Rotation",
      instructions: [
        "Take a long step forward into a lunge until back knee hovers 1 inch off floor.",
        "Rotate upper torso slowly over your front knee to stretch the back hip flexor.",
        "Drive through front heel to step forward directly into the next lunge.",
      ],
      cue: "Maintain 90-degree bend at front knee; do not let knee collapse inward.",
    },
    {
      name: "Ankle Mobility Wall Drive",
      duration: "30s",
      reps: "10 per side",
      target: "Talocrural Dorsiflexion (Crucial for Squat Depth)",
      instructions: [
        "Place toes 3–4 inches away from wall in a half-kneeling or standing split stance.",
        "Drive knee straight forward toward wall, keeping the heel firmly planted on floor.",
        "Hold 2-second end-range stretch, then return and repeat.",
      ],
      cue: "Ensure heel never lifts off the ground to maximize true calf and ankle mobility.",
    },
  ],
  shoulders: [
    {
      name: "Arm Circles & Cross-Body Swings",
      duration: "30s",
      reps: "15 reps",
      target: "Deltoids & Pectoralis Major",
      instructions: [
        "Swing arms across chest alternately crossing left over right, then right over left.",
        "Follow with full 360-degree circular shoulder rotations.",
      ],
      cue: "Keep shoulders relaxed and breathe rhythmically.",
    },
    {
      name: "External Rotations (Band / Face Pull)",
      duration: "45s",
      reps: "15 reps",
      target: "Infraspinatus, Teres Minor & Supraspinatus",
      instructions: [
        "Tuck elbows tight against your ribs at 90 degrees.",
        "Rotate forearms outward away from belly button against light resistance.",
        "Squeeze rear shoulder blades together for 1 full second.",
      ],
      cue: "Never use heavy resistance for rotator cuff warmups — precision over load.",
    },
    {
      name: "Prone Y-T-W Raises",
      duration: "45s",
      reps: "8 each",
      target: "Lower/Mid Traps & Posterior Deltoids",
      instructions: [
        "Lie face down on bench or floor with thumbs pointing toward the ceiling.",
        "Lift arms into a 'Y' shape (lower traps), then 'T' (rhomboids), then 'W' (rotator cuff).",
        "Hold top contraction for 1 second with chin tucked.",
      ],
      cue: "Initiate lift from shoulder blades, not by arching your neck.",
    },
  ],
  arms: [
    {
      name: "Wrist & Forearm Circles",
      duration: "30s",
      reps: "15 each way",
      target: "Carpal & Forearm Flexor/Extensor Warmup",
      instructions: [
        "Interlace fingers and roll wrists in circular patterns in both directions.",
        "Extend arm and gently pull fingers back with opposite hand to open flexors.",
      ],
      cue: "Essential before heavy curls, triceps pushdowns, and bench press.",
    },
    {
      name: "Push-ups on Incline",
      duration: "45s",
      reps: "12 reps",
      target: "Triceps, Elbow Joints & Pectoral Prep",
      instructions: [
        "Place hands on a sturdy bench or rack slightly narrower than shoulder width.",
        "Keep elbows tucked close to torso at 45 degrees as you lower chest.",
        "Press through palms to lockout, warming up elbow tendons.",
      ],
      cue: "Keep body in one straight line from heels to crown of head.",
    },
  ],
  core: [
    {
      name: "Bird-Dogs",
      duration: "45s",
      reps: "10 each side",
      target: "Posterior Chain, Glute & Anti-Rotational Core",
      instructions: [
        "On all fours, extend right arm straight forward and left leg straight back simultaneously.",
        "Reach long without letting hips tilt or lower back sag.",
        "Hold for 2 seconds, return under control, and switch sides.",
      ],
      cue: "Imagine balancing a cup of water on your lower back throughout the move.",
    },
    {
      name: "Deadbugs",
      duration: "45s",
      reps: "10 each side",
      target: "Deep Transverse Abdominis Activation",
      instructions: [
        "Lie on back with arms pointing to ceiling and knees bent at 90 degrees.",
        "Press lower back firmly into the floor (no gap).",
        "Slowly extend opposite arm and leg toward floor while maintaining lower back contact.",
      ],
      cue: "If your lower back arches off the mat, reduce the leg reach distance.",
    },
  ],
  default: [
    {
      name: "Jumping Jacks / Dynamic Cardio",
      duration: "45s",
      reps: "30-40 reps",
      target: "Heart Rate Elevation & Core Body Temperature",
      instructions: [
        "Jump feet outward while sweeping arms overhead.",
        "Return immediately on balls of feet with light, springy rhythm.",
      ],
      cue: "Land softly on midfoot to absorb impact smoothly.",
    },
    {
      name: "World's Greatest Stretch (Lunge + T-Spine)",
      duration: "60s",
      reps: "5 per side",
      target: "Hip Flexors, Thoracic Spine, Hamstrings & Adductors",
      instructions: [
        "Step into a deep forward lunge with both hands inside front foot.",
        "Drop inside elbow toward front ankle, then rotate chest and extend arm to ceiling.",
        "Plant hand, straighten front leg into a hamstring stretch, then switch sides.",
      ],
      cue: "Follow your elevated hand with your eyes as you rotate your thoracic spine.",
    },
    {
      name: "Inchworms to Plank",
      duration: "45s",
      reps: "6 reps",
      target: "Hamstrings, Calves, Shoulders & Anterior Core",
      instructions: [
        "Stand tall, hinge forward with straight legs until hands touch floor.",
        "Walk hands forward one by one into a solid high plank position.",
        "Hold plank for 1 second, then walk feet forward toward hands.",
      ],
      cue: "Keep legs as straight as comfortable to stretch the posterior chain.",
    },
  ],
};

// ── 2. POST-WORKOUT STATIC COOLDOWN STRETCHES ──────────────────────────────────
export const COOLDOWN_STRETCHES_BY_MUSCLE = {
  chest: [
    {
      name: "Doorway Pec Stretch",
      duration: 30,
      target: "Pectoralis Major & Sternal Head",
      instructions: [
        "Stand in doorway, place forearm and elbow flush on the door jamb at 90 degrees.",
        "Gently step through with one foot until a comfortable stretch is felt across the chest.",
        "Hold steady, breathe deeply into your ribs, then switch arms.",
      ],
      cue: "Do not twist your spine; keep torso square and shoulders relaxed.",
    },
    {
      name: "Cross-Body Posterior Shoulder Stretch",
      duration: 30,
      target: "Rear Deltoids & Infraspinatus",
      instructions: [
        "Bring right arm straight across chest at shoulder level.",
        "Use left forearm to gently hug the right elbow in toward your torso.",
        "Depress your right shoulder down away from your ear while pulling.",
      ],
      cue: "Feel the back of the shoulder cap open up without rotating the ribcage.",
    },
    {
      name: "Overhead Triceps & Lat Stretch",
      duration: 30,
      target: "Triceps Long Head & Upper Lats",
      instructions: [
        "Reach right hand down the center of your upper back between shoulder blades.",
        "Gently grasp right elbow with left hand and apply light downward pressure.",
        "Keep spine neutral without arching lower back.",
      ],
      cue: "Breathe into the side of your torso to lengthen the latissimus dorsi.",
    },
  ],
  back: [
    {
      name: "Child's Pose Lat Stretch",
      duration: 35,
      target: "Latissimus Dorsi, Erector Spinae & Hips",
      instructions: [
        "Kneel on floor with big toes touching and knees spread wide.",
        "Sink hips back onto heels, reach arms far forward, and rest forehead on mat.",
        "Walk both hands 6 inches to the left to deeply stretch the right lat, then switch sides.",
      ],
      cue: "Allow every exhale to sink your chest closer to the floor.",
    },
    {
      name: "Cat-Cow Slow Decompression",
      duration: 30,
      target: "Spinal Intervertebral Discs & Lower Back",
      instructions: [
        "On all fours, move slowly between arched cow and rounded cat.",
        "Hold each position for 3–4 full breaths to decompress spinal load from heavy lifting.",
      ],
      cue: "Focus on gentle breathing to downregulate your nervous system from lifting mode.",
    },
    {
      name: "Seated Spinal Twist",
      duration: 30,
      target: "Thoracic Spine, Rhomboids & Gluteus Medius",
      instructions: [
        "Sit tall with legs straight; cross right foot over left knee on the floor.",
        "Place left elbow outside right knee and right hand behind your hips.",
        "Gently rotate torso to look over your right shoulder.",
      ],
      cue: "Lengthen spine on every inhale, deepen the rotation slightly on every exhale.",
    },
  ],
  legs: [
    {
      name: "Standing / Lying Quad Stretch",
      duration: 30,
      target: "Rectus Femoris & Hip Flexors",
      instructions: [
        "Stand tall (or lie on side), bend one knee bringing heel toward glute.",
        "Grasp ankle with hand, pull heel snug to glute while keeping knees aligned.",
        "Gently tuck pelvis under (posterior pelvic tilt) to intensify hip flexor stretch.",
      ],
      cue: "Do not let knee flare outward to the side; keep thighs parallel.",
    },
    {
      name: "Seated Single-Leg Hamstring Reach",
      duration: 30,
      target: "Hamstrings & Popliteal Fossa",
      instructions: [
        "Sit with right leg extended straight and left sole against inner right thigh.",
        "Hinge at the hips keeping lower back flat, reaching hands toward right toes.",
        "Hold at first sensation of gentle tension without bouncing.",
      ],
      cue: "Lead with your chest rather than rounding your upper back to reach your toes.",
    },
    {
      name: "Pigeon Pose / Glute Stretch",
      duration: 35,
      target: "Gluteus Maximus, Piriformis & Deep Hip Rotators",
      instructions: [
        "From plank, bring right shin forward across the mat with knee near right wrist.",
        "Slide left leg straight back, squaring hips toward the floor.",
        "Walk hands forward and lower chest toward front shin as comfortable.",
      ],
      cue: "Keep hips level — place a rolled towel under the right glute if it sits high.",
    },
    {
      name: "Wall Calf & Achilles Stretch",
      duration: 30,
      target: "Gastrocnemius & Soleus",
      instructions: [
        "Stand facing wall, step left leg back in a long split stance with back heel flat.",
        "Bend front knee and lean chest into wall until deep stretch is felt in back calf.",
      ],
      cue: "Keep back leg completely straight and back toes pointing directly forward.",
    },
  ],
  shoulders: [
    {
      name: "Behind-the-Back Chest & Anterior Shoulder Opener",
      duration: 30,
      target: "Anterior Deltoids & Clavicular Head",
      instructions: [
        "Interlace fingers behind lower back with arms extended.",
        "Roll shoulder blades back and down, gently lifting hands away from hips.",
        "Hold chest tall with chin level.",
      ],
      cue: "Do not lean forward; maintain an upright standing posture.",
    },
    {
      name: "Thread-the-Needle Stretch",
      duration: 35,
      target: "Rear Delts, Rhomboids & Upper Traps",
      instructions: [
        "Start on all fours, slide right arm palm-up underneath chest across to the left.",
        "Lower right shoulder and right temple gently to rest on the mat.",
      ],
      cue: "Sink weight into the grounded shoulder and relax your neck.",
    },
  ],
  arms: [
    {
      name: "Kneeling Wrist & Forearm Flexor Stretch",
      duration: 30,
      target: "Biceps Tendons & Forearm Flexors",
      instructions: [
        "Kneel and place palms flat on floor with fingers pointing back toward your knees.",
        "Gently lean hips back toward heels until comfortable forearm stretch is felt.",
      ],
      cue: "Keep palms flat on floor; ease off if sharp joint pain occurs.",
    },
    {
      name: "Overhead Triceps Extension Stretch",
      duration: 30,
      target: "Triceps Brachii Long Head",
      instructions: [
        "Reach arm straight overhead, bend elbow so hand drops behind neck.",
        "Use other hand to pull elbow gently back and across.",
      ],
      cue: "Keep head upright — do not push chin down to chest.",
    },
  ],
  core: [
    {
      name: "Cobra / Sphinx Abdominal Stretch",
      duration: 30,
      target: "Rectus Abdominis & Linea Alba",
      instructions: [
        "Lie prone on stomach, place hands under shoulders (or forearms on floor for Sphinx).",
        "Press gently through palms to lift chest off floor while keeping hips grounded.",
        "Look forward with relaxed lower back.",
      ],
      cue: "Do not jam your lumbar spine; think about pulling your chest forward and up.",
    },
    {
      name: "Supine Lying Knee Twist",
      duration: 30,
      target: "Internal/External Obliques & Quadratus Lumborum",
      instructions: [
        "Lie on back, hug knees to chest, then let both knees fall gently to the right.",
        "Extend left arm out to side and turn head to look toward left hand.",
      ],
      cue: "Keep both shoulder blades pinned flat to the floor throughout the twist.",
    },
  ],
  default: [
    {
      name: "Child's Pose to Cobra Flow",
      duration: 35,
      target: "Full Body Decompression & Recovery",
      instructions: [
        "Flow smoothly between sinking hips back into Child's Pose and gliding forward into Cobra.",
        "Sync with slow, calming nasal breaths.",
      ],
      cue: "Transition your nervous system into parasympathetic rest-and-digest mode.",
    },
    {
      name: "Downward Dog Calf & Hamstring Stretch",
      duration: 30,
      target: "Posterior Chain Decompression",
      instructions: [
        "In Downward Dog, alternate gently pressing right heel then left heel into the floor.",
        "Pedal feet at a relaxed, soothing pace.",
      ],
      cue: "Press firmly through fingertips and knuckles to protect wrists.",
    },
  ],
};

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

// ── 6. MUSCLE FATIGUE & RECOVERY HEATMAP ───────────────────────────────────────
export const MUSCLE_GROUPS_LIST = [
  { id: "chest", label: "Chest", emoji: "🛡️" },
  { id: "back", label: "Back", emoji: "🦅" },
  { id: "legs", label: "Legs", emoji: "🦵" },
  { id: "shoulders", label: "Shoulders", emoji: "🥋" },
  { id: "arms", label: "Arms", emoji: "💪" },
  { id: "core", label: "Core", emoji: "⚡" },
];

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
