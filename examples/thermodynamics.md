# Thermodynamics reference set

Maintainer reference material for checking Learner Kit skills. It is not limited to one supported topic. Each problem lists the learner-facing statement first. Expected reasoning and answers are kept separate so the statement can be pasted into a chat without giving away the solution.

Contents: concept notes; five problems (P5 is a transfer variant of P2) with a diagnosis scenario in P4; a heat-versus-temperature explanation; sample study notes with a deliberate error; retrieval prompts; a short conceptual argument; and common mistakes.

## Conventions and sources

- **Sign convention:** first law written as ΔU = Q − W, where Q is heat **added to** the system and W is work done **by** the system on its surroundings. This follows OpenStax *University Physics Volume 2*, Chapter 3 ("The First Law of Thermodynamics"), <https://openstax.org/books/university-physics-volume-2/pages/3-introduction>.
  - Chemistry texts often write ΔU = q + w, where w is work done **on** the system. Both give the same physical answer: w = −W. Accept either convention when the learner states it and applies it consistently.
- **Units:** SI. Energy in joules (J), volume in litres (L) or m³, temperature in kelvin (K).
- **Gas constant:** R = 8.314 462 618 153 24 J·mol⁻¹·K⁻¹ (exact under the 2019 SI as N_A·k; CODATA, <https://physics.nist.gov/cgi-bin/cuu/Value?r>). R = 8.314 J·mol⁻¹·K⁻¹ is fine for three significant figures.
- **Specific heats:** water ≈ 4.19 kJ·kg⁻¹·K⁻¹, copper ≈ 0.385 kJ·kg⁻¹·K⁻¹, aluminium ≈ 0.90 kJ·kg⁻¹·K⁻¹ near room temperature (OpenStax *University Physics Volume 2*, §1.5 "Heat Transfer, Specific Heat, and Calorimetry"). Tables differ in the third digit; the answers below are given to two significant figures so they do not depend on which table is used.
- **Second law:** Kelvin–Planck statement as in OpenStax *University Physics Volume 2*, Chapter 4 ("The Second Law of Thermodynamics").
- **Free expansion:** OpenStax *University Physics Volume 2*, §4.7 "Entropy on a Microscopic Scale", <https://openstax.org/books/university-physics-volume-2/pages/4-7-entropy-on-a-microscopic-scale>.
- **Verification:** the arithmetic below was recomputed in Python on 2026-10-01.

## Concept notes

- **Internal energy U** is a state function. ΔU depends only on the initial and final states, not on the path.
- **Heat Q and work W** are energy transfers that depend on the path. A system does not "contain" heat or work.
- **Ideal gas:** U depends only on temperature, so ΔU = 0 for any isothermal process of an ideal gas.
- **Isothermal expansion and heat.** Constant temperature does not by itself mean Q = 0. For an ideal gas that expands isothermally **and does positive net work**, ΔU = 0, so Q = W > 0 and the gas absorbs heat. P2 and P5 are examples.
- **Exception: free expansion.** An ideal gas expanding into a vacuum inside an insulated container does no work and exchanges no heat: Q = W = ΔU = 0, and its temperature does not change. That process is both isothermal and adiabatic, so the two are not mutually exclusive. A learner who gives this counterexample is correct. (OpenStax *University Physics Volume 2*, §4.7 "Entropy on a Microscopic Scale", free expansion of an ideal gas.)
- **Reversible isothermal work (ideal gas):** W = nRT ln(V₂/V₁). It is positive for an expansion under the convention above. The logarithm is natural.

## Problems

### P1. First-law bookkeeping

**Learner-facing statement:** A gas in a piston–cylinder absorbs 500 J of heat from a burner. At the same time it pushes the piston out and does 200 J of work on the surroundings. What is the change in the gas's internal energy?

**Expected reasoning:** Heat is added, so Q = +500 J. Work is done by the gas, so W = +200 J. ΔU = Q − W = 500 J − 200 J.

**Answer:** ΔU = **+300 J**. The internal energy increases.

In the ΔU = q + w convention, q = +500 J and w = −200 J, which gives the same +300 J.

### P2. Reversible isothermal expansion (homework walkthrough problem)

**Learner-facing statement:** 2.0 mol of an ideal gas expands isothermally and reversibly at 300 K from 10.0 L to 20.0 L. Find the work done by the gas W, the heat Q, and the change in internal energy ΔU.

**Expected reasoning:**

1. Ideal gas and isothermal, so ΔU = 0.
2. Reversible isothermal work: W = nRT ln(V₂/V₁) = (2.0 mol)(8.314 J·mol⁻¹·K⁻¹)(300 K) ln(20.0/10.0).
3. nRT = 4988.7 J and ln 2 = 0.69315, so W = 3457.9 J ≈ 3.46 kJ (work done by the gas, positive).
4. First law: Q = ΔU + W = 0 + 3.46 kJ.

**Answer:** ΔU = **0**, W = **+3.46 kJ** (by the gas), Q = **+3.46 kJ** (absorbed by the gas). The volumes enter only as a ratio, so litres need no conversion.

**Bounded-hint ladder** (for checking that hints stay bounded):

1. Since an ideal gas's internal energy depends only on temperature, what must ΔU be for this process?
2. For a reversible process, W = ∫P dV. Use the ideal-gas law to write P in terms of V at constant T.
3. Evaluate the integral between V₁ and V₂, then use the first law for Q.

### P3. Paddle wheel in a rigid tank (energy-balance practice)

**Learner-facing statement:** A rigid, closed tank contains water. A paddle wheel driven by a motor stirs the water, doing 30 kJ of work on it. During the same time the tank loses 5 kJ of heat to the room. What is the change in the water's internal energy?

**Success standard:** a value for ΔU with sign and units, and the first-law expression with the signs of Q and W stated.

**Expected reasoning:** Heat leaves the system, so Q = −5 kJ. Work is done **on** the water, so the work done by the system is W = −30 kJ. ΔU = Q − W = −5 kJ − (−30 kJ).

**Answer:** ΔU = **+25 kJ**. With ΔU = q + w: q = −5 kJ and w = +30 kJ, which gives the same +25 kJ. A rigid tank does no boundary work, but shaft work from the paddle wheel still crosses the boundary.

### P4. Compression with heat loss (sign-error diagnosis scenario)

**Learner-facing statement:** A gas is compressed in a piston–cylinder. The surroundings do 800 J of work on the gas, and the gas releases 300 J of heat. Find ΔU.

**Learner answer supplied for diagnosis:** "ΔU = Q − W = −300 − 800 = −1100 J."

**Correct reasoning:** Q = −300 J (heat leaves). Work done **by** the gas is W = −800 J, because work is done on it. ΔU = −300 J − (−800 J) = **+500 J**.

**Observed error:** the learner used W = +800 J in ΔU = Q − W. The sign of Q is correct.

**Plausible causes**, consistent with what was written:

- They took W as work done **on** the gas (the chemistry convention) but used the physics formula ΔU = Q − W.
- They read "800 J of work" as a positive number without checking its direction.

The answer alone cannot tell these apart. A good diagnostic question is "In ΔU = Q − W, what does W stand for?" Avoid labelling the learner (for example "has a sign misconception"). Describe the error in this answer.

### P5. Irreversible isothermal expansion (transfer variant of P2)

**Change from P2:** one assumption changes, from reversible to irreversible. Everything else is the same.

**Learner-facing statement:** The same 2.0 mol of ideal gas starts at 300 K in 10.0 L. It expands to 20.0 L against a constant external pressure equal to its final pressure, and ends at 300 K. Find W, Q and ΔU.

**Expected reasoning:**

1. The initial and final temperatures are both 300 K and U depends only on T for an ideal gas, so ΔU = 0. This carries over from P2.
2. Against a constant external pressure, W = P_ext ΔV. P_ext = P_final = nRT/V₂ = (2.0)(8.314)(300)/(0.0200 m³) = 2.49 × 10⁵ Pa. ΔV = 0.0100 m³. This changes from P2: the ln formula only applies to a reversible path.
3. W = (2.494 × 10⁵ Pa)(0.0100 m³) = 2494 J ≈ **+2.49 kJ** (by the gas). Equivalently W = nRT(1 − V₁/V₂) = nRT/2.
4. Q = ΔU + W = **+2.49 kJ**.

**Answer:** ΔU = **0**, W = Q = **+2.49 kJ**. This is less than the reversible +3.46 kJ, as expected: a reversible expansion does the most work between the same two states. The initial pressure (4.99 × 10⁵ Pa) is above P_ext, so the gas does expand.

**What carries over:** ΔU = 0 for an ideal gas at the same T, and the first law Q = ΔU + W. **What changes:** the work integral; W = nRT ln(V₂/V₁) no longer applies. Common transfer error: reusing the ln formula and getting 3.46 kJ.

## Heat versus temperature (checked explanation)

- **Temperature** is a property of a system's state. It tells you which way heat will flow when two systems are in thermal contact (from higher to lower T). For an ideal gas it is proportional to the average translational kinetic energy of the molecules.
- **Heat** is energy transferred **because of** a temperature difference. It is a process quantity: a body has internal energy, not "heat".
- **Example:** the same 10 kJ added to 1 kg of water raises its temperature by about 2.4 K, but 1 kg of copper rises by about 26 K. Q = mcΔT, with c ≈ 4.19 kJ·kg⁻¹·K⁻¹ for water and 0.385 for copper. Equal heat produces different temperature changes, so heat and temperature cannot be the same thing.
- **Contrast:** a cup of boiling water is hotter (higher T) than a bathtub of warm water, but the bathtub has far more internal energy, and it can transfer more heat to something colder.

## Sample study notes (for recall, review and erroneous-notes checks)

Paste these as learner-supplied notes. Line 3 is **deliberately wrong**. Line 5 contains a **likely wrong value**. A skill should flag both instead of teaching or quizzing them as true.

```text
1. First law: ΔU = Q − W, Q = heat added to the system, W = work done by the system.
2. For an ideal gas, U depends only on temperature, so ΔU = 0 in an isothermal process.
3. Heat is the thermal energy a body contains; hotter objects contain more heat.
4. Reversible isothermal work for an ideal gas: W = nRT ln(V2/V1).
5. Specific heat of copper: 0.90 J/(g·K).
6. In an adiabatic process Q = 0, so ΔU = −W.
```

- **Line 3:** conflates heat with internal energy and temperature. Heat is energy in transfer. Correction: "Internal energy is the energy a body contains; heat is energy transferred because of a temperature difference."
- **Line 5:** 0.90 J/(g·K) is roughly aluminium's value; copper is about 0.385 J/(g·K). Because this could be a transcription slip, a skill should say it looks wrong and suggest checking a table, rather than assert the learner's source is wrong.

## Retrieval prompts (from the sample notes, lines 1, 2, 4 and 6)

| # | Prompt | Expected answer |
|---|---|---|
| R1 | State the first law and what Q and W mean in it. | ΔU = Q − W. Q is heat added to the system; W is work done by the system. |
| R2 | Why is ΔU = 0 for an isothermal process of an ideal gas? | Its internal energy depends only on temperature, and T is constant. |
| R3 | Give the work done by an ideal gas in a reversible isothermal expansion. | W = nRT ln(V₂/V₁), with a natural log and T in kelvin. |
| R4 | In an adiabatic process, what is Q, and how is ΔU related to W? | Q = 0, so ΔU = −W. Expansion work lowers U, and the gas cools. |
| R5 | Name one difference between heat and temperature. | For example: temperature is a state property, while heat is energy transferred because of a temperature difference. |

## Conceptual example (non-numerical check)

**Prompt:** "Someone claims that a ship engine which extracts heat from the ocean and converts all of it into work violates the first law of thermodynamics. Is the claim right? Argue your answer."

**Expected reasoning:** The claim is wrong about **which** law is broken. Converting heat entirely into work conserves energy, so the first law is satisfied. It violates the second law (Kelvin–Planck statement): no cyclic device can take heat from a single reservoir and convert it completely into work. A good answer separates "is energy conserved?" from "is this conversion possible?"

**Grading note:** judge the argument on whether it identifies the right law and gives a reason. There is no numerical answer. Partial credit applies, for example correctly saying "the first law is fine" without naming the second law.

## Common mistakes

| Mistake | What it produces | Where it comes from |
|---|---|---|
| Adding W instead of subtracting it (P1) | ΔU = 700 J | Mixing the Q − W and q + w conventions |
| Setting Q = 0 because "temperature is constant" (P2) | Q = 0, so ΔU = −W | Assuming constant temperature means no heat transfer. In P2 the gas does positive work, so Q = W > 0. (Q = 0 only fits a process with no work either, such as free expansion.) |
| Using log₁₀ instead of ln (P2) | W ≈ 1.50 kJ | Calculator habit |
| Using T in °C (P2) | W ≈ 311 J | Not converting to kelvin |
| Assuming ΔU ≠ 0 because the gas "did work" (P2) | Non-zero ΔU | Not using the fact that ideal-gas U depends only on T |
| Using +W for work done on the gas in ΔU = Q − W (P3, P4) | P3: −35 kJ; P4: −1100 J | Mixing conventions |
| Reusing W = nRT ln(V₂/V₁) for an irreversible expansion (P5) | W = 3.46 kJ | Not checking the method's assumptions |
| Saying the first law forbids converting all heat into work (conceptual) | Wrong law cited | Confusing energy conservation with the limits on converting heat into work |
| Reporting W as negative while saying "work done by the gas" (P2) | Sign inconsistent with the stated convention | Unclear about which convention is in use. This is a defensible alternative if the learner explicitly uses w on the system. |
